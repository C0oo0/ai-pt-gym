import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { middleware } from "./middleware";

function makeRequest(path: string, cookies: Record<string, string> = {}) {
  const cookieHeader = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
  return new NextRequest(new URL(`http://localhost:3000${path}`), {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

describe("auth wall middleware", () => {
  it("mengredirect /chat tanpa cookie sesi ke /", () => {
    const response = middleware(makeRequest("/chat"));
    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
    expect(response.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("mengizinkan /chat lewat bila ada cookie sesi authjs", () => {
    const response = middleware(
      makeRequest("/chat", { "authjs.session-token": "abc123" }),
    );
    expect(response.headers.get("location")).toBeNull();
  });

  it("mengizinkan /chat lewat bila ada cookie sesi versi secure (produksi https)", () => {
    const response = middleware(
      makeRequest("/chat", { "__Secure-authjs.session-token": "abc123" }),
    );
    expect(response.headers.get("location")).toBeNull();
  });

  it("tidak menyentuh path di luar /chat", () => {
    const response = middleware(makeRequest("/"));
    expect(response.headers.get("location")).toBeNull();
  });
});
