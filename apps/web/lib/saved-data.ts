export const MAX_SAVE_BYTES = 8 * 1024 * 1024;

export type AuthFetch = (
  url: string,
  options?: RequestInit
) => Promise<Response>;

export interface SaveDataPayload {
  category: string;
  toolId?: string;
  data: Record<string, unknown>;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 16 * 1024;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    let chunkBinary = "";
    for (let j = 0; j < chunk.length; j += 1) {
      chunkBinary += String.fromCharCode(chunk[j] ?? 0);
    }
    binary += chunkBinary;
  }

  return btoa(binary);
}

export function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function getResponseMessage(payload: unknown): string | null {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof (payload as { message?: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }
  return null;
}

export async function postSavedData(
  authFetch: AuthFetch,
  payload: SaveDataPayload
): Promise<{ ok: boolean; message: string }> {
  const response = await authFetch("/api/saved-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    return {
      ok: false,
      message: getResponseMessage(body) || "Failed to save file.",
    };
  }

  return {
    ok: true,
    message: getResponseMessage(body) || "File saved to your account successfully.",
  };
}
