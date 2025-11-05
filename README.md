# Model Comparison Pipeline

A repeatable pipeline that processes prompts from a CSV file and generates responses from four different AI models via OpenRouter, persisting all results in JSONL format for later comparison and analysis.

## Features

- Processes prompts from CSV file
- Calls 4 AI models per prompt (Claude 3.5 Sonnet, GPT-4 Turbo, Llama 3.1, Mistral Small 24B)
- Writes results immediately to JSONL format
- Resume capability - can safely resume from interruptions
- Retry logic with exponential backoff for transient errors
- Concurrency control to respect rate limits

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
# Required
OPENROUTER_API_KEY=your_api_key_here

# Optional - Configuration (defaults shown)
OUTPUT_FILE=output/results.jsonl
INPUT_FILE=input_prompts.csv
MAX_RETRIES=3
MAX_CONCURRENCY=10
```

3. Get your OpenRouter API key from [https://openrouter.ai](https://openrouter.ai)

### Environment Variables

All configuration is done via environment variables in your `.env` file:

| Variable             | Required | Default                | Description                                       |
| -------------------- | -------- | ---------------------- | ------------------------------------------------- |
| `OPENROUTER_API_KEY` | ✅ Yes   | -                      | Your OpenRouter API key                           |
| `OUTPUT_FILE`        | ❌ No    | `output/results.jsonl` | Path to the output JSONL file                     |
| `INPUT_FILE`         | ❌ No    | `input_prompts.csv`    | Path to the input CSV file                        |
| `MAX_RETRIES`        | ❌ No    | `3`                    | Maximum number of retries for failed API requests |
| `MAX_CONCURRENCY`    | ❌ No    | `10`                   | Maximum number of concurrent API requests         |

## Usage

### Process all prompts:

```bash
npm start
```

## Input Format

The pipeline reads from `input_prompts.csv` with the following format:

```csv
prompt_id,prompt
cvh_002,"Your question here"
cvh_003,"Another question"
```

## Output Format

Results are written to `output/results.jsonl` (or custom path) in JSONL format, one JSON object per line:

```json
{
  "runId": "2025-01-18T12:00:00.000Z",
  "promptId": "cvh_002",
  "model": "anthropic/claude-3.5-sonnet",
  "request": { "temperature": 0.2, "max_tokens": 800 },
  "response": { "text": "..." },
  "usage": { "prompt_tokens": 123, "completion_tokens": 456 },
  "timing": { "ms": 1320 },
  "error": null
}
```

## Models Tested

- `anthropic/claude-3.5-sonnet` (Anthropic)
- `openai/gpt-4-turbo` (OpenAI)
- `meta-llama/llama-3.1-70b-instruct` (Meta)
- `mistralai/mistral-small-24b-instruct-2501` (Mistral)

## Resume Functionality

The pipeline automatically detects already-completed `(promptId, model)` pairs by reading the existing output file. If you interrupt the process, simply run it again and it will skip already-completed combinations.

## Error Handling

- Transient errors (429, 5xx, network errors) are automatically retried with exponential backoff
- Permanent errors are logged and written to the output file with error details
- The pipeline continues processing even if individual requests fail

## Concurrency

By default, the pipeline limits concurrent requests to 10 to respect rate limits. Adjust `MAX_CONCURRENCY` in your `.env` file to change this value.

## Development

```bash
# Run in development mode with watch
npm run dev

# Build TypeScript
npm run build
```

## Requirements

- Node.js 18+ (for native fetch support)
- npm
- OpenRouter API key
