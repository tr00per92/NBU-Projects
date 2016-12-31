namespace PhotoGallery.Helpers
{
    using System.Security.Claims;

    public static class Extensions
    {
        public static string GetId(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
