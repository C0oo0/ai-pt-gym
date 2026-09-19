import { describe, expect, it } from "vitest";

import { chatCompletion, LlmError } from "./client";

const config = {
  baseUrl: "https://api.example.com/v1",
  apiKey: "test-key",
  model: "test-model",
};

function okResponse(content: string) {
  return new Response(
    JSON.stringify({
      choices: [{ message: { role: "assistant", content } }],
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

describe("chatCompletion", () => {
  it("mengembalikan konten balasan saat provider sukses", async () => {
    const content = await chatCompletion({
      config,
      messages: [{ role: "user", content: "halo" }],
      fetchImpl: async () => okResponse("hai juga"),
    });
    expect(content).toBe("hai juga");
  });

  it("memanggil endpoint yang benar dengan auth header dan payload", async () => {
    let capturedRequest: Request | undefined;
    const content = await chatCompletion({
      config,
      messages: [{ role: "user", content: "halo" }],
      fetchImpl: async (url, init) => {
        capturedRequest = new Request(url, init);
        return okResponse("ok");
      },
    });
    expect(content).toBe("ok");
    expect(capturedRequest!.url).toBe(
      "https://api.example.com/v1/chat/completions",
    );
    expect(capturedRequest!.method).toBe("POST");
    expect(capturedRequest!.headers.get("Authorization")).toBe("Bearer test-key");
    const body = (await capturedRequest!.json()) as {
      model: string;
      messages: Array<{ role: string; content: string }>;
    };
    expect(body.model).toBe("test-model");
    expect(body.messages).toEqual([{ role: "user", content: "halo" }]);
  });

  it("melempar LlmError saat provider merespons non-OK", async () => {
    await expect(
      chatCompletion({
        config,
        messages: [{ role: "user", content: "halo" }],
        fetchImpl: async () =>
          new Response("upstream boom", { status: 503 }),
      }),
    ).rejects.toThrowError(LlmError);
  });

  it("melempar LlmError saat respons bukan JSON valid", async () => {
    await expect(
      chatCompletion({
        config,
        messages: [{ role: "user", content: "halo" }],
        fetchImpl: async () =>
          new Response("<html>gateway</html>", {
            status: 200,
            headers: { "content-type": "text/html" },
          }),
      }),
    ).rejects.toThrowError(LlmError);
  });

  it("melempar LlmError saat choices kosong", async () => {
    await expect(
      chatCompletion({
        config,
        messages: [{ role: "user", content: "halo" }],
        fetchImpl: async () =>
          new Response(JSON.stringify({ choices: [] }), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
      }),
    ).rejects.toThrowError(LlmError);
  });
});
