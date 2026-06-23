using Microsoft.EntityFrameworkCore;

[Index(nameof(Username), IsUnique = true)]
public class User : IAuditable
{
    public required string Id { get; set; }
    public required string Username { get; set; }
    public int Reputation { get; set; } = 0;
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
    public required UserRole Role { get; set; }
}

public interface IAuditable
{
    DateTime CreatedAt { get; set; }
    DateTime EditedAt { get; set; }
}

public enum UserRole
{
    User,
    Moderator,
    Admin,
    Owner,
}
