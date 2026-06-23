using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

public class SharedProfileRecords
{
    public long Id { get; set; }

    [ForeignKey(nameof(User))]
    public required string UserId { get; set; }
    public required User User { get; init; }
    public required JsonElement SharedProfile { get; set; }
}
