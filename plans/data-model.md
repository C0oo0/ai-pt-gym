---
type: Plan
title: Data model
description: Empat entitas inti: User, ChatMessage, WorkoutEntry, DietEntry.
resource: prisma/schema.prisma
tags: [schema, mvp, week-1]
timestamp: 2026-08-22
---

# Goal
Skema Postgres yang menampung obrolan DAN catatan terstruktur, terlihat nyata di
Prisma Studio. Kerjakan ini lebih dulu: "skema sebelum UI".

# Schema

| Model         | Field kunci                            | Catatan |
|---------------|----------------------------------------|---------|
| User          | id, email, name                        | Dari NextAuth (Minggu 3). |
| ChatMessage   | id, userId, role, content, createdAt   | role: `user` / `assistant`. Riwayat chat = memori AI PT. |
| WorkoutEntry  | id, userId, date, exercise, sets, reps, weight | Hasil ekstraksi AI, bukan input form. |
| DietEntry     | id, userId, date, food, qty, calories? | Kalori = estimasi AI, opsional. Bukan klaim medis. |

# Pieces
1. Tulis skema Prisma + migrasi, verifikasi di Prisma Studio (lab Minggu 1).
2. Aturan kepemilikan: semua query difilter `userId` (anti-IDOR, Minggu 5).

# Out of scope
- Tabel `Program` terstruktur — program disimpan sebagai obrolan dulu, bentuknya
  belum jelas (pola: jangan abstraksi sebelum mengerti).
- Presisi desimal lanjut; `weight` integer kg dulu.

# Done looks like
- Migrasi jalan tanpa error, empat model terlihat di Prisma Studio.
- Bisa menjelaskan mengapa tiap relasi ada (Minggu 1: berpikir algoritmik).

# Citations
[1] [AI PT Gym](/plans/ai-pt.md)
