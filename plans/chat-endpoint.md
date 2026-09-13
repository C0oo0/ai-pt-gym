---
type: Plan
title: Chat endpoint
description: POST /api/chat menerima pesan user dan membalas sebagai AI PT yang ingat konteks.
resource: POST /api/chat
tags: [chat, api, mvp, week-3]
timestamp: 2026-08-22
---

# Goal
Satu endpoint: kirim pesan, terima balasan AI PT yang memakai riwayat obrolan
sebagai konteks — jadi terasa seperti PT yang mengenal usernya.

# Pieces
1. Route `POST /api/chat` (wajib auth — Minggu 3; tolak tanpa session).
2. Provider LLM via env var (`LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`),
   kontrak OpenAI-compatible — lihat [kesimpulan spike](spike-odysseus.md).
3. Muat N pesan terakhir user sebagai konteks (mulai N = 20).
4. System prompt persona PT: suportif, bahasa Indonesia, proaktif bertanya
   (tujuan, berat badan, pengalaman, cedera), TIDAK memberi nasihat medis,
   dan memanggil pencatatan saat user bercerita latihan/makanan.
5. Simpan pesan user + balasan assistant ke `ChatMessage`.
6. Tangani error provider LLM: balas pesan gagal yang jujur, jangan bubble kosong.

# Out of scope
- Streaming token per kata.
- Multi-bahasa (Indonesia dulu).
- RAG / knowledge base latihan.

# Done looks like
- Respons 201 berisi balasan AI yang menyebut info dari pesan sebelumnya
  (bukti konteks jalan).
- Riwayat muncul lagi setelah halaman dimuat ulang.
- Request tanpa login ditolak.

# Citations
[1] [Log latihan via chat](log-workout.md)
[2] [Evaluasi Odysseus AI](spike-odysseus.md) - pilihan provider menunggu hasil spike ini.
