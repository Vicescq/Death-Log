using System.Data.Common;
using Microsoft.EntityFrameworkCore;

public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
{
    public DbSet<UserEvent> UserEvents => Set<UserEvent>();
    public DbSet<User> Users => Set<User>();
    public DbSet<SharedProfileRecord> SharedProfileRecords => Set<SharedProfileRecord>();
    public DbSet<FollowRecord> FollowRecords => Set<FollowRecord>();

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditFields();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateAuditFields()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<IAuditable>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.EditedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.EditedAt = now;
            }
        }
    }
}

public class GeneralExceptionHandler
{
    private readonly RequestDelegate _next;
    private readonly ILogger<DatabaseContext> _logger;

    public GeneralExceptionHandler(RequestDelegate next, ILogger<DatabaseContext> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        await HandleAsync(
            async () => await _next(ctx),
            _logger,
            () =>
            {
                ctx.Response.StatusCode = StatusCodes.Status500InternalServerError;
                return Task.CompletedTask;
            }
        );
    }

    public static async Task HandleAsync(Func<Task> action, ILogger logger, Func<Task> onError)
    {
        try
        {
            await action();
        }
        catch (OperationCanceledException)
        {
            // swallows error to avoid logging spam
        }
        catch (DbUpdateException e)
        {
            logger.LogCritical(e, "Database update failed");
            await onError();
        }
        catch (DbException e)
        {
            logger.LogCritical(e, "DB error occured!");
            await onError();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Unhandled exception.");
            await onError();
        }
    }
}

public static class GeneralExceptionHandlerExtensions
{
    public static IApplicationBuilder UseDatabaseErrorHandler(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<GeneralExceptionHandler>();
    }
}
