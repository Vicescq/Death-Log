using System.Text.Json;

public class UserEventsQueue
{
    public static async Task<IResult> Push(
        HttpRequest request,
        ILogger<Program> logger,
        DatabaseContext dbContext,
        CancellationToken ct
    )
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
                    dbContext.UserEvents.Add(userEvent);
                    await dbContext.SaveChangesAsync(ct);
                    return Results.Ok();
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
}
