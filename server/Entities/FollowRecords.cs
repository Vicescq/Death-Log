using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

[PrimaryKey(nameof(FollowerId), nameof(FollowingId))]
public class FollowRecord : IAuditable
{
    public required string FollowerId { get; set; }

    [ForeignKey(nameof(FollowerId))]
    public User? FollowerUser { get; init; }

    public required string FollowingId { get; set; }

    [ForeignKey(nameof(FollowingId))]
    public User? FollowingUser { get; init; }

    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}
