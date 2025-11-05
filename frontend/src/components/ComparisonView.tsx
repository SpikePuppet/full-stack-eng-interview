import type { PromptComparison } from "../types/comparison";
import { PromptCard } from "./PromptCard";
import { ResponseCard } from "./ResponseCard";
import { NavigationBar } from "./NavigationBar";
import { useSelections } from "../hooks/useSelections";
import { MODEL_DISPLAY_NAMES } from "../types/comparison";

// Expected models in order
const EXPECTED_MODELS = [
  "anthropic/claude-3.5-sonnet",
  "openai/gpt-4-turbo",
  "meta-llama/llama-3.1-70b-instruct",
  "mistralai/mistral-small-24b-instruct-2501",
];

interface ComparisonViewProps {
  comparison: PromptComparison;
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function ComparisonView({
  comparison,
  currentIndex,
  total,
  onPrevious,
  onNext,
}: ComparisonViewProps) {
  const { selectModel, getSelection, exportToFile } = useSelections();
  const selection = getSelection(comparison.promptId);

  const handleSelect = (model: string) => {
    selectModel(comparison.promptId, model);
  };

  // Get all 4 models, with responses if available
  const modelResponses = new Map(comparison.responses.map((r) => [r.model, r]));
  const allModels = EXPECTED_MODELS;

  return (
    <div className="comparison-view">
      <PromptCard
        promptId={comparison.promptId}
        promptText={comparison.promptText}
        promptNumber={currentIndex + 1}
      />
      <div className="responses-grid">
        {allModels.map((model) => {
          const result = modelResponses.get(model);
          if (!result) {
            return (
              <div key={model} className="response-card missing">
                <div className="response-header">
                  <h4>{MODEL_DISPLAY_NAMES[model] || model}</h4>
                </div>
                <div className="missing-message">No response available</div>
              </div>
            );
          }
          return (
            <ResponseCard
              key={model}
              result={result}
              isSelected={selection?.selectedModel === model}
              onSelect={() => handleSelect(model)}
            />
          );
        })}
      </div>
      <NavigationBar
        onPrevious={onPrevious}
        onNext={onNext}
        canGoPrevious={currentIndex > 0}
        canGoNext={currentIndex < total - 1}
        onExport={exportToFile}
      />
    </div>
  );
}
