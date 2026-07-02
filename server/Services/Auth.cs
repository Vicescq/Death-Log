using System.Net;
using System.Security.Claims;
using System.Text;
using Clerk.BackendAPI.Helpers.Jwks;
using Svix;

public class UserAuthentication
{
    public static async Task<bool> IsSignedInAsync(
        HttpRequest request,
        string allowedOrigin,
        bool extractCaller = false
    )
    {
        var options = new AuthenticateRequestOptions(
            secretKey: System.Environment.GetEnvironmentVariable("CLERK_SECRET_KEY"),
            authorizedParties: [allowedOrigin]
        );

        var requestState = await AuthenticateRequest.AuthenticateRequestAsync(request, options);

        if (extractCaller && requestState.IsAuthenticated)
            request.HttpContext.Items["clerkUserId"] = requestState.Claims?.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

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
        if (IsPublicRoute(ctx.Request))
        {
            await _next(ctx);
            return;
        }

        var isSignedIn = await UserAuthentication.IsSignedInAsync(
            ctx.Request,
            _allowedOrigin,
            RequiresCallerIdentity(ctx.Request)
        );
        if (isSignedIn)
            await _next(ctx);
        else
        {
            ctx.Response.StatusCode = StatusCodes.Status400BadRequest;
            await ctx.Response.WriteAsync("Bad request");
        }
        return;
    }

    private static bool RequiresCallerIdentity(HttpRequest request) =>
        request.Path.StartsWithSegments("/follows") || request.Path.StartsWithSegments("/profiles");

    private static bool IsPublicRoute(HttpRequest request)
    {
        if (request.Path == "/health")
            return true;

        if (request.Path == "/users")
            return true;

        if (HttpMethods.IsGet(request.Method) && request.Path.StartsWithSegments("/profiles"))
            return true;

        if (
            HttpMethods.IsGet(request.Method)
            && (
                request.Path.StartsWithSegments("/followers")
                || request.Path.StartsWithSegments("/following")
            )
        )
            return true;

        return false;
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
