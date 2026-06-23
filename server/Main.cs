using System.Data.Common;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigin =
    builder.Configuration.GetValue<string>("EnvData:Domain")
    ?? throw new InvalidOperationException("Configuration is not setup correctly");

DotNetEnv.Env.Load();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "frontend",
        policyBuilder =>
        {
            policyBuilder
                .WithOrigins(allowedOrigin)
                .WithHeaders("Authorization", "Content-Type", "X-Requested-With")
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

app.UseAuthMiddleware(allowedOrigin);

app.MapPost(
    "/users",
    async (
        HttpRequest request,
        ILogger<Program> logger,
        DatabaseContext dbContext,
        CancellationToken ct
    ) =>
    {
        var result = await UserEventsAuthentication.ValidateAsync(request);
        if (result)
        {
            try
            {
                var userEvent = await JsonSerializer.DeserializeAsync<UserEvent>(
                    request.Body,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true },
                    ct
                );

                if (userEvent != null)
                {
                    userEvent.Trim();
                    try
                    {
                        dbContext.UserEvents.Add(userEvent);
                        await dbContext.SaveChangesAsync(ct);
                        return Results.Ok();
                    }
                    catch (DbException e)
                    {
                        logger.LogError(
                            "Valid webhook, but Database error occured! {E}. Responded with 200 to stop retries.",
                            e.ToString()
                        );
                        return Results.Ok(); // stop webhook retries
                    }
                }

                logger.LogError(
                    "Valid webhook, but null userEvent! Responded with 200 to stop retries."
                );
                return Results.Ok(); // stop webhook retries
            }
            catch (JsonException e)
            {
                logger.LogError(
                    "Valid webhook, but incorrect shape! {E}. Responded with 200 to stop retries.",
                    e.ToString()
                );
                return Results.Ok(); // stop webhook retries
            }
        }
        else
        {
            return Results.Unauthorized();
        }
    }
);

app.MapPost(
        "/profiles/{username}",
        async (
            string username,
            SharedProfile sharedProfile,
            HttpRequest request,
            ILogger<Program> logger,
            DatabaseContext dbContext,
            CancellationToken ct
        ) =>
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(
                user => user.Username == username,
                ct
            );
            if (user != null)
            {
                return Results.Ok();
            }
            else
            {
                logger.LogError("Username not found!");
                return Results.NotFound();
            }
        }
    )
    .Accepts<SharedProfile>("application/json")
    .WithMetadata(new RequestSizeLimitAttribute(10485760));

app.Run();
