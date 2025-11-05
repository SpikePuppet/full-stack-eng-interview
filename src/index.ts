import { config } from "dotenv";
import { readPrompts } from "./csvReader.js";
import { runPipeline } from "./pipeline.js";

config(); // Load .env file

// ============================================================================
// CONFIGURATION - Set these values in .env file or environment variables
// ============================================================================

// Output file path for results (JSONL format)
const OUTPUT_FILE = process.env.OUTPUT_FILE || "output/results.jsonl";

// Input CSV file path
const INPUT_FILE = process.env.INPUT_FILE || "input_prompts.csv";

// Maximum number of retries for failed API requests
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || "3", 10);

// ============================================================================

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("Error: OPENROUTER_API_KEY environment variable is not set");
    console.error(
      "Please create a .env file with: OPENROUTER_API_KEY=your_key"
    );
    process.exit(1);
  }

  console.log("Model Comparison Pipeline");
  console.log("========================");
  console.log(`Max Retries: ${MAX_RETRIES}`);
  console.log(`Input: ${INPUT_FILE}`);
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log("");

  try {
    const prompts = await readPrompts(INPUT_FILE);
    console.log(`Loaded ${prompts.length} prompts\n`);

    if (prompts.length === 0) {
      console.log("No prompts to process.");
      return;
    }

    await runPipeline(prompts, {
      apiKey,
      outputPath: OUTPUT_FILE,
      maxRetries: MAX_RETRIES,
    });
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
