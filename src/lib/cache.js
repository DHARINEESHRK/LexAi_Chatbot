// In-memory cache for development
// Map of conversation_id -> Array of turns
const conversationCache = globalThis.conversationCache || new Map();
if (process.env.NODE_ENV !== 'production') globalThis.conversationCache = conversationCache;
const MAX_CONTEXT_TURNS = 10;
const CACHE_TTL_MS = 3600 * 1000; // 1 hour

// To support TTL, we'll store objects: { timestamp, turns: [] }

export function getConversationContext(conversationId) {
  const data = conversationCache.get(conversationId);
  if (!data) return [];

  // Check TTL
  if (Date.now() - data.timestamp > CACHE_TTL_MS) {
    conversationCache.delete(conversationId);
    return [];
  }

  // Update timestamp on read
  data.timestamp = Date.now();
  return data.turns;
}

export function appendToConversation(conversationId, userQuery, assistantResponse) {
  let data = conversationCache.get(conversationId);
  
  if (!data) {
    data = { timestamp: Date.now(), turns: [] };
    conversationCache.set(conversationId, data);
  }

  // Check TTL
  if (Date.now() - data.timestamp > CACHE_TTL_MS) {
    data.turns = [];
  }

  data.timestamp = Date.now();
  data.turns.push({ user: userQuery, assistant: assistantResponse });

  // Keep only the last MAX_CONTEXT_TURNS
  if (data.turns.length > MAX_CONTEXT_TURNS) {
    data.turns = data.turns.slice(-MAX_CONTEXT_TURNS);
  }
}

export function clearConversation(conversationId) {
  conversationCache.delete(conversationId);
}
