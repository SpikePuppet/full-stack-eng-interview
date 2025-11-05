import Papa from "papaparse";

export interface PromptRow {
  prompt_id: string;
  prompt: string;
}

/**
 * Parse CSV content and return a map of promptId -> promptText
 */
export function parseCSV(content: string): Map<string, string> {
  const result = Papa.parse<PromptRow>(content, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    throw new Error(
      `CSV parsing errors: ${result.errors.map((e) => e.message).join(", ")}`
    );
  }

  const promptMap = new Map<string, string>();
  for (const row of result.data) {
    if (row.prompt_id && row.prompt) {
      promptMap.set(row.prompt_id, row.prompt);
    }
  }

  return promptMap;
}
