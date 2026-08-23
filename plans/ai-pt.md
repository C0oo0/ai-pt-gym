---
type: Plan
title: AI PT Gym
description: Asisten kebugaran berbasis chat layaknya personal trainer: konsultasi program, dan catat latihan/diet cukup dengan bercerita.
tags: [mvp, top-level]
timestamp: 2026-08-22
---

# Goal
User mengobrol dengan "AI PT": minta program, diskusikan diet, dan cukup bercerita apa
yang ia latih/makan untuk semuanya tercatat otomatis. Tanpa form, tanpa input manual.

# Pieces
1. [Data model](data-model.md) - entitas inti, skema sebelum UI (Minggu 1).
2. [Chat endpoint](chat-endpoint.md) - satu endpoint obrolan dengan persona PT.
3. [Log latihan via chat](log-workout.md) - ekstraksi latihan dari bahasa natural.
4. [Log diet via chat](diet-log.md) - pola ekstraksi yang sama untuk makanan.

# Out of scope (pass ini)
- Analisis video form.
- Integrasi wearable (Google Fit / Apple Health).
- Fitur sosial / leaderboard.
- Pembayaran / langganan.

# Open questions
- Provider LLM: kandidat utama Odysseus AI yang "di-training" dengan riset gym.
  Validasi dulu lewat [spike](spike-odysseus.md) sebelum komit — jangan asumsi.
- Batas riwayat yang dikirim sebagai konteks (biaya & context window)?

# Done looks like
- Orang asing bisa daftar, mengobrol, dan mencatat satu sesi latihan hanya lewat
  chat — di produksi, bukan hanya localhost (checklist MVP).
- Semua catatan tertaut ke user yang login (bukan data global).
