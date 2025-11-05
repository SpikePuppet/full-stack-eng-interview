// Duplicate of Result type from backend for frontend use
export interface RequestConfig {
  temperature: number;
  max_tokens: number;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
}

export interface Timing {
  ms: number;
}

export interface Result {
  runId: string;
  promptId: string;
  model: string;
  request: RequestConfig;
  response: {
    text: string;
  };
  usage: Usage;
  timing: Timing;
  error: string | null;
}
