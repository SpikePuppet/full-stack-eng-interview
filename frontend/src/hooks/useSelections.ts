import { useState, useEffect, useCallback, useMemo } from "react";
import type { UserSelection } from "../types/comparison";
import { exportSelections } from "../utils/exportSelections";

const STORAGE_KEY = "model-comparison-selections";

interface UseSelectionsReturn {
  selections: Map<string, UserSelection>;
  selectionsVersion: number; // Version counter to track changes
  reviewedCount: number; // Count of prompts with non-null selections
  selectModel: (promptId: string, model: string | null) => void;
  getSelection: (promptId: string) => UserSelection | undefined;
  clearSelections: () => void;
  exportToFile: () => void;
  hasSelection: (promptId: string) => boolean;
}

export function useSelections(): UseSelectionsReturn {
  const [selections, setSelections] = useState<Map<string, UserSelection>>(
    new Map()
  );
  const [selectionsVersion, setSelectionsVersion] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserSelection[];
        const map = new Map<string, UserSelection>();
        for (const selection of parsed) {
          map.set(selection.promptId, selection);
        }
        setSelections(map);
      }
    } catch (err) {
      console.error("Failed to load selections from localStorage:", err);
    }
  }, []);

  // Save to localStorage whenever selections change
  useEffect(() => {
    try {
      const array = Array.from(selections.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
    } catch (err) {
      console.error("Failed to save selections to localStorage:", err);
    }
  }, [selections]);

  const selectModel = useCallback((promptId: string, model: string | null) => {
    setSelections((prev) => {
      const next = new Map(prev);
      next.set(promptId, {
        promptId,
        selectedModel: model,
        timestamp: new Date().toISOString(),
      });
      return next;
    });
    setSelectionsVersion((v) => v + 1);
  }, []);

  const getSelection = useCallback(
    (promptId: string) => {
      return selections.get(promptId);
    },
    [selections]
  );

  const clearSelections = useCallback(() => {
    setSelections(new Map());
    setSelectionsVersion((v) => v + 1);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportToFile = useCallback(() => {
    exportSelections(selections);
  }, [selections]);

  const hasSelection = useCallback(
    (promptId: string) => {
      return selections.has(promptId);
    },
    [selections]
  );

  // Calculate reviewed count (selections with non-null selectedModel)
  const reviewedCount = useMemo(() => {
    let count = 0;
    for (const selection of selections.values()) {
      if (selection.selectedModel !== null) {
        count++;
      }
    }
    return count;
  }, [selections]);

  return {
    selections,
    selectionsVersion,
    reviewedCount,
    selectModel,
    getSelection,
    clearSelections,
    exportToFile,
    hasSelection,
  };
}
