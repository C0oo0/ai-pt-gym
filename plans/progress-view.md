---
type: Plan
title: Halaman progres
description: Riwayat latihan & ringkasan mingguan (volume per otot, estimasi kalori harian).
resource: GET /progress
tags: [ui, later]
timestamp: 2026-08-22
---

# Goal
User melihat konsistensinya: sesi per minggu, volume latihan, estimasi kalori.
Tertahan sampai [data model](data-model.md) dan log-workout menghasilkan data nyata.

# Pieces
1. Query agregat per minggu (terfilter userId).
2. Grafik sederhana (recharts) + empty state "belum ada catatan — coba cerita
   latihan pertamamu di chat".

# Out of scope
- Ekspor PDF/laporan.
- Perbandingan antar-user.

# Done looks like
- Setelah 3 hari logging via chat, halaman menunjukkan angka yang cocok
  dengan entri di database.

# Citations
[1] [AI PT Gym](ai-pt.md)
