import type { LlmMessage } from "./client";

export function toLlmMessages(
  rowsDesc: Array<{ role: "USER" | "ASSISTANT"; content: string }>,
  systemPrompt: string,
  limit = 20,
): LlmMessage[] {
  const recentDesc = rowsDesc.slice(0, limit);
  const chronological = recentDesc.reverse();

  return [
    { role: "system", content: systemPrompt },
    ...chronological.map((row) => ({
      role: row.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: row.content,
    })),
  ];
}
