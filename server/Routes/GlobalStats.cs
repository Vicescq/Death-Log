using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

public class GlobalStats
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public static async Task<IResult> PostGlobalStats(
        JsonElement body,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = http.Items["clerkUserId"] as string;
        if (callerId == null)
            return Results.Unauthorized();

        // Content-Length can be omitted (chunked), slipping past the
        // WithMaxBodySize filter, so measure the real payload as the backstop.
        var sizeBytes = Encoding.UTF8.GetByteCount(body.GetRawText());
        if (sizeBytes > EndpointLimits.SixtyFourKb)
            return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);

        var slice = body.Deserialize<GlobalStatsCounts>(JsonOptions);
        if (slice == null || !WithinLimits(slice))
            return Results.BadRequest();

        var userExists = await dbContext.Users.AnyAsync(user => user.Id == callerId, ct);
        if (!userExists)
            return Results.NotFound();

        var row = await dbContext.UserGlobalStats.FirstOrDefaultAsync(
            existing => existing.UserId == callerId,
            ct
        );
        if (row == null)
        {
            dbContext.UserGlobalStats.Add(
                new UserGlobalStat
                {
                    UserId = callerId,
                    Deaths = slice.Deaths,
                    Games = slice.Games,
                    Profiles = slice.Profiles,
                    Subjects = slice.Subjects,
                    BossDeaths = slice.BossDeaths,
                    MiniBossDeaths = slice.MiniBossDeaths,
                    LocationDeaths = slice.LocationDeaths,
                    GenericDeaths = slice.GenericDeaths,
                    OtherDeaths = slice.OtherDeaths,
                }
            );
        }
        else
        {
            row.Deaths = slice.Deaths;
            row.Games = slice.Games;
            row.Profiles = slice.Profiles;
            row.Subjects = slice.Subjects;
            row.BossDeaths = slice.BossDeaths;
            row.MiniBossDeaths = slice.MiniBossDeaths;
            row.LocationDeaths = slice.LocationDeaths;
            row.GenericDeaths = slice.GenericDeaths;
            row.OtherDeaths = slice.OtherDeaths;
        }

        await dbContext.SaveChangesAsync(ct);
        return Results.Ok();
    }

    public static async Task<IResult> GetGlobalStats(
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var totals = await dbContext
            .UserGlobalStats.GroupBy(_ => 1)
            .Select(group => new
            {
                Deaths = group.Sum(row => row.Deaths),
                Games = group.Sum(row => row.Games),
                Profiles = group.Sum(row => row.Profiles),
                Subjects = group.Sum(row => row.Subjects),
                BossDeaths = group.Sum(row => row.BossDeaths),
                MiniBossDeaths = group.Sum(row => row.MiniBossDeaths),
                LocationDeaths = group.Sum(row => row.LocationDeaths),
                GenericDeaths = group.Sum(row => row.GenericDeaths),
                OtherDeaths = group.Sum(row => row.OtherDeaths),
            })
            .FirstOrDefaultAsync(ct);

        var summary = new GlobalStatsCounts(
            totals?.Deaths ?? 0,
            totals?.Games ?? 0,
            totals?.Profiles ?? 0,
            totals?.Subjects ?? 0,
            totals?.BossDeaths ?? 0,
            totals?.MiniBossDeaths ?? 0,
            totals?.LocationDeaths ?? 0,
            totals?.GenericDeaths ?? 0,
            totals?.OtherDeaths ?? 0
        );

        return Results.Ok(summary);
    }

    private static bool WithinLimits(GlobalStatsCounts slice) =>
        InRange(slice.Deaths, GlobalStatsLimits.MaxDeaths)
        && InRange(slice.Games, GlobalStatsLimits.MaxNodes)
        && InRange(slice.Profiles, GlobalStatsLimits.MaxNodes)
        && InRange(slice.Subjects, GlobalStatsLimits.MaxNodes)
        && InRange(slice.BossDeaths, GlobalStatsLimits.MaxDeaths)
        && InRange(slice.MiniBossDeaths, GlobalStatsLimits.MaxDeaths)
        && InRange(slice.LocationDeaths, GlobalStatsLimits.MaxDeaths)
        && InRange(slice.GenericDeaths, GlobalStatsLimits.MaxDeaths)
        && InRange(slice.OtherDeaths, GlobalStatsLimits.MaxDeaths);

    private static bool InRange(int value, int max) => value >= 0 && value <= max;
}
