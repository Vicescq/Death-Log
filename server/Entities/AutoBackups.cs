using System.Text.Json;
using Microsoft.EntityFrameworkCore;

[Index(nameof(UserId))]
public class AutoBackup : IAuditable
{
    public long Id { get; set; }
    public required string UserId { get; set; }
    public User? User { get; set; }
    public required JsonElement Data { get; set; }

    public long SizeBytes { get; set; }
    public int Version { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}
