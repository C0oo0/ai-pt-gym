import { describe, expect, it } from "vitest";

import { toLlmMessages } from "./messages";

describe("toLlmMessages", () => {
  it("membalik urutan desc (terbaru duluan) menjadi kronologis", () => {
    const result = toLlmMessages(
      [
        { role: "ASSISTANT", content: "hai" },
        { role: "USER", content: "halo" },
      ],
      "system-prompt",
    );
    expect(result).toEqual([
      { role: "system", content: "system-prompt" },
      { role: "user", content: "halo" },
      { role: "assistant", content: "hai" },
    ]);
  });

  it("menaruh system prompt di depan", () => {
    const result = toLlmMessages(
      [{ role: "USER", content: "halo" }],
      "kamu PT",
    );
    expect(result[0]).toEqual({ role: "system", content: "kamu PT" });
  });

  it("membatasi riwayat ke N pesan terbaru (membuang terlama)", () => {
    const rowsDesc = Array.from({ length: 31 }, (_, i) => ({
      role: "USER" as const,
      content: `pesan-${30 - i}`,
    }));
    const result = toLlmMessages(rowsDesc, "s", 20);
    expect(result).toHaveLength(21);
    expect(result[1]?.content).toBe("pesan-11");
    expect(result.at(-1)?.content).toBe("pesan-30");
  });

  it("tanpa riwayat hanya menghasilkan system prompt", () => {
    expect(toLlmMessages([], "s")).toEqual([
      { role: "system", content: "s" },
    ]);
  });
});
