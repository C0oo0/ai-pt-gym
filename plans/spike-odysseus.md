---
type: Spike
title: Evaluasi Odysseus AI
description: Hasil verifikasi Odysseus AI — self-hosted AI workspace, BUKAN provider LLM untuk server web. Keputusan provider dipindah ke abstraksi OpenAI-compatible.
tags: [llm, chat, mvp]
timestamp: 2026-09-13
---

# Trigger
Keputusan provider untuk [chat endpoint](chat-endpoint.md). Keputusan awal pemilik
produk (2026-08-23): Odysseus AI + RAG riset gym. Klaim: gratis & open source.

# Temuan (diverifikasi 2026-09-13)
- Repo utama: `odysseus-dev/odysseus`, ~87k bintang, AGPL-3.0, aktif.
- Odysseus adalah **self-hosted AI WORKSPACE** (chat, agen, riset, dokumen, email,
  catatan untuk pemakai pribadi) — bukan model, bukan hosted API.
- Deployment: Docker Compose di mesin sendiri (mesin kita: tidak ada Docker).
- Ia meng-orkestrasi model lokal/API ("local/API models") — bukan framework
  training/fine-tuning. Fitur RAG/memory-nya hidup DI DALAM workspace-nya,
  tidak berpindah ke app kita.
- Klaim "gratis & open source": BENAR untuk aplikasinya. TAPI inferensi untuk
  produksi tidak pernah gratis: server Vercel tidak bisa menjangkau PC rumahan.

# Kesimpulan
Odysseus **bukan kandidat backend** untuk chat endpoint kita (mvp). Yang kita
butuhkan: endpoint **OpenAI-compatible** yang bisa dipanggil server-side.

Keputusan arsitektur pengganti:
1. Provider diabstraksi lewat env var (`LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`)
   — tukar provider = ganti env, bukan ganti kode.
2. Dev lokal: Ollama (OpenAI-compatible, gratis, jalannya di PC) — opsional.
3. Produksi: provider dengan free tier (kandidat: Groq / Gemini / OpenRouter
   free models) — pilih saat membangun chat endpoint.
4. Korpus riset gym: mulai dari opsi (a) dipadatkan di system prompt.
   RAG penuh ditunda sampai (a) terbukti kurang (YAGNI).
5. Odysseus tetap boleh dipakai pemilik produk sebagai workspace pribadi
   (belajar/mencatat), di luar arsitektur app ini.

# Done looks like
- [x] Keputusan tercatat dengan alasan.
- [ ] Plan tindak lanjut: chat-endpoint.md memakai abstraksi env-var di atas.

# Citations
[1] [Chat endpoint](chat-endpoint.md)
[2] [Log latihan via chat](log-workout.md)
