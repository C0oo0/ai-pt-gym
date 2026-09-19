import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { chatCompletion, LlmError, type LlmConfig } from "~/server/llm/client";
import { toLlmMessages } from "~/server/llm/messages";
import { PT_SYSTEM_PROMPT } from "~/server/llm/prompt";

function llmConfigFromEnv(): LlmConfig | null {
  const baseUrl = process.env.LLM_BASE_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;
  if (!baseUrl || !apiKey || !model) return null;
  return { baseUrl, apiKey, model };
}

export const chatRouter = createTRPCRouter({
  send: protectedProcedure
    .input(z.object({ content: z.string().min(1).max(4000) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const history = await ctx.db.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { role: true, content: true },
      });

      await ctx.db.chatMessage.create({
        data: { userId, role: "USER", content: input.content },
      });

      const config = llmConfigFromEnv();
      if (!config) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "Provider LLM belum dikonfigurasi (LLM_BASE_URL / LLM_API_KEY / LLM_MODEL).",
        });
      }

      let reply: string;
      try {
        reply = await chatCompletion({
          config,
          messages: toLlmMessages(
            [{ role: "USER", content: input.content }, ...history],
            PT_SYSTEM_PROMPT,
          ),
        });
      } catch (error) {
        const detail =
          error instanceof LlmError
            ? error.message
            : "kesalahan tak terduga";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `AI PT sedang tidak bisa membalas (${detail}). Pesanmu tersimpan, coba lagi sebentar.`,
        });
      }

      await ctx.db.chatMessage.create({
        data: { userId, role: "ASSISTANT", content: reply },
      });

      return { reply };
    }),

  history: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.chatMessage.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "asc" },
      take: 200,
      select: { id: true, role: true, content: true, createdAt: true },
    });
  }),
});
