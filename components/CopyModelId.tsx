"use client";

import { toast } from "sonner";

export function CopyModelId({
  modelId,
  children,
}: {
  modelId: string;
  children: React.ReactNode;
}) {
  async function handleClick() {
    await navigator.clipboard.writeText(modelId);
    toast.success(`Copied: ${modelId}`);
  }

  return (
    <div onClick={handleClick} role="button" title={`Copy: ${modelId}`}>
      {children}
    </div>
  );
}
