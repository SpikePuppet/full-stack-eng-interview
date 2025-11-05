export interface AppConfig {
  jsonlFile: string;
  csvFile: string;
}

export const DEFAULT_CONFIG: AppConfig = {
  jsonlFile: import.meta.env.VITE_JSONL_FILE || "/results.jsonl",
  csvFile: import.meta.env.VITE_CSV_FILE || "/input_prompts.csv",
};

export function getConfig(): AppConfig {
  return DEFAULT_CONFIG;
}
