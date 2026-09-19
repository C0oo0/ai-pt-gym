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

## Testing
- Runner: Vitest (`npm run test`, watch: `npm run test:watch`, coverage: `npm run test -- --coverage`).
- `src/lib/workout.ts` — `normalizeWorkoutEntries`: 13 unit test, 100% baris.
  Ini pagar halusinasi: output AI tidak pernah masuk DB tanpa lolos normalisasi.
- Belum ada: integration test endpoint chat (menyusul setelah endpoint ada, pasca-spike).
- Aturan dari Minggu 2: tes ditulis SEBELUM implementasi (Red-Green-Refactor);
  AI dilarang mengedit file tes agar lulus.

## Auth
- Provider: Discord (NextAuth v5 + PrismaAdapter). Konfigurasi: `src/server/auth/config.ts`.
- Tembok berlapis dua: (1) `src/middleware.ts` = gerbang UX (cek cookie sesi, tanpa
  Prisma karena Edge runtime — otorisasi sesungguhnya BUKAN di sini); (2) halaman
  server + `protectedProcedure` tRPC = otorisasi sebenarnya.
- Halaman terlindungi: `/chat`. UI hanya bergantung pada abstraksi `auth()`/session
  (bukan provider) — provider bisa ditambah/ditukar tanpa menyentuh UI.
- Middleware punya 4 unit test (`src/middleware.test.ts`), TDD penuh.

## Utang Pembersihan
- Model `Post` + router/UI demo T3 masih ada — hapus saat mulai membangun UI sungguhan.
- Integration test endpoint chat end-to-end dengan DB (perlu test DB terisolasi).

## AI PT Chat (server-side, v1)
- Router: `src/server/api/routers/chat.ts` — `chat.send` (protectedProcedure)
  dan `chat.history`. Riwayat konteks: 20 pesan terakhir.
- Klien LLM: `src/server/llm/client.ts` — kontrak OpenAI-compatible via env
  `LLM_BASE_URL` / `LLM_API_KEY` / `LLM_MODEL` (dev: Ollama; prod: free tier).
- Persona PT: `src/server/llm/prompt.ts` (tanpa nasihat medis, kalori = estimasi).
- Error provider → pesan gagal yang jujur; pesan user tetap tersimpan.
- Tool calling `logWorkout` belum aktif — itu slice `plans/log-workout.md`.

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
