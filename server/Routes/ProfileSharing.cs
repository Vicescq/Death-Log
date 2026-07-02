using System.Text.Json;
using Microsoft.EntityFrameworkCore;

public class ProfileSharing
{
    private static readonly JsonSerializerOptions ProfileJsonOptions = new(
        JsonSerializerDefaults.Web
    );

    public static async Task<IResult> PostProfile(
        string username,
        SharedProfile sharedProfile,
        HttpContext http,
        ILogger<Program> logger,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = http.Items["clerkUserId"] as string;
        if (callerId == null)
            return Results.Unauthorized();

        var isValidSharedProfile = sharedProfile.ValidateSpecRules();

        var user = await dbContext.Users.FirstOrDefaultAsync(user => user.Username == username, ct);

        if (user != null && user.Id != callerId)
            return Results.StatusCode(StatusCodes.Status403Forbidden);

        if (user != null && isValidSharedProfile)
        {
            var existingSharedProfile = await dbContext.SharedProfileRecords.FirstOrDefaultAsync(
                sharedProfile => sharedProfile.UserId == user.Id,
                ct
            );

            if (existingSharedProfile == null)
            {
                dbContext.SharedProfileRecords.Add(
                    new SharedProfileRecord
                    {
                        SharedProfile = JsonSerializer.SerializeToElement(
                            sharedProfile,
                            ProfileJsonOptions
                        ),
                        UserId = user.Id,
                    }
                );
            }
            else
            {
                existingSharedProfile.SharedProfile = JsonSerializer.SerializeToElement(
                    sharedProfile,
                    ProfileJsonOptions
                );
            }
            await dbContext.SaveChangesAsync(ct);
            return Results.Ok();
        }
        else if (user == null)
        {
            logger.LogError("Username not found!");
            return Results.NotFound();
        }
        else
        {
            logger.LogError("Shared profile is in an incorrect shape!");
            return Results.UnprocessableEntity();
        }
    }

    public static async Task<IResult> GetProfile(
        string username,
        ILogger<Program> logger,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(user => user.Username == username, ct);
        if (user == null)
            return Results.NotFound();

        var followerCount = await dbContext.FollowRecords.CountAsync(
            follow => follow.FollowingId == user.Id,
            ct
        );
        var followingCount = await dbContext.FollowRecords.CountAsync(
            follow => follow.FollowerId == user.Id,
            ct
        );

        var sharedProfileRecord = await dbContext.SharedProfileRecords.FirstOrDefaultAsync(
            record => record.UserId == user.Id,
            ct
        );

        List<SharedChartSlot> chartSlots = [];
        if (sharedProfileRecord != null)
        {
            var sharedProfile = sharedProfileRecord.SharedProfile.Deserialize<SharedProfile>(
                ProfileJsonOptions
            );

            if (sharedProfile == null)
            {
                logger.LogError(
                    "Shared profile for user {UserId} exists but failed to deserialize",
                    user.Id
                );
                return Results.InternalServerError();
            }
            chartSlots = sharedProfile.ChartSlots;
        }

        var view = new SharedProfileView(followerCount, followingCount, chartSlots);
        return Results.Ok(view);
    }

    public static async Task<IResult> DeleteProfile(
        string username,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = http.Items["clerkUserId"] as string;
        if (callerId == null)
            return Results.Unauthorized();

        var user = await dbContext.Users.FirstOrDefaultAsync(user => user.Username == username, ct);
        if (user == null)
            return Results.NotFound();

        if (user.Id != callerId)
            return Results.StatusCode(StatusCodes.Status403Forbidden);

        var record = await dbContext.SharedProfileRecords.FirstOrDefaultAsync(
            record => record.UserId == user.Id,
            ct
        );
        if (record != null)
        {
            dbContext.SharedProfileRecords.Remove(record);
            await dbContext.SaveChangesAsync(ct);
        }
        return Results.Ok();
    }
}
