import { getConversationContext } from './cache';

/**
 * Builds a compact context from previous turns and prepends it to the query.
 * If the conversation has history, we format it so the RAG backend understands
 * the context of the current question.
 */
export function resolveContext(conversationId, currentQuery) {
  if (!conversationId) return currentQuery;

  const history = getConversationContext(conversationId);
  if (history.length === 0) return currentQuery;

  // We only send the last 3-4 turns to keep context compact and not overwhelm the RAG system
  const recentHistory = history.slice(-4);

  // Build the context string
  let contextStr = "Conversation History:\n";
  recentHistory.forEach((turn, index) => {
    contextStr += `User: ${turn.user}\nLexAI: ${turn.assistant.substring(0, 150)}${turn.assistant.length > 150 ? '...' : ''}\n`;
  });

  contextStr += `\nCurrent Question: ${currentQuery}\n\nPlease answer the Current Question using the Conversation History for context if needed.`;

  return contextStr;
}
