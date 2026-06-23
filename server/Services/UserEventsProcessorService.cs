using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Npgsql;

public class UserEventsProcessorService : BackgroundService
{
    private readonly int _rate;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<UserEventsProcessorService> _logger;

    public UserEventsProcessorService(
        int rate,
        IServiceProvider serviceProvider,
        ILogger<UserEventsProcessorService> logger
    )
    {
        _rate = rate;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public UserEventsProcessorService(
        IServiceProvider serviceProvider,
        ILogger<UserEventsProcessorService> logger
    )
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(_rate, stoppingToken);
            using var scope = _serviceProvider.CreateScope();
            var ctx = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

            try
            {
                var result = await ctx
                    .UserEvents.OrderBy(userEvent => userEvent.Timestamp)
                    .ToListAsync(stoppingToken);

                foreach (var userEvent in result)
                {
                    var userEventData = userEvent.ToUserEventData();
                    switch (userEvent.Type)
                    {
                        case UserEventType.Created:
                            var existingUser = await ctx.Users.FirstOrDefaultAsync(
                                user => user.Id == userEventData.Id,
                                stoppingToken
                            );
                            if (existingUser == null)
                            {
                                ctx.Users.Add(
                                    new User
                                    {
                                        Id = userEventData.Id,
                                        Username = userEventData.Username!,
                                        Role = UserRole.User,
                                    }
                                );
                            }
                            break;
                        case UserEventType.Deleted:
                            var userToBeDeleted = await ctx.Users.FirstOrDefaultAsync(
                                user => user.Id == userEventData.Id,
                                stoppingToken
                            );
                            if (userToBeDeleted != null && userEventData.Deleted!.Value) // not sure waht deleted field in clerk payload is for
                            {
                                // and other refs in the future
                                ctx.Users.Remove(userToBeDeleted);
                            }
                            else if (userEventData.Deleted!.Value == false)
                            {
                                _logger.LogCritical(
                                    "Deleted field for a delete event is somehow false??"
                                );
                            }
                            break;
                        case UserEventType.Updated:
                            var userToBeUpdated = await ctx.Users.FirstOrDefaultAsync(
                                user => user.Id == userEventData.Id,
                                stoppingToken
                            );
                            if (userToBeUpdated != null)
                            {
                                userToBeUpdated.Username = userEventData.Username!;
                            }
                            break;
                    }
                    ctx.UserEvents.Remove(userEvent);
                }
                await ctx.SaveChangesAsync(stoppingToken);
            }
            catch (DbException e)
            {
                _logger.LogCritical(e, "DB error occured!");
                await Task.Delay(_rate * 3, stoppingToken);
            }
        }
    }
}
