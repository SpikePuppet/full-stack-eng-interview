/**
 * Load a file from a URL using fetch (for static assets)
 */
export async function loadFileFromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load file from ${url}: ${response.statusText}`);
  }
  return await response.text();
}

/**
 * Load a file from File object using FileReader (for file uploads)
 */
export function loadFileFromUpload(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        resolve(e.target.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
}
