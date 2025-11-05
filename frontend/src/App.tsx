import { useState, useEffect, useRef } from "react";
import { useComparisonData } from "./hooks/useComparisonData";
import { FileConfig } from "./components/FileConfig";
import { ComparisonView } from "./components/ComparisonView";
import { getConfig } from "./utils/config";
import "./App.css";

function App() {
  const { comparisons, loading, error, loadFromFiles, loadFromUrls } =
    useComparisonData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFileConfig, setShowFileConfig] = useState(false);
  const hasAttemptedLoad = useRef(false);

  // Auto-load default files on mount
  useEffect(() => {
    if (!hasAttemptedLoad.current && comparisons.length === 0 && !loading) {
      hasAttemptedLoad.current = true;
      const config = getConfig();
      loadFromUrls(config.jsonlFile, config.csvFile).catch((err) => {
        console.error("Failed to load default files:", err);
        hasAttemptedLoad.current = false; // Allow retry on error
      });
    }
  }, [comparisons.length, loading, loadFromUrls]);

  const handleLoad = async (jsonlFile: File | null, csvFile: File | null) => {
    await loadFromFiles(jsonlFile, csvFile);
    setCurrentIndex(0);
    setShowFileConfig(false);
  };

  const handleLoadFromUrls = async (jsonlUrl: string, csvUrl: string) => {
    await loadFromUrls(jsonlUrl, csvUrl);
    setCurrentIndex(0);
    setShowFileConfig(false);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < comparisons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Show file config only if explicitly requested or if there's an error and no data
  if (showFileConfig || (comparisons.length === 0 && error && !loading)) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Model Output Comparison Tool</h1>
        </header>
        <main className="app-main">
          <FileConfig
            onLoad={handleLoad}
            onLoadFromUrls={handleLoadFromUrls}
            loading={loading}
          />
          {error && <div className="error-message">Error: {error}</div>}
        </main>
      </div>
    );
  }

  // Show loading state
  if (loading || comparisons.length === 0) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Model Output Comparison Tool</h1>
        </header>
        <main className="app-main">
          <div style={{ textAlign: "center", padding: "2rem", color: "#ddd" }}>
            Loading comparison data...
          </div>
        </main>
      </div>
    );
  }

  const currentComparison = comparisons[currentIndex];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Model Output Comparison Tool</h1>
        <button
          onClick={() => setShowFileConfig(true)}
          className="reload-button"
          style={{
            marginLeft: "auto",
            padding: "0.5rem 1rem",
            background: "#444",
            color: "#fff",
            border: "1px solid #666",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Load Different Files
        </button>
      </header>
      <main className="app-main">
        <ComparisonView
          comparison={currentComparison}
          currentIndex={currentIndex}
          total={comparisons.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}

export default App;
