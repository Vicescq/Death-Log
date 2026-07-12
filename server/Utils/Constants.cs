public static class EndpointLimits
{
    public const int _DevOneByte = 1;
    public const int SixtyFourKb = 64 * 1024;

    public const int OneMb = 1024 * 1024;
    public const int FiveMb = 5 * 1024 * 1024;
    public const int TenMb = 10 * 1024 * 1024;
    public const int TwentyFiveMb = 25 * 1024 * 1024;
    public const int ThirtyMb = 30 * 1024 * 1024;
    public const int FiftyMb = 50 * 1024 * 1024;
}

public static class RateLimits
{
    public const string BackupWritesPolicy = "backup-writes";
    public const int BackupWritesPermitLimit = 10;
    public const int BackupWritesWindowMinutes = 10;

    public const string StandardPolicy = "standard";
    public const int StandardPermitLimit = 100;
    public const int StandardWindowMinutes = 1;

    public static string PartitionKey(HttpContext http) =>
        http.Items["clerkUserId"] as string
        ?? http.Connection.RemoteIpAddress?.ToString()
        ?? "unknown";
}
