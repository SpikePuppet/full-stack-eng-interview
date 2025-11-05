import type { Result } from "../types/result";

/**
 * Parse a JSONL file string into an array of Result objects
 */
export function parseJSONL(content: string): Result[] {
  const lines = content.split("\n").filter((line) => line.trim());
  return lines.map((line) => {
    try {
      return JSON.parse(line) as Result;
    } catch {
      throw new Error(
        `Failed to parse JSONL line: ${line.substring(0, 100)}...`
      );
    }
  });
}
