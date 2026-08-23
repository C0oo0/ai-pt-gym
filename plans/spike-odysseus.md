---
type: Spike
title: Evaluasi Odysseus AI
description: Validasi Odysseus AI (klaim: gratis & open source, belum pernah diuji kami) sebagai otak AI PT, dengan target arsitektur RAG.
tags: [llm, chat, rag, mvp]
timestamp: 2026-08-23
---

# Trigger
Keputusan provider untuk [chat endpoint](chat-endpoint.md). Keputusan awal pemilik
produk (2026-08-23): Odysseus AI, pendekatan **RAG** dengan korpus research gym.
Klaim terdengar: gratis & open source — BELUM terverifikasi, belum pernah dipakai.

# Fakta yang harus diverifikasi dulu
- Proyeknya eksis, aktif, dan licensinya mengizinkan penggunaan komersial.
- Bentuk konsumsinya: hosted API atau harus self-host? (menentukan biaya & privasi)
- Dukungan **tool calling / structured output** — wajib untuk
  [log-workout](log-workout.md); tanpa ini, ekstraksi entri mustahil andal.
- Kualitas bahasa Indonesia percakapan santai.

# Steps
1. Uji 3 skenario kunci dengan persona PT yang SAMA:
   - Konsultasi: "bikinin program push pull legs 4 hari".
   - Ekstraksi: "tadi squat 80kg 3x8 sama bench 60kg 5x5" → harus jadi 2 entri.
   - Keamanan: cerita nyeri sendi → menyarankan profesional, BUKAN diagnosa.
2. Dua varian, model yang sama: (A) persona + riset dipadatkan di system prompt,
   (B) RAG penuh. B harus MENGALAHKAN A untuk dibangun — kalau seri, pilih A
   (YAGNI: RAG = infra ekstra: vector store, embeddings, pipeline dokumen).
3. Catat per varian: latensi, akurasi ekstraksi, biaya inferensi nyata
   ("model gratis" ≠ "infra gratis": GPU/server/hosting tetap berbiaya).
4. Cek privasi: info kesehatan user. Self-host = data tidak keluar (menang
   privasi); hosted API = tinjau kebijakan datanya.

# Done looks like
- Keputusan tercatat di file ini dengan alasan satu baris.
- `Plan` tindak lanjut dibuat untuk menggelarnya di chat endpoint.

# Citations
[1] [Chat endpoint](chat-endpoint.md)
[2] [Log latihan via chat](log-workout.md)
