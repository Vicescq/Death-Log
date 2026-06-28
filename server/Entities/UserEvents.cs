using System.Text.Json;
using System.Text.Json.Serialization;

public class UserEvent
{
    [JsonIgnore]
    public long Id { get; set; }
    public required UserEventType Type { get; set; }
    public required ulong Timestamp { get; set; }

    public required JsonElement Data { get; set; }

    public void Trim()
    {
        var id = Data.GetProperty("id").GetString();
        var username = Data.TryGetProperty("username", out var u) ? u.GetString() : null;
        var deleted =
            Data.TryGetProperty("deleted", out var d)
            && (d.ValueKind == JsonValueKind.True || d.ValueKind == JsonValueKind.False)
                ? d.GetBoolean()
                : (bool?)null;

        Data = JsonSerializer.SerializeToElement(
            new
            {
                id,
                username,
                deleted,
            }
        );
    }

    public UserEventData ToUserEventData()
    {
        var id = Data.GetProperty("id").GetString();
        var username = Data.TryGetProperty("username", out var u) ? u.GetString() : null;
        var deleted =
            Data.TryGetProperty("deleted", out var d)
            && (d.ValueKind == JsonValueKind.True || d.ValueKind == JsonValueKind.False)
                ? d.GetBoolean()
                : (bool?)null;
        return new UserEventData
        {
            Id = id!,
            Deleted = deleted,
            Username = username,
        };
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserEventType
{
    [JsonStringEnumMemberName("user.created")]
    Created,

    [JsonStringEnumMemberName("user.deleted")]
    Deleted,

    [JsonStringEnumMemberName("user.updated")]
    Updated,
}

public record UserEventData
{
    public required string Id { get; set; }
    public string? Username { get; set; }
    public bool? Deleted { get; set; }
}
