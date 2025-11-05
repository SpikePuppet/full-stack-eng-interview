interface PromptCardProps {
  promptId: string;
  promptText: string;
  promptNumber: number;
}

export function PromptCard({
  promptId,
  promptText,
  promptNumber,
}: PromptCardProps) {
  return (
    <div className="prompt-card">
      <div className="prompt-header">
        <h3>Prompt {promptNumber}</h3>
      </div>
      <div className="prompt-text">{promptText}</div>
      <div className="prompt-id">{promptId}</div>
    </div>
  );
}
