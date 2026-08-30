const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export const validateLocalAiRuntimeUrl = (value: string): URL | null => {
  try {
    const url = new URL(value);
    if ((url.protocol !== "http:" && url.protocol !== "https:") || !LOOPBACK_HOSTS.has(url.hostname.toLowerCase()) || url.username || url.password || url.hash) return null;
    return url;
  } catch { return null; }
};
