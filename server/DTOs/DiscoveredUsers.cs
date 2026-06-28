public record DiscoveredUsers(List<DiscoveredUser> RandomUsers, List<DiscoveredUser> FamiliarUsers);

public record DiscoveredUser(
    string Username,
    int FollowerCount,
    int FollowingCount,
    DateTime CreatedAt
);
