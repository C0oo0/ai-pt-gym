import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center gap-4 px-4 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ruang obrolan AI PT
        </h1>
        <p className="text-lg text-white/80">
          Halo, {session.user.name ?? session.user.email} — halaman ini
          terlindungi tembok auth.
        </p>
        <p className="max-w-md text-center text-sm text-white/60">
          Obrolan sungguhan dengan AI PT menyusul: menunggu endpoint chat
          (lihat <code>plans/chat-endpoint.md</code>).
        </p>
      </div>
    </main>
  );
}
