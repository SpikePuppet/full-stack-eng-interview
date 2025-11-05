export interface Prompt {
  id: string;
  question: string;
}

export interface ModelConfig {
  name: string;
  provider: string;
}

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

export interface CompletedPair {
  promptId: string;
  model: string;
}

