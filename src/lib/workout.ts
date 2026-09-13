export type NormalizedWorkoutEntry = {
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  date?: string;
};

export type NormalizeWorkoutResult = {
  entries: NormalizedWorkoutEntry[];
  rejected: { entry: unknown; reason: string }[];
};

const LIMITS = {
  exerciseMaxLen: 120,
  sets: { min: 1, max: 20 },
  reps: { min: 1, max: 100 },
  weight: { min: 0, max: 500 },
} as const;

function toIntInRange(
  value: unknown,
  { min, max }: { min: number; max: number },
): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < min) return null;
  return Math.min(rounded, max);
}

function normalizeExercise(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > LIMITS.exerciseMaxLen) return null;
  return trimmed;
}

function normalizeDate(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  if (parsed.toISOString().slice(0, 10) !== value) return null;
  return value;
}

export function normalizeWorkoutEntries(raw: unknown): NormalizeWorkoutResult {
  if (!Array.isArray(raw)) {
    throw new TypeError("normalizeWorkoutEntries: input harus array");
  }

  const entries: NormalizedWorkoutEntry[] = [];
  const rejected: { entry: unknown; reason: string }[] = [];

  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) {
      rejected.push({ entry, reason: "entri bukan objek" });
      continue;
    }

    const record = entry as Record<string, unknown>;

    const exercise = normalizeExercise(record.exercise);
    if (exercise === null) {
      rejected.push({ entry, reason: "exercise tidak valid" });
      continue;
    }

    const sets = toIntInRange(record.sets, LIMITS.sets);
    if (sets === null) {
      rejected.push({ entry, reason: "sets tidak valid" });
      continue;
    }

    const reps = toIntInRange(record.reps, LIMITS.reps);
    if (reps === null) {
      rejected.push({ entry, reason: "reps tidak valid" });
      continue;
    }

    const weight = toIntInRange(record.weight, LIMITS.weight);
    if (weight === null) {
      rejected.push({ entry, reason: "weight tidak valid" });
      continue;
    }

    const date = normalizeDate(record.date);
    if (date === null) {
      rejected.push({ entry, reason: "date tidak valid" });
      continue;
    }

    const normalized: NormalizedWorkoutEntry = { exercise, sets, reps, weight };
    if (date !== undefined) normalized.date = date;
    entries.push(normalized);
  }

  return { entries, rejected };
}
