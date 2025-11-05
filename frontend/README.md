# Model Output Comparison Tool

A React + TypeScript application for comparing responses from multiple AI models to the same prompts. Users can view responses side-by-side and select which model's response they think is best for each prompt.

## Features

- **Side-by-side comparison**: View responses from 4 different AI models (Claude 3.5 Sonnet, GPT-4 Turbo, Llama 3.1, Mistral Small) in a grid layout
- **Interactive selection**: Click on any response card to mark it as the best response
- **Progress tracking**: Selections are automatically saved to localStorage
- **Export functionality**: Download all selections as a JSON file
- **Flexible file loading**:
  - Auto-loads default files from the `public/` folder on startup
  - Option to load custom files via the "Load Different Files" button
  - Supports both file upload and static asset loading

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

### Build

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Configuration

### Default Files

By default, the application looks for:

- `public/results.jsonl` - JSONL file containing model responses
- `public/input_prompts.csv` - CSV file containing prompts

### Environment Variables

You can configure custom file paths using environment variables. Create a `.env` file in the `frontend/` directory:

```env
VITE_JSONL_FILE=/path/to/results.jsonl
VITE_CSV_FILE=/path/to/input_prompts.csv
```

### File Formats

#### JSONL File Format

Each line should be a JSON object with the following structure:

```json
{
  "runId": "2025-12-19T04:17:40.888Z",
  "promptId": "cvh_002",
  "model": "anthropic/claude-3.5-sonnet",
  "request": {
    "temperature": 0.2,
    "max_tokens": 800
  },
  "response": {
    "text": "Response text here..."
  },
  "usage": {
    "prompt_tokens": 58,
    "completion_tokens": 132
  },
  "timing": {
    "ms": 1639
  },
  "error": null
}
```

#### CSV File Format

The CSV file should have a header row with `prompt_id` and `prompt` columns:

```csv
prompt_id,prompt
cvh_002,"Your prompt text here"
cvh_003,"Another prompt text"
```

## Usage

1. **Start the application**: The app automatically loads default files from the `public/` folder
2. **View comparisons**: Each prompt is displayed with 4 model responses in a 2x2 grid
3. **Select best response**: Click on any response card to mark it as the best
4. **Navigate**: Use Previous/Next buttons to move between prompts
5. **Export selections**: Click "Export Selections" to download a JSON file with all your selections
6. **Load different files**: Click "Load Different Files" in the header to upload custom JSONL and CSV files

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ComparisonView.tsx    # Main comparison interface
│   │   ├── FileConfig.tsx         # File upload/configuration UI
│   │   ├── NavigationBar.tsx     # Navigation controls
│   │   ├── PromptCard.tsx        # Prompt display
│   │   └── ResponseCard.tsx       # Individual model response card
│   ├── hooks/
│   │   ├── useComparisonData.ts  # Data loading and parsing
│   │   └── useSelections.ts      # Selection state management
│   ├── types/
│   │   ├── comparison.ts         # UI-specific types
│   │   └── result.ts             # Result data types
│   ├── utils/
│   │   ├── config.ts             # Configuration management
│   │   ├── csvParser.ts          # CSV parsing (using papaparse)
│   │   ├── dataGrouping.ts       # Group results by prompt
│   │   ├── exportSelections.ts   # Export functionality
│   │   ├── fileLoader.ts         # File loading utilities
│   │   └── jsonlParser.ts        # JSONL parsing
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
├── public/                       # Static assets and default files
│   ├── results.jsonl            # Default results file
│   └── input_prompts.csv        # Default prompts file
└── package.json
```

## Technologies

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **papaparse** - CSV parsing library
- **Native Fetch API** - HTTP requests

## Data Flow

1. **Load**: JSONL and CSV files are loaded (from static assets or file upload)
2. **Parse**: JSONL is parsed line-by-line, CSV is parsed using papaparse
3. **Group**: Results are grouped by `promptId` and combined with prompt text
4. **Display**: Each prompt is shown with up to 4 model responses
5. **Select**: User selections are stored in localStorage
6. **Export**: Selections can be exported as JSON

## Browser Support

Modern browsers that support:

- ES6+ features
- Fetch API
- FileReader API
- localStorage
