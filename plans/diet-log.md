---
type: Plan
title: Log diet via chat
description: Pola ekstraksi latihan, diterapkan ke makanan: "tadi makan nasi + ayam goreng" → DietEntry.
resource: POST /api/chat
tags: [extraction, mvp-slice-2]
timestamp: 2026-08-22
---

# Goal
Slice vertikal kedua: cerita makanan di chat → baris `DietEntry`, reusing pola
log-workout. Kerjakan SETELAH log-workout terbukti stabil.

# Pieces
1. Tool `logDiet(entries)`: food, qty (string bebas: "1 piring"), calories? (estimasi AI).
2. Reuse `normalizeWorkoutEntries` pattern → `normalizeDietEntries` (validasi
   calories 0–5000, food non-kosong).
3. Konfirmasi + disclaimer tegas: kalori HANYA estimasi AI, bukan nasihat
   medis/nutrisi klinis (keputusan final, disepakati 2026-08-22).

# Out of scope
- Database nutrisi / barcode scanning.
- Target kalori harian otomatis (butuh data tinggi/berat/aktivitas — belum ada).

# Done looks like
- "sarapan telur 3 sama roti gandum" → 1-2 baris DietEntry hari ini.
- Unit test normalisasi diet hijau.

# Citations
[1] [Log latihan via chat](log-workout.md) - pola yang di-reuse.
