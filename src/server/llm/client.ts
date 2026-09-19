export type LlmMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LlmConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
};

export class LlmError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "LlmError";
  }
}

export async function chatCompletion({
  config,
  messages,
  fetchImpl = fetch,
  signal,
}: {
  config: LlmConfig;
  messages: LlmMessage[];
  fetchImpl?: typeof fetch;
  signal?: AbortSignal;
}): Promise<string> {
  let response: Response;
  try {
    response = await fetchImpl(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({ model: config.model, messages }),
      signal,
    });
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : "unknown error";
    throw new LlmError(`Gagal menghubungi provider LLM: ${detail}`);
  }

  if (!response.ok) {
    throw new LlmError(
      `Provider LLM merespons ${response.status}`,
      response.status,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (cause) {
    throw new LlmError(`Respons provider bukan JSON: ${String(cause)}`);
  }

  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    throw new LlmError("Respons provider tanpa choices");
  }

  const content = (
    choices[0] as { message?: { content?: unknown } }
  ).message?.content;
  if (typeof content !== "string" || content.length === 0) {
    throw new LlmError("Respons provider tanpa konten balasan");
  }

  return content;
}
