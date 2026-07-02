using Microsoft.EntityFrameworkCore;

public class BrowseUsers
{
    public static async Task<IResult> Browse(
        string? exclude,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        return Results.Ok(new DiscoveredUsers(await BrowseRandomly(dbContext, exclude, ct), []));
    }

    private static async Task<List<DiscoveredUser>> BrowseRandomly(
        DatabaseContext dbContext,
        string? exclude,
        CancellationToken ct
    )
    {
        var query = dbContext.Users.AsQueryable();
        if (exclude != null)
        {
            query = query.Where(user => user.Username != exclude);
        }

        var users = await query.OrderBy(user => EF.Functions.Random()).Take(50).ToListAsync(ct);

        var ids = users.Select(user => user.Id).ToList();

        var followingCounts = await dbContext
            .FollowRecords.Where(followRecord => ids.Contains(followRecord.FollowerId))
            .GroupBy(followRecord => followRecord.FollowerId)
            .Select(group => new { UserId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(row => row.UserId, row => row.Count, ct);

        var followerCounts = await dbContext
            .FollowRecords.Where(followRecord => ids.Contains(followRecord.FollowingId))
            .GroupBy(followRecord => followRecord.FollowingId)
            .Select(group => new { UserId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(row => row.UserId, row => row.Count, ct);

        List<DiscoveredUser> discoveredUsers = [];
        foreach (var user in users)
        {
            discoveredUsers.Add(
                new DiscoveredUser(
                    user.Username,
                    followerCounts.GetValueOrDefault(user.Id),
                    followingCounts.GetValueOrDefault(user.Id),
                    user.CreatedAt
                )
            );
        }
        return discoveredUsers;
    }

    private static async Task<IResult> BrowseFamiliar()
    {
        return Results.Accepted();
    }

    private static async Task<IResult> BrowseNew()
    {
        return Results.Accepted();
    }
}
