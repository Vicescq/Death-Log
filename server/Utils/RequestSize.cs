public static class RequestSize
{
    public static RouteHandlerBuilder WithMaxBodySize(
        this RouteHandlerBuilder builder,
        long maxBytes
    )
    {
        return builder.AddEndpointFilter(
            async (context, next) =>
            {
                var contentLength = context.HttpContext.Request.ContentLength;
                if (contentLength > maxBytes)
                    return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);

                return await next(context);
            }
        );
    }
}
