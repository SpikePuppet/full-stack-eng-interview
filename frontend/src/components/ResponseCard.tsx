import type { Result } from "../types/result";
import { MODEL_DISPLAY_NAMES } from "../types/comparison";
import { useState } from "react";

interface ResponseCardProps {
  result: Result;
  isSelected: boolean;
  onSelect: () => void;
}

export function ResponseCard({
  result,
  isSelected,
  onSelect,
}: ResponseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const displayName = MODEL_DISPLAY_NAMES[result.model] || result.model;
  const hasError = result.error !== null;
  const responseText = result.response.text || "";
  const isLongText = responseText.length > 500;
  const displayText =
    expanded || !isLongText
      ? responseText
      : responseText.substring(0, 500) + "...";

  return (
    <div
      className={`response-card ${isSelected ? "selected" : ""} ${
        hasError ? "error" : ""
      }`}
      onClick={onSelect}
    >
      <div className="response-header">
        <h4>{displayName}</h4>
        {isSelected && <span className="selected-badge">✓ Selected</span>}
      </div>

      {hasError ? (
        <div className="error-message">
          <strong>Error:</strong> {result.error}
        </div>
      ) : (
        <>
          <div className="response-text">{displayText}</div>
          {isLongText && (
            <button
              className="expand-button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </>
      )}

      <div className="response-metrics">
        <div className="metric">
          <span className="metric-label">Time:</span>
          <span className="metric-value">{result.timing.ms}ms</span>
        </div>
        <div className="metric">
          <span className="metric-label">Tokens:</span>
          <span className="metric-value">
            {result.usage.prompt_tokens + result.usage.completion_tokens}
          </span>
        </div>
      </div>
    </div>
  );
}
