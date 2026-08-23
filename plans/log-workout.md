---
type: Plan
title: Log latihan via chat
description: User bercerita "tadi squat 80kg 3x8", AI mengekstrak dan mencatat sebagai WorkoutEntry.
resource: POST /api/chat
tags: [extraction, mvp, week-2]
timestamp: 2026-08-22
---

# Goal
Obrolan natural → baris `WorkoutEntry`. User tidak pernah menyentuh form.
Ini fitur pembeda produk; kerjakan setelah chat endpoint dasar jalan.

# Pieces
1. Tool-call / structured output `logWorkout(entries)` yang dipanggil AI saat
   mendeteksi cerita latihan.
2. Pure function `normalizeWorkoutEntries(raw)` di server: clamp & validasi
   (reps 1–100, sets 1–20, weight 0–500 kg, nama exercise di-trim).
   JANGAN percaya output AI mentah — ini lapisan pertahanan halusinasi.
3. Balasan konfirmasi eksplisit: "Tercatat: bench press 60kg 5x5" sehingga
   user bisa mengoreksi.
4. Tanggal default hari ini; user bisa bilang "kemarin" → AI yang menerjemahkan.

# Out of scope
- Mengedit/menghapus entri via chat ("hapus set kedua").
- Nama latihan tak dikenal → simpan string mentah dulu, kurasi nanti.

# Done looks like
- "tadi squat 80kg 3x8 sama bench 60kg 5x5" → 2 baris WorkoutEntry hari ini.
- `normalizeWorkoutEntries` punya unit test: input `reps: 9999` di-clamp,
  `weight: -5` ditolak (Minggu 2 — tes sebelum UI).

# Citations
[1] [Data model](data-model.md)
[2] [Chat endpoint](chat-endpoint.md)
