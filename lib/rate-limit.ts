const rateLimitStore = new Map<
  string,
  { count: number; lastRequest: number }
>();

// These values determine how many requests a user can make within a time window
const MAX_AUTH_REQUESTS = 5; // Allow 5 requests
const WINDOW_IN_SECONDS = 60; // Within a 60-second window

/************************************************
 *
 * Check auth rate limit
 *
 ************************************************/

export async function checkAuthRateLimit(
  ip: string,
): Promise<{ limited: boolean; retryAfter?: number; message?: string }> {
  const key = `auth:${ip}`;
  const now = Date.now();
  const currentLimit = rateLimitStore.get(key);

  if (!currentLimit) {
    // First time request for this IP
    // Initialise their counter and start their window
    rateLimitStore.set(key, {
      count: 1,
      lastRequest: now,
    });

    return { limited: false };
  }

  // Convert our window from seconds to milliseconds for comparison
  const windowMs = WINDOW_IN_SECONDS * 1000;

  // Calculate when the current window expires
  const windowExpiry = currentLimit.lastRequest + windowMs;

  if (now > windowExpiry) {
    // The previous window has expired
    // Start a fresh window with a reset counter
    rateLimitStore.set(key, {
      count: 1,
      lastRequest: now,
    });
    return { limited: false };
  }

  // We're still in the current window
  // Check if the user has exceeded their request limit
  if (currentLimit.count >= MAX_AUTH_REQUESTS) {
    // User has made too many requests
    const retryAfter = Math.ceil((windowExpiry - now) / 1000);
    return {
      limited: true,
      retryAfter,
      message: `Too many sign-in attempts. Please try again in ${retryAfter} seconds.`,
    };
  }

  // User hasn't exceeded their limit
  // Increment their counter but keep them in the same window
  rateLimitStore.set(key, {
    count: currentLimit.count + 1,
    lastRequest: currentLimit.lastRequest,
  });

  return { limited: false };
}
