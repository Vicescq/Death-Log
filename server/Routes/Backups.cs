using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

public class Backups
{
    private const int MaxBackupsPerUser = 5;
    private const int MaxAutoBackupsPerUser = 3;

    public static async Task<IResult> PostBackup(
        JsonElement backup,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = http.Items["clerkUserId"] as string;
        if (callerId == null)
            return Results.Unauthorized();

        var userExists = await dbContext.Users.AnyAsync(user => user.Id == callerId, ct);
        if (!userExists)
            return Results.NotFound();

        var sizeBytes = SizeOf(backup);
        if (sizeBytes > EndpointLimits.TenMb)
            return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);

        // need an explicit transaction due to ExecuteDeleteAsync
        await using var transaction = await dbContext.Database.BeginTransactionAsync(ct);

        dbContext.Backups.Add(
            new Backup
            {
                UserId = callerId,
                Data = backup,
                SizeBytes = sizeBytes,
                Version = VersionOf(backup),
            }
        );
        await dbContext.SaveChangesAsync(ct);

        var staleIds = await dbContext
            .Backups.Where(existing => existing.UserId == callerId)
            .OrderByDescending(existing => existing.CreatedAt)
            .ThenByDescending(existing => existing.Id)
            .Skip(MaxBackupsPerUser)
            .Select(existing => existing.Id)
            .ToListAsync(ct);

        if (staleIds.Count > 0)
            await dbContext
                .Backups.Where(existing => staleIds.Contains(existing.Id))
                .ExecuteDeleteAsync(ct);

        await transaction.CommitAsync(ct);
        return Results.Ok();
    }

    public static async Task<IResult> PostAutoBackup(
        JsonElement backup,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = http.Items["clerkUserId"] as string;
        if (callerId == null)
            return Results.Unauthorized();

        var userExists = await dbContext.Users.AnyAsync(user => user.Id == callerId, ct);
        if (!userExists)
            return Results.NotFound();

        var sizeBytes = SizeOf(backup);
        if (sizeBytes > EndpointLimits.TenMb)
            return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);

        // need an explicit transaction due to ExecuteDeleteAsync
        await using var transaction = await dbContext.Database.BeginTransactionAsync(ct);

        dbContext.AutoBackups.Add(
            new AutoBackup
            {
                UserId = callerId,
                Data = backup,
                SizeBytes = sizeBytes,
                Version = VersionOf(backup),
            }
        );
        await dbContext.SaveChangesAsync(ct);

        var staleIds = await dbContext
            .AutoBackups.Where(existing => existing.UserId == callerId)
            .OrderByDescending(existing => existing.CreatedAt)
            .ThenByDescending(existing => existing.Id)
            .Skip(MaxAutoBackupsPerUser)
            .Select(existing => existing.Id)
            .ToListAsync(ct);

        if (staleIds.Count > 0)
            await dbContext
                .AutoBackups.Where(existing => staleIds.Contains(existing.Id))
                .ExecuteDeleteAsync(ct);

        await transaction.CommitAsync(ct);
        return Results.Ok();
    }

    public static async Task<IResult> GetBackups(
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = http.Items["clerkUserId"] as string;
        if (callerId == null)
            return Results.Unauthorized();

        var manualRows = await dbContext
            .Backups.Where(backup => backup.UserId == callerId)
            .Select(backup => new BackupRow(
                backup.Id,
                backup.CreatedAt,
                backup.SizeBytes,
                backup.Version,
                false
            ))
            .ToListAsync(ct);

        var autoRows = await dbContext
            .AutoBackups.Where(backup => backup.UserId == callerId)
            .Select(backup => new BackupRow(
                backup.Id,
                backup.CreatedAt,
                backup.SizeBytes,
                backup.Version,
                true
            ))
            .ToListAsync(ct);

        var summaries = manualRows
            .Concat(autoRows)
            .OrderByDescending(row => row.CreatedAt)
            .ThenByDescending(row => row.Id)
            .Select(row => new CloudBackupSummary(
                row.Id,
                row.CreatedAt.ToString("o"),
                row.SizeBytes,
                row.Version,
                row.Auto
            ))
            .ToList();

        return Results.Ok(summaries);
    }

    public static async Task<IResult> GetBackupById(
        long id,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = http.Items["clerkUserId"] as string;
        if (callerId == null)
            return Results.Unauthorized();

        var data = await dbContext
            .Backups.Where(backup => backup.Id == id && backup.UserId == callerId)
            .Select(backup => backup.Data)
            .FirstOrDefaultAsync(ct);

        if (data.ValueKind == JsonValueKind.Undefined)
            return Results.NotFound();

        return Results.Ok(data);
    }

    public static async Task<IResult> GetAutoBackupById(
        long id,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = http.Items["clerkUserId"] as string;
        if (callerId == null)
            return Results.Unauthorized();

        var data = await dbContext
            .AutoBackups.Where(backup => backup.Id == id && backup.UserId == callerId)
            .Select(backup => backup.Data)
            .FirstOrDefaultAsync(ct);

        if (data.ValueKind == JsonValueKind.Undefined)
            return Results.NotFound();

        return Results.Ok(data);
    }

    public static async Task<IResult> DeleteBackupById(
        long id,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = http.Items["clerkUserId"] as string;
        if (callerId == null)
            return Results.Unauthorized();

        var deleted = await dbContext
            .Backups.Where(backup => backup.Id == id && backup.UserId == callerId)
            .ExecuteDeleteAsync(ct);

        return deleted == 0 ? Results.NotFound() : Results.NoContent();
    }

    public static async Task<IResult> DeleteAutoBackupById(
        long id,
        HttpContext http,
        DatabaseContext dbContext,
        CancellationToken ct
    )
    {
        var callerId = http.Items["clerkUserId"] as string;
        if (callerId == null)
            return Results.Unauthorized();

        var deleted = await dbContext
            .AutoBackups.Where(backup => backup.Id == id && backup.UserId == callerId)
            .ExecuteDeleteAsync(ct);

        return deleted == 0 ? Results.NotFound() : Results.NoContent();
    }

    private static long SizeOf(JsonElement data) => Encoding.UTF8.GetByteCount(data.GetRawText());

    private static int VersionOf(JsonElement data) =>
        data.TryGetProperty("version", out var version) && version.TryGetInt32(out var v) ? v : 0;

    private record BackupRow(long Id, DateTime CreatedAt, long SizeBytes, int Version, bool Auto);
}
