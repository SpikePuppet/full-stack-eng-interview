import { useState, useRef } from "react";
import { getConfig } from "../utils/config";

interface FileConfigProps {
  onLoad: (jsonlFile: File | null, csvFile: File | null) => Promise<void>;
  onLoadFromUrls: (jsonlUrl: string, csvUrl: string) => Promise<void>;
  loading: boolean;
}

export function FileConfig({
  onLoad,
  onLoadFromUrls,
  loading,
}: FileConfigProps) {
  const [jsonlFile, setJsonlFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [useDefaults, setUseDefaults] = useState(true);
  const jsonlInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const config = getConfig();

  const handleLoad = async () => {
    try {
      if (useDefaults) {
        await onLoadFromUrls(config.jsonlFile, config.csvFile);
      } else {
        if (!jsonlFile || !csvFile) {
          alert("Please select both JSONL and CSV files");
          return;
        }
        await onLoad(jsonlFile, csvFile);
      }
    } catch (err) {
      console.error("Error loading files:", err);
      alert(
        `Failed to load files: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  const handleJsonlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setJsonlFile(file);
  };

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCsvFile(file);
  };

  return (
    <div className="file-config">
      <h2>Load Comparison Data</h2>
      <div className="config-options">
        <label>
          <input
            type="radio"
            checked={useDefaults}
            onChange={() => setUseDefaults(true)}
          />
          Use default files (from public folder)
        </label>
        <label>
          <input
            type="radio"
            checked={!useDefaults}
            onChange={() => setUseDefaults(false)}
          />
          Upload custom files
        </label>
      </div>

      {useDefaults ? (
        <div className="default-files">
          <p>Default file paths:</p>
          <ul>
            <li>
              JSONL: <code>{config.jsonlFile}</code>
            </li>
            <li>
              CSV: <code>{config.csvFile}</code>
            </li>
          </ul>
        </div>
      ) : (
        <div className="file-uploads">
          <div className="file-input-group">
            <label htmlFor="jsonl-file">JSONL Results File:</label>
            <input
              id="jsonl-file"
              ref={jsonlInputRef}
              type="file"
              accept=".jsonl,.json"
              onChange={handleJsonlChange}
            />
            {jsonlFile && <span className="file-name">{jsonlFile.name}</span>}
          </div>
          <div className="file-input-group">
            <label htmlFor="csv-file">CSV Prompts File:</label>
            <input
              id="csv-file"
              ref={csvInputRef}
              type="file"
              accept=".csv"
              onChange={handleCsvChange}
            />
            {csvFile && <span className="file-name">{csvFile.name}</span>}
          </div>
        </div>
      )}

      <button
        onClick={handleLoad}
        disabled={loading || (!useDefaults && (!jsonlFile || !csvFile))}
        className="load-button"
      >
        {loading ? "Loading..." : "Load Data"}
      </button>
    </div>
  );
}
