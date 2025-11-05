interface NavigationBarProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onExport: () => void;
}

export function NavigationBar({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  onExport,
}: NavigationBarProps) {
  return (
    <div className="navigation-bar">
      <div className="nav-buttons">
        <button onClick={onPrevious} disabled={!canGoPrevious}>
          ← Previous
        </button>
        <button onClick={onNext} disabled={!canGoNext}>
          Next →
        </button>
      </div>
      <button onClick={onExport} className="export-button">
        Export Selections
      </button>
    </div>
  );
}
