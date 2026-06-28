using Microsoft.AspNetCore.Mvc;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

var allowedOrigin =
    builder.Configuration.GetValue<string>("EnvData:Domain")
    ?? throw new InvalidOperationException("Configuration is not setup correctly");

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "frontend",
        policyBuilder =>
        {
            policyBuilder
                .WithOrigins(allowedOrigin)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
});

builder.Services.AddValidation();

var connectionString =
    Environment.GetEnvironmentVariable("CONNECTION_STRING")
    ?? throw new InvalidOperationException("Configuration is not setup correctly");
builder.Services.AddNpgsql<DatabaseContext>(connectionString);

builder.Services.AddHostedService(provider => new UserEventsProcessorService(
    5000,
    provider,
    provider.GetRequiredService<ILogger<UserEventsProcessorService>>()
));

var app = builder.Build();

app.UseCors("frontend");

app.UseDatabaseErrorHandler();

app.UseAuthMiddleware(allowedOrigin);

app.MapGet("/users", BrowseUsers.Browse);

app.MapPost("/users", UserEventsQueue.Push);

app.MapPost("/profiles/{username}", ProfileSharing.PostProfile)
    .Accepts<SharedProfile>("application/json")
    .WithMetadata(new RequestSizeLimitAttribute(10485760));

app.MapGet("/profiles/{username}", ProfileSharing.GetProfile);

app.Run();
