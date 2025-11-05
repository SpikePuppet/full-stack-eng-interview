import type { Result } from "./result";

// Grouped data structure for a single prompt with all model responses
export interface PromptComparison {
  promptId: string;
  promptText: string;
  responses: Result[]; // Up to 4 responses, one per model
}

// User selection for a prompt
export interface UserSelection {
  promptId: string;
  selectedModel: string | null; // null if skipped
  timestamp: string;
}

// App state
export interface ComparisonState {
  comparisons: PromptComparison[];
  currentIndex: number;
  selections: Map<string, UserSelection>; // promptId -> selection
}

// Model name mapping for display
export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  "anthropic/claude-3.5-sonnet": "Claude 3.5 Sonnet",
  "openai/gpt-4-turbo": "GPT-4 Turbo",
  "meta-llama/llama-3.1-70b-instruct": "Llama 3.1",
  "mistralai/mistral-small-24b-instruct-2501": "Mistral Small",
};
