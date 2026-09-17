type ChatMessage = { role: "user" | "assistant"; content: string };

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 20;

const hits = new Map<string, number[]>();

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function takeChatRateLimit(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

export const chatMessageSchema = {
  maxHistory: 20,
  maxContent: 2000,
};

export function trimChatHistory(messages: ChatMessage[]) {
  return messages.slice(-chatMessageSchema.maxHistory);
}
