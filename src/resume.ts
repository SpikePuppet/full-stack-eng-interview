import { readFileSync, existsSync } from 'fs';
import { CompletedPair } from './types.js';

export function getCompletedPairs(outputPath: string): Set<string> {
  const completed = new Set<string>();

  if (!existsSync(outputPath)) {
    return completed;
  }

  try {
    const content = readFileSync(outputPath, 'utf-8');
    const lines = content.trim().split('\n').filter((line) => line.trim());

    for (const line of lines) {
      try {
        const result = JSON.parse(line);
        if (result.promptId && result.model) {
          const key = `${result.promptId}:${result.model}`;
          completed.add(key);
        }
      } catch (e) {
        // Skip invalid JSON lines
        continue;
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read existing results file: ${error}`);
  }

  return completed;
}

export function isCompleted(
  promptId: string,
  model: string,
  completedPairs: Set<string>
): boolean {
  const key = `${promptId}:${model}`;
  return completedPairs.has(key);
}

