using System.Text.Json;
using System.Threading.RateLimiting;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

var allowedOrigin =
    builder.Configuration.GetValue<string>("EnvData:Domain")
    ?? throw new InvalidOperationException("Configuration is not setup correctly");

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "frontend",
        policyBuilder =>
        {
            policyBuilder
                .WithOrigins(allowedOrigin)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
});

var connectionString =
    Environment.GetEnvironmentVariable("CONNECTION_STRING")
    ?? throw new InvalidOperationException("Configuration is not setup correctly");
builder.Services.AddNpgsql<DatabaseContext>(connectionString);

builder.Services.AddHostedService(provider => new UserEventsProcessorService(
    5000,
    provider,
    provider.GetRequiredService<ILogger<UserEventsProcessorService>>()
));

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy(
        RateLimits.BackupWritesPolicy,
        http =>
            RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: RateLimits.PartitionKey(http),
                factory: _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = RateLimits.BackupWritesPermitLimit,
                    Window = TimeSpan.FromMinutes(RateLimits.BackupWritesWindowMinutes),
                }
            )
    );

    options.AddPolicy(
        RateLimits.StandardPolicy,
        http =>
            RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: RateLimits.PartitionKey(http),
                factory: _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = RateLimits.StandardPermitLimit,
                    Window = TimeSpan.FromMinutes(RateLimits.StandardWindowMinutes),
                }
            )
    );
});

var app = builder.Build();

app.UseCors("frontend");

app.UseErrorHandler();

app.UseAuthMiddleware(allowedOrigin);

app.UseRateLimiter();

app.MapGet("/health", () => Results.Ok());

app.MapPost("/users", UserEventsQueue.Push).WithMaxBodySize(EndpointLimits.SixtyFourKb);

app.MapPost("/backup", Backups.PostBackup)
    .Accepts<JsonElement>("application/json")
    .WithMaxBodySize(EndpointLimits.TenMb)
    .RequireRateLimiting(RateLimits.BackupWritesPolicy);

app.MapPost("/auto-backup", Backups.PostAutoBackup)
    .Accepts<JsonElement>("application/json")
    .WithMaxBodySize(EndpointLimits.TenMb)
    .RequireRateLimiting(RateLimits.BackupWritesPolicy);

app.MapGet("/backups", Backups.GetBackups).RequireRateLimiting(RateLimits.StandardPolicy);

app.MapGet("/backup/{id}", Backups.GetBackupById).RequireRateLimiting(RateLimits.StandardPolicy);

app.MapGet("/auto-backup/{id}", Backups.GetAutoBackupById)
    .RequireRateLimiting(RateLimits.StandardPolicy);

app.MapDelete("/backup/{id}", Backups.DeleteBackupById)
    .RequireRateLimiting(RateLimits.StandardPolicy);

app.MapDelete("/auto-backup/{id}", Backups.DeleteAutoBackupById)
    .RequireRateLimiting(RateLimits.StandardPolicy);

app.Run();
