import { ModelConfig } from "./types.js";

export const MODELS: ModelConfig[] = [
  { name: "anthropic/claude-3.5-sonnet", provider: "Anthropic" },
  { name: "openai/gpt-4-turbo", provider: "OpenAI" },
  { name: "meta-llama/llama-3.1-70b-instruct", provider: "Meta" },
  { name: "mistralai/mistral-small-24b-instruct-2501", provider: "Mistral" },
];

export const REQUEST_CONFIG = {
  temperature: 0.2,
  max_tokens: 800,
};

export function generateRunId(): string {
  return new Date().toISOString();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
