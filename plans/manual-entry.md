---
type: Plan
title: Form input manual
description: Alternatif jalur pencatatan selain chat: form latihan/diet untuk user yang tidak ingin mengetik cerita.
resource: /log
tags: [ui, later]
timestamp: 2026-08-23
---

# Trigger
Keputusan pemilik produk (2026-08-23): catatan bisa dari cerita chat ATAU form.
Penempatan: LATER — chat dulu sampai stabil (MVP & vertical slice), form menyusul
begitu entri + validasinya terbukti.

# Goal
User yang tidak mau bercerita tetap bisa mencatat latihan/makanan lewat form cepat.

# Pieces
1. Form React + tRPC mutation yang menulis ke tabel yang sama
   (WorkoutEntry / DietEntry) — SATU sumber data, dua pintu masuk.
2. Validasi form memakai zod-schema yang sama dengan
   `normalizeWorkoutEntries` / `normalizeDietEntries` — jangan dua logika validasi.
3. Empty state mengarahkan ke chat: "atau ceritakan saja latihanmu di chat".

# Out of scope
- Duplikasi model data untuk entri manual (dilarang; itu menyalahgunakan abstraksi).

# Done looks like
- Entri dari form dan entri dari chat tampil di daftar yang sama tanpa beda.
- Unit test validasi bersif untuk kedua jalur input.

# Citations
[1] [Log latihan via chat](log-workout.md)
[2] [Log diet via chat](diet-log.md)
