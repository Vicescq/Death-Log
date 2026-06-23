using System.Net;
using System.Text;
using Clerk.BackendAPI.Helpers.Jwks;
using Svix;

public class UserAuthentication
{
    public static async Task<bool> IsSignedInAsync(HttpRequest request, string allowedOrigin)
    {
        var options = new AuthenticateRequestOptions(
            secretKey: System.Environment.GetEnvironmentVariable("CLERK_SECRET_KEY"),
            authorizedParties: [allowedOrigin]
        );

        var requestState = await AuthenticateRequest.AuthenticateRequestAsync(request, options);

        return requestState.IsAuthenticated;
    }
}

public class AuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _allowedOrigin;

    public AuthMiddleware(RequestDelegate next, string allowedOrigin)
    {
        _next = next;
        _allowedOrigin = allowedOrigin;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        if (ctx.Request.Path == "/users")
        {
            await _next(ctx);
            return;
        }

        var isSignedIn = await UserAuthentication.IsSignedInAsync(ctx.Request, _allowedOrigin);
        if (isSignedIn)
            await _next(ctx);
        else
        {
            ctx.Response.StatusCode = StatusCodes.Status400BadRequest;
            await ctx.Response.WriteAsync("Bad request");
        }
        return;
    }
}

public static class AuthMiddlewareExtensions
{
    public static IApplicationBuilder UseAuthMiddleware(
        this IApplicationBuilder builder,
        string allowedOrigin
    )
    {
        return builder.UseMiddleware<AuthMiddleware>(allowedOrigin);
    }
}

public class UserEventsAuthentication
{
    public static async Task<bool> ValidateAsync(HttpRequest request)
    {
        var secret =
            System.Environment.GetEnvironmentVariable("CLERK_WEBHOOK_SIGNING_SECRET")
            ?? throw new Exception("Environment not setup correctly");
        try
        {
            request.EnableBuffering();

            var reader = new StreamReader(request.Body, Encoding.UTF8);
            var payload = await reader.ReadToEndAsync();
            var headers = new WebHeaderCollection();

            headers.Set("svix-id", request.Headers["svix-id"].ToString());
            headers.Set("svix-timestamp", request.Headers["svix-timestamp"].ToString());
            headers.Set("svix-signature", request.Headers["svix-signature"].ToString());

            request.Body.Position = 0;

            new Webhook(secret).Verify(payload, headers);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
