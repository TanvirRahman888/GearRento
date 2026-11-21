
export function getSafeRedirect(
  value: string | string[] | null | undefined
): string {
  if (typeof value !== "string") return "/";

  // Allow only internal paths
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/";
  }

  // Get the website URL
  const baseURL =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.BETTER_AUTH_URL;

  if (!baseURL) return "/";

  try {
    const base = new URL(baseURL);
    const url = new URL(value, base);

    // Prevent external redirects
    if (url.origin !== base.origin) {
      return "/";
    }

    // Prevent redirecting back to auth pages
    if (
      url.pathname === "/login" ||
      url.pathname === "/register"
    ) {
      return "/";
    }

    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}
