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
        ILogger<Program> logger,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var isValidSharedProfile = sharedProfile.ValidateSpecRules();

        var user = await dbContext.Users.FirstOrDefaultAsync(user => user.Username == username, ct);

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
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(user => user.Username == username, ct);
        if (user != null)
        {
            var sharedProfileRecord = await dbContext.SharedProfileRecords.FirstOrDefaultAsync(
                sharedProfile => sharedProfile.UserId == user.Id,
                ct
            );
            if (sharedProfileRecord != null)
            {
                return Results.Ok(sharedProfileRecord.SharedProfile);
            }
            else
            {
                return Results.NotFound();
            }
        }
        return Results.NotFound();
    }
}
