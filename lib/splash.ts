/**
 * Kept in a plain (non "use client") module so it can be read from both the
 * server-rendered pre-paint script in app/layout.tsx and the Splash client
 * component. Importing a constant from a "use client" file into server code
 * resolves to `undefined` across that boundary — this avoids that pitfall.
 */
export const SPLASH_SESSION_KEY = "alaeraf:splash";
