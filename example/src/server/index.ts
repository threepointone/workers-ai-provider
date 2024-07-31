import { convertToCoreMessages, streamText } from "ai";
import { createWorkersAI } from "../../../src";

export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (
      request.method === "POST" &&
      /^\/api\/chat\/[_\-A-Za-z]*/.exec(url.pathname)
    ) {
      const workersai = createWorkersAI({ binding: env.AI });
      const { messages } = await request.json<{
        messages: Parameters<typeof convertToCoreMessages>[0];
      }>();
      const result = await streamText({
        model: workersai("@cf/meta/llama-3-8b-instruct"),
        messages: convertToCoreMessages(messages),
      });
      return result.toDataStreamResponse();
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
