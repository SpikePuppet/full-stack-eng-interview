import type { UserSelection } from "../types/comparison";

/**
 * Export selections to a downloadable JSON file
 */
export function exportSelections(selections: Map<string, UserSelection>): void {
  const selectionsArray = Array.from(selections.values());
  const json = JSON.stringify(selectionsArray, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `selections-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
