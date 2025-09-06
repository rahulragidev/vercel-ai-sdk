import { streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
    const { messages } = await req.json();

    // Stream the response using AI SDK
    const result = await streamText({
        model: openai('gpt-3.5-turbo'),
        messages: convertToModelMessages(messages),
    });

    // Return the UI message stream response
    return result.toUIMessageStreamResponse();
}