import { Hono } from "hono";

import { /*CoreMessage,*/ generateText, streamText, tool } from "ai";
import { createWorkersAI } from "../../src";
// import { z } from "zod";
import { streamText as honoStreamText } from "hono/streaming";
import { events } from "fetch-event-stream";
// import { createOpenAI } from "@ai-sdk/openai";

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const workersai = createWorkersAI({ binding: c.env.AI });

  // const messages = [
  //   {
  //     role: "user",
  //     content: "write an essay about hello world",
  //   },
  // ];
  // const ourOpenAI = createOpenAI({
  //   apiKey: '',
  // })

  // console.log("here");

  const txt = await generateText({
    model: workersai("@cf/meta/llama-2-7b-chat-int8"),
    messages: [
      {
        role: "user",
        content: "write an essay about hello world",
      },
    ],
  });
  console.log(txt);
  // console.log("here2");

  return new Response(txt.text);
});

app.get("/test", async (c) => {
  const response = (await c.env.AI.run("@cf/meta/llama-2-7b-chat-fp16", {
    prompt: "Hello world, write a poem about it",
    stream: true,
  })) as ReadableStream;

  if (response instanceof ReadableStream) {
    return honoStreamText(c, async (stream: { write: (arg0: any) => void }) => {
      const chunks = events(new Response(response));
      for await (const chunk of chunks) {
        if (chunk.data && chunk.data !== "[DONE]") {
          console.log(chunk.data);
          const data = JSON.parse(chunk.data);
          stream.write(data.response.replace("<|im_end|>", ""));
        }
      }
    });
  }
});

export default app;
