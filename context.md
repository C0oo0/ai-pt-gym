# Project Context

> Sumber kebenaran deskriptif proyek (apa yang ADA). Rencana preskriptif ada di `plans/`.
> Dibuat Minggu 0, ditumbuhkan setiap minggu.

## Purpose
Web app kebugaran tempat user mengobrol dengan AI PT: konsultasi program, diskusi diet,
dan mencatat latihan/makanan — cukup dengan bercerita (jalur utama) atau lewat form
cepat (later; lihat `plans/manual-entry.md`).

## Target Users
Orang yang latihan di gym (pemula–menengah) yang ingin arahan layaknya personal trainer
tanpa biaya PT, dan malas mencatat latihan secara manual.

## Stack
- Frontend: Next.js 15 (App Router, build Turbopack) + TypeScript strict
- Backend: tRPC v11
- DB: PostgreSQL + Prisma (client di `generated/prisma`)
- Auth: NextAuth v5 (Discord) — placeholder, dipasang Minggu 3
- Deploy: Vercel — live di https://aiptgym.vercel.app (sejak Minggu 0)

## Success Criteria (MVP)
- Orang asing bisa daftar, mengobrol dengan AI PT, dan mencatat satu sesi latihan
  hanya lewat chat — di produksi, bukan localhost.
- Semua catatan terikat ke user yang login.
- Ekstraksi entri lolos validasi server (output AI tidak pernah dipercaya mentah).

## Rencana
Lihat `plans/` (format OKF). Mulai dari `plans/index.md`.

## Data Models
- `User` — model NextAuth (dipakai ulang, jangan duplikat): id, name, email (unique), image.
- `ChatMessage` — userId (Cascade), role enum `USER|ASSISTANT`, content, createdAt.
  Index: `(userId, createdAt)` — query riwayat chat selalu per-user urut waktu.
- `WorkoutEntry` — userId (Cascade), date (DATE murni, bebas timezone), exercise,
  sets, reps, weight (kg integer; rentang divalidasi di lapisan `normalize*`, bukan skema).
  Index: `(userId, date)`.
- `DietEntry` — userId (Cascade), date (DATE), food, qty (string bebas), calories?
  (estimasi AI, nullable). Index: `(userId, date)`.
- Kebijakan hapus: user terhapus → semua catatan pribadinya ikut terhapus (Cascade).
- Migrasi pertama: `20260823080622_init`. Baca SQL-nya di `prisma/migrations/`.

## Utang Pembersihan
- Model `Post` + router/UI demo T3 masih ada — hapus saat mulai membangun UI sungguhan.

## Keputusan & Utang Tercatat
- 2026-08-23: build memakai `--turbopack` (webpack glob EPERM terhadap junction
  Windows di luar proyek; Turbopack lolos penuh: compile+lint+typecheck).
- 2026-08-23: next-auth dinaikkan ke 5.0.0-beta.32 (fix 3 advisory CRITICAL
  di @auth/core).
- UTANG: 6 advisory high transitive lewat `next` (postcss, sharp) — hanya teratasi
  dengan upgrade major ke Next 16. Dinilai ulang saat Minggu 5 (SHIELD) atau saat
  Next 16 stabil. Jalankan `npm audit` berkala.
- Provider LLM: kandidat Odysseus AI (klaim gratis & open source, belum diverifikasi),
  target RAG — lihat `plans/spike-odysseus.md`.
