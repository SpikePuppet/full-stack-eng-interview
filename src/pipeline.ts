import { appendFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";
import pLimit from "p-limit";
import { Prompt, Result } from "./types.js";
import { MODELS, REQUEST_CONFIG, generateRunId } from "./utils.js";
import { callModel } from "./openRouterClient.js";
import { getCompletedPairs, isCompleted } from "./resume.js";

// ============================================================================
// CONFIGURATION - Set this value in .env file or environment variables
// ============================================================================

// Maximum number of concurrent API requests (to respect rate limits)
const MAX_CONCURRENCY = parseInt(process.env.MAX_CONCURRENCY || "10", 10);

// ============================================================================

interface PipelineOptions {
  apiKey: string;
  outputPath: string;
  maxConcurrency?: number;
  maxRetries?: number;
}

export async function runPipeline(
  prompts: Prompt[],
  options: PipelineOptions
): Promise<void> {
  const {
    apiKey,
    outputPath,
    maxConcurrency = MAX_CONCURRENCY,
    maxRetries = 3,
  } = options;
  const runId = generateRunId();
  const limit = pLimit(maxConcurrency);

  // Ensure output directory exists
  const outputDir = dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Get already completed pairs
  const completedPairs = getCompletedPairs(outputPath);
  console.log(
    `Found ${completedPairs.size} already completed (prompt, model) pairs`
  );

  // Calculate total work
  let totalTasks = 0;
  let completedTasks = 0;

  for (const prompt of prompts) {
    for (const model of MODELS) {
      if (!isCompleted(prompt.id, model.name, completedPairs)) {
        totalTasks++;
      }
    }
  }

  console.log(
    `Processing ${totalTasks} tasks across ${prompts.length} prompts`
  );

  // Process all prompts
  const tasks: Promise<void>[] = [];

  for (const prompt of prompts) {
    for (const model of MODELS) {
      // Skip if already completed
      if (isCompleted(prompt.id, model.name, completedPairs)) {
        continue;
      }

      const task = limit(async () => {
        try {
          const result = await callModel(
            apiKey,
            model.name,
            prompt.question,
            maxRetries
          );

          const output: Result = {
            runId,
            promptId: prompt.id,
            model: model.name,
            request: REQUEST_CONFIG,
            response: {
              text: result.text,
            },
            usage: result.usage,
            timing: result.timing,
            error: result.error,
          };

          // Immediately append to file
          appendFileSync(outputPath, JSON.stringify(output) + "\n");

          completedTasks++;
          const progress = ((completedTasks / totalTasks) * 100).toFixed(1);
          console.log(
            `[${progress}%] Completed: ${prompt.id} -> ${model.name} ${
              result.error ? `(ERROR: ${result.error})` : ""
            }`
          );
        } catch (error) {
          completedTasks++;
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(
            `Error processing ${prompt.id} -> ${model.name}: ${errorMessage}`
          );

          // Still write error result
          const output: Result = {
            runId,
            promptId: prompt.id,
            model: model.name,
            request: REQUEST_CONFIG,
            response: {
              text: "",
            },
            usage: {
              prompt_tokens: 0,
              completion_tokens: 0,
            },
            timing: { ms: 0 },
            error: errorMessage,
          };

          appendFileSync(outputPath, JSON.stringify(output) + "\n");
        }
      });

      tasks.push(task);
    }
  }

  await Promise.all(tasks);
  console.log(`\nPipeline complete! Processed ${completedTasks} tasks.`);
}
