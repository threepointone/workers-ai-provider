import { Hono } from "hono";

import { /*CoreMessage,*/ generateText, streamText, tool } from "ai";
import { createWorkersAI } from "../../src";
// import { z } from "zod";
// import { streamText as honoStreamText } from "hono/streaming";
// import { events } from "fetch-event-stream";

type Env = {
  AI: Ai;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/simple", async (c) => {
  const workersai = createWorkersAI({ binding: c.env.AI });

  const txt = await generateText({
    model: workersai("@cf/meta/llama-2-7b-chat-int8"),
    messages: [
      {
        role: "user",
        content: "write an essay about hello world",
      },
    ],
  });

  return new Response(txt.text);
});

app.get("/stream", async (c) => {
  const workersai = createWorkersAI({ binding: c.env.AI });

  const txt = await streamText({
    model: workersai("@cf/meta/llama-2-7b-chat-int8"),
    messages: [
      {
        role: "user",
        content: "write an essay about hello world",
      },
    ],
  });

  return txt.toTextStreamResponse();
});

export default app;
