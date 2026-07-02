using Microsoft.EntityFrameworkCore;

public record FollowStatus(bool IsFollowing);

public class Follows
{
    private static string? CallerId(HttpContext http) => http.Items["clerkUserId"] as string;

    public static async Task<IResult> GetFollowStatus(
        string username,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = CallerId(http);
        if (callerId == null)
            return Results.Unauthorized();

        var target = await dbContext.Users.FirstOrDefaultAsync(u => u.Username == username, ct);
        if (target == null)
            return Results.NotFound();

        var isFollowing = await dbContext.FollowRecords.AnyAsync(
            follow => follow.FollowerId == callerId && follow.FollowingId == target.Id,
            ct
        );
        return Results.Ok(new FollowStatus(isFollowing));
    }

    public static async Task<IResult> Follow(
        string username,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = CallerId(http);
        if (callerId == null)
            return Results.Unauthorized();

        var target = await dbContext.Users.FirstOrDefaultAsync(u => u.Username == username, ct);
        if (target == null)
            return Results.NotFound();

        if (target.Id == callerId)
            return Results.BadRequest();

        var alreadyFollowing = await dbContext.FollowRecords.AnyAsync(
            follow => follow.FollowerId == callerId && follow.FollowingId == target.Id,
            ct
        );
        if (!alreadyFollowing)
        {
            dbContext.FollowRecords.Add(
                new FollowRecord { FollowerId = callerId, FollowingId = target.Id }
            );
            await dbContext.SaveChangesAsync(ct);
        }
        return Results.Ok();
    }

    public static async Task<IResult> Unfollow(
        string username,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = CallerId(http);
        if (callerId == null)
            return Results.Unauthorized();

        var target = await dbContext.Users.FirstOrDefaultAsync(u => u.Username == username, ct);
        if (target == null)
            return Results.NotFound();

        var record = await dbContext.FollowRecords.FirstOrDefaultAsync(
            follow => follow.FollowerId == callerId && follow.FollowingId == target.Id,
            ct
        );
        if (record != null)
        {
            dbContext.FollowRecords.Remove(record);
            await dbContext.SaveChangesAsync(ct);
        }
        return Results.Ok();
    }

    private enum FollowDirection
    {
        Followers,
        Following,
    }

    public static Task<IResult> GetFollowers(
        string username,
        DatabaseContext dbContext,
        CancellationToken ct
    ) => GetFollows(username, FollowDirection.Followers, dbContext, ct);

    public static Task<IResult> GetFollowing(
        string username,
        DatabaseContext dbContext,
        CancellationToken ct
    ) => GetFollows(username, FollowDirection.Following, dbContext, ct);

    private static async Task<IResult> GetFollows(
        string username,
        FollowDirection direction,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Username == username, ct);
        if (user == null)
            return Results.NotFound();

        var memberIds = await (
            direction == FollowDirection.Followers
                ? dbContext
                    .FollowRecords.Where(follow => follow.FollowingId == user.Id)
                    .Select(follow => follow.FollowerId)
                : dbContext
                    .FollowRecords.Where(follow => follow.FollowerId == user.Id)
                    .Select(follow => follow.FollowingId)
        ).ToListAsync(ct);

        var users = await dbContext
            .Users.Where(candidate => memberIds.Contains(candidate.Id))
            .ToListAsync(ct);

        var ids = users.Select(candidate => candidate.Id).ToList();

        var followingCounts = await dbContext
            .FollowRecords.Where(follow => ids.Contains(follow.FollowerId))
            .GroupBy(follow => follow.FollowerId)
            .Select(group => new { UserId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(row => row.UserId, row => row.Count, ct);

        var followerCounts = await dbContext
            .FollowRecords.Where(follow => ids.Contains(follow.FollowingId))
            .GroupBy(follow => follow.FollowingId)
            .Select(group => new { UserId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(row => row.UserId, row => row.Count, ct);

        List<DiscoveredUser> discoveredUsers = [];
        foreach (var member in users)
        {
            discoveredUsers.Add(
                new DiscoveredUser(
                    member.Username,
                    followerCounts.GetValueOrDefault(member.Id),
                    followingCounts.GetValueOrDefault(member.Id),
                    member.CreatedAt
                )
            );
        }
        return Results.Ok(discoveredUsers);
    }
}
