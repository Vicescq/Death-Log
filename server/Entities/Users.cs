using Microsoft.EntityFrameworkCore;

[Index(nameof(Username), IsUnique = true)]
public class User : IAuditable
{
    public required string Id { get; set; }
    public required string Username { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}
