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

app.UseErrorHandler();

app.UseAuthMiddleware(allowedOrigin);

app.MapGet("/health", () => Results.Ok());

app.MapPost("/users", UserEventsQueue.Push);

app.Run();
