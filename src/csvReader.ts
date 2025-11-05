import { createReadStream } from "fs";
import csv from "csv-parser";
import { Prompt } from "./types.js";

export async function readPrompts(filePath: string): Promise<Prompt[]> {
  return new Promise((resolve, reject) => {
    const prompts: Prompt[] = [];

    const readStream = createReadStream(filePath);
    const csvStream = csv();
    const stream = readStream.pipe(csvStream);

    stream
      .on("data", (row: { prompt_id: string; prompt: string }) => {
        prompts.push({
          id: row.prompt_id,
          question: row.prompt,
        });
      })
      .on("end", () => {
        resolve(prompts);
      })
      .on("error", (error: Error) => {
        reject(error);
      });
  });
}
