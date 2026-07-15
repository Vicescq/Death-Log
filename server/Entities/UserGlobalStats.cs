using Microsoft.EntityFrameworkCore;

[Index(nameof(UserId), IsUnique = true)]
public class UserGlobalStat : IAuditable
{
    public long Id { get; set; }
    public required string UserId { get; set; }
    public User? User { get; set; }

    public int Deaths { get; set; }
    public int Games { get; set; }
    public int Profiles { get; set; }
    public int Subjects { get; set; }

    public int BossDeaths { get; set; }
    public int MiniBossDeaths { get; set; }
    public int LocationDeaths { get; set; }
    public int GenericDeaths { get; set; }
    public int OtherDeaths { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}
