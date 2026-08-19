import { NextResponse } from 'next/server';
import { resolveContext } from '@/lib/contextResolver';
import { appendToConversation } from '@/lib/cache';

const API_URL = process.env.LEXAI_API_URL || 'https://unaudited-swiftness-starry.ngrok-free.dev/api/ask';

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, conversation_id } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 1. Resolve context
    const resolvedQuery = resolveContext(conversation_id, query);

    // 2. Call existing backend API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ query: resolvedQuery }),
    });

    if (!response.ok) {
      console.error('Backend API Error:', response.statusText);
      return NextResponse.json({ error: 'Failed to fetch response from backend' }, { status: response.status });
    }

    const data = await response.json();

    // 3. Cache the interaction
    if (conversation_id && data.answer) {
      appendToConversation(conversation_id, query, data.answer);
    }

    // 4. Return the data to the frontend
    return NextResponse.json(data);

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
