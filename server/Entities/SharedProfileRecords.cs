using System.Text.Json;
using Microsoft.EntityFrameworkCore;

[Index(nameof(UserId), IsUnique = true)]
public class SharedProfileRecord : IAuditable
{
    public long Id { get; set; }

    public required string UserId { get; set; }
    public User? User { get; init; }
    public required JsonElement SharedProfile { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}
