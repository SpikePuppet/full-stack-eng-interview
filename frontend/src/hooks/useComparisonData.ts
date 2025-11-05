import { useState, useCallback } from "react";
import type { Result } from "../types/result";
import type { PromptComparison } from "../types/comparison";
import { loadFileFromUrl, loadFileFromUpload } from "../utils/fileLoader";
import { parseJSONL } from "../utils/jsonlParser";
import { parseCSV } from "../utils/csvParser";
import { groupResultsByPrompt } from "../utils/dataGrouping";

interface UseComparisonDataReturn {
  comparisons: PromptComparison[];
  loading: boolean;
  error: string | null;
  loadFromFiles: (
    jsonlFile: File | null,
    csvFile: File | null
  ) => Promise<void>;
  loadFromUrls: (jsonlUrl: string, csvUrl: string) => Promise<void>;
}

export function useComparisonData(): UseComparisonDataReturn {
  const [comparisons, setComparisons] = useState<PromptComparison[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFromFiles = useCallback(
    async (jsonlFile: File | null, csvFile: File | null) => {
      setLoading(true);
      setError(null);

      try {
        if (!jsonlFile || !csvFile) {
          throw new Error("Both JSONL and CSV files are required");
        }

        // Load files
        const [jsonlContent, csvContent] = await Promise.all([
          loadFileFromUpload(jsonlFile),
          loadFileFromUpload(csvFile),
        ]);

        // Parse files
        const results: Result[] = parseJSONL(jsonlContent);
        const promptMap = parseCSV(csvContent);

        // Group and set data
        const grouped = groupResultsByPrompt(results, promptMap);
        setComparisons(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        setComparisons([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadFromUrls = useCallback(async (jsonlUrl: string, csvUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      // Load files
      const [jsonlContent, csvContent] = await Promise.all([
        loadFileFromUrl(jsonlUrl),
        loadFileFromUrl(csvUrl),
      ]);

      // Parse files
      const results: Result[] = parseJSONL(jsonlContent);
      const promptMap = parseCSV(csvContent);

      // Group and set data
      const grouped = groupResultsByPrompt(results, promptMap);
      setComparisons(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setComparisons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    comparisons,
    loading,
    error,
    loadFromFiles,
    loadFromUrls,
  };
}
