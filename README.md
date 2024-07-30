# workers-ai-provider ⬡ ⤫ ▴

A custom provider that enables [Workers AI](https://ai.cloudflare.com/)'s models for the [Vercel AI SDK](https://sdk.vercel.ai/).

> [!CAUTION]
> This project is in its experimental early stages and is not recommended for production use.

## Install

```bash
npm install workers-ai-provider
```

## Usage

First setup an AI binding in `wrangler.toml`:

```toml
# ...
[ai]
binding = "AI"
# ...
```

Then in your Worker, import the factory function and create a new AI provider:

```ts
// index.ts
import { createWorkersAI } from "workers-ai-provider";
import * as ai from "ai";

export default {
  fetch(req: Request, env: Env) {
    const workersai = createWorkersAI({ binding: env.AI });
    // Use the AI provider to interact with the Vercel AI SDK
    // Here, we generate a chat stream based on a prompt
    const response = ai.streamText({
      model: workersai("@cf/meta/llama-2-7b-chat-int8"),
      messages: [
        {
          role: "user",
          content: "Write an essay about hello world",
        },
      ],
    });

    return new Response(txt.text);
  },
};
```

For more info, refer to the documentation of the [Vercel AI SDK](https://sdk.vercel.ai/).

### Credits

Based on work by [Dhravya Shah](https://twitter.com/DhravyaShah) and the Workers AI team at Cloudflare.
