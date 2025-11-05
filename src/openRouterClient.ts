import { z } from "zod";
import { REQUEST_CONFIG, sleep } from "./utils.js";
import { Usage, Timing } from "./types.js";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const RETRY_DELAYS = [1000, 2000, 4000]; // ms

// Zod schema for OpenRouter response validation
const OpenRouterResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
      }),
    })
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
  }),
});

interface CallModelResult {
  text: string;
  usage: Usage;
  timing: Timing;
  error: string | null;
}

export async function callModel(
  apiKey: string,
  model: string,
  prompt: string,
  maxRetries: number = 3
): Promise<CallModelResult> {
  const startTime = Date.now();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: REQUEST_CONFIG.temperature,
          max_tokens: REQUEST_CONFIG.max_tokens,
        }),
      });

      const endTime = Date.now();
      const timing: Timing = { ms: endTime - startTime };

      if (!response.ok) {
        const status = response.status;
        const isRetryable = status === 429 || (status >= 500 && status < 600);

        if (isRetryable && attempt < maxRetries) {
          const delay = RETRY_DELAYS[attempt] || 8000;
          console.log(
            `[${model}] Retry ${
              attempt + 1
            }/${maxRetries} after ${delay}ms (HTTP ${status})`
          );
          await sleep(delay);
          continue;
        }

        const errorText = await response.text().catch(() => "Unknown error");
        const result: CallModelResult = {
          text: "",
          usage: { prompt_tokens: 0, completion_tokens: 0 },
          timing,
          error: `HTTP ${status}: ${errorText}`,
        };
        console.log(`[${model}] Error: ${result.error}`);
        return result;
      }

      const jsonData = await response.json();

      // Validate and parse response with Zod
      const parseResult = OpenRouterResponseSchema.safeParse(jsonData);

      if (!parseResult.success) {
        const result: CallModelResult = {
          text: "",
          usage: { prompt_tokens: 0, completion_tokens: 0 },
          timing,
          error: `Invalid response format: ${parseResult.error.message}`,
        };
        console.log(`[${model}] Validation error: ${result.error}`);
        return result;
      }

      const data = parseResult.data;
      const text = data.choices[0]?.message?.content || "";
      const usage: Usage = {
        prompt_tokens: data.usage?.prompt_tokens || 0,
        completion_tokens: data.usage?.completion_tokens || 0,
      };

      const result: CallModelResult = {
        text,
        usage,
        timing,
        error: null,
      };

      // Log the result before returning
      console.log(
        `[${model}] Success: ${
          usage.prompt_tokens + usage.completion_tokens
        } tokens, ${timing.ms}ms`
      );

      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const isNetworkError = error instanceof TypeError;

      if (isNetworkError && attempt < maxRetries) {
        const delay = RETRY_DELAYS[attempt] || 8000;
        console.log(
          `[${model}] Retry ${
            attempt + 1
          }/${maxRetries} after ${delay}ms (Network error)`
        );
        await sleep(delay);
        continue;
      }

      const endTime = Date.now();
      const timing: Timing = { ms: endTime - startTime };

      const result: CallModelResult = {
        text: "",
        usage: { prompt_tokens: 0, completion_tokens: 0 },
        timing,
        error: lastError.message,
      };

      console.log(`[${model}] Error: ${result.error}`);
      return result;
    }
  }

  // This handles the case where all retries fail
  const endTime = Date.now();
  const result: CallModelResult = {
    text: "",
    usage: { prompt_tokens: 0, completion_tokens: 0 },
    timing: { ms: endTime - startTime },
    error: lastError?.message || "Max retries exceeded",
  };
  console.log(`[${model}] Max retries exceeded: ${result.error}`);
  return result;
}
