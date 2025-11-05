import type { Result } from "../types/result";
import type { PromptComparison } from "../types/comparison";

/**
 * Group results by promptId and combine with prompt text
 */
export function groupResultsByPrompt(
  results: Result[],
  promptMap: Map<string, string>
): PromptComparison[] {
  // Group results by promptId
  const grouped = new Map<string, Result[]>();
  for (const result of results) {
    if (!grouped.has(result.promptId)) {
      grouped.set(result.promptId, []);
    }
    grouped.get(result.promptId)!.push(result);
  }

  // Convert to PromptComparison array
  const comparisons: PromptComparison[] = [];
  for (const [promptId, responses] of grouped.entries()) {
    const promptText =
      promptMap.get(promptId) || `[Prompt text not found for ${promptId}]`;
    comparisons.push({
      promptId,
      promptText,
      responses,
    });
  }

  // Sort by promptId for consistent ordering
  comparisons.sort((a, b) => a.promptId.localeCompare(b.promptId));

  return comparisons;
}
