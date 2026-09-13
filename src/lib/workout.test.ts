import { describe, expect, it } from "vitest";
import { normalizeWorkoutEntries } from "./workout";

describe("normalizeWorkoutEntries", () => {
  it("menerima entri valid tanpa mengubahnya", () => {
    const result = normalizeWorkoutEntries([
      { exercise: "bench press", sets: 5, reps: 5, weight: 60 },
    ]);
    expect(result.entries).toEqual([
      { exercise: "bench press", sets: 5, reps: 5, weight: 60 },
    ]);
    expect(result.rejected).toEqual([]);
  });

  it("mempertahankan urutan beberapa entri valid", () => {
    const result = normalizeWorkoutEntries([
      { exercise: "squat", sets: 3, reps: 8, weight: 80 },
      { exercise: "bench press", sets: 5, reps: 5, weight: 60 },
    ]);
    expect(result.entries).toHaveLength(2);
    expect(result.entries[0]?.exercise).toBe("squat");
    expect(result.entries[1]?.exercise).toBe("bench press");
  });

  it("me-clamp reps di atas 100 menjadi 100", () => {
    const result = normalizeWorkoutEntries([
      { exercise: "curl", sets: 3, reps: 9999, weight: 10 },
    ]);
    expect(result.entries[0]?.reps).toBe(100);
  });

  it("me-clamp weight di atas 500 menjadi 500", () => {
    const result = normalizeWorkoutEntries([
      { exercise: "deadlift", sets: 1, reps: 1, weight: 600 },
    ]);
    expect(result.entries[0]?.weight).toBe(500);
  });

  it("menolak weight negatif", () => {
    const result = normalizeWorkoutEntries([
      { exercise: "squat", sets: 3, reps: 8, weight: -5 },
    ]);
    expect(result.entries).toEqual([]);
    expect(result.rejected).toHaveLength(1);
  });

  it("menolak sets di bawah 1", () => {
    const result = normalizeWorkoutEntries([
      { exercise: "squat", sets: 0, reps: 8, weight: 80 },
    ]);
    expect(result.entries).toEqual([]);
    expect(result.rejected).toHaveLength(1);
  });

  it("menolak reps berupa string, bukan angka", () => {
    const result = normalizeWorkoutEntries([
      { exercise: "squat", sets: 3, reps: "8", weight: 80 },
    ]);
    expect(result.entries).toEqual([]);
    expect(result.rejected).toHaveLength(1);
  });

  it("menolak entri tanpa exercise", () => {
    const result = normalizeWorkoutEntries([{ sets: 3, reps: 8, weight: 80 }]);
    expect(result.entries).toEqual([]);
    expect(result.rejected).toHaveLength(1);
  });

  it("me-trim nama exercise dan menolak yang kosong setelah trim", () => {
    const result = normalizeWorkoutEntries([
      { exercise: "  bench press  ", sets: 5, reps: 5, weight: 60 },
      { exercise: "   ", sets: 5, reps: 5, weight: 60 },
    ]);
    expect(result.entries).toEqual([
      { exercise: "bench press", sets: 5, reps: 5, weight: 60 },
    ]);
    expect(result.rejected).toHaveLength(1);
  });

  it("membulatkan sets pecahan menjadi integer", () => {
    const result = normalizeWorkoutEntries([
      { exercise: "squat", sets: 3.7, reps: 8, weight: 80 },
    ]);
    expect(result.entries[0]?.sets).toBe(4);
  });

  it("menerima date valid YYYY-MM-DD dan menolak date tidak valid", () => {
    const result = normalizeWorkoutEntries([
      { exercise: "squat", sets: 3, reps: 8, weight: 80, date: "2026-08-23" },
      { exercise: "bench press", sets: 5, reps: 5, weight: 60, date: "2026-13-45" },
    ]);
    expect(result.entries).toEqual([
      { exercise: "squat", sets: 3, reps: 8, weight: 80, date: "2026-08-23" },
    ]);
    expect(result.rejected).toHaveLength(1);
  });

  it("membuang entri non-objek tanpa menggagalkan sisanya", () => {
    const result = normalizeWorkoutEntries([
      "nonsense",
      { exercise: "squat", sets: 3, reps: 8, weight: 80 },
    ]);
    expect(result.entries).toHaveLength(1);
    expect(result.rejected).toHaveLength(1);
  });

  it("melempar TypeError untuk input bukan array", () => {
    expect(() => normalizeWorkoutEntries("bukan array")).toThrow(TypeError);
  });
});
