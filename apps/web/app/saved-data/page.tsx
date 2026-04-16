"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useAuth } from "@/hooks/useAuth";
import {
  base64ToUint8,
  formatFileSize,
  getResponseMessage,
} from "@/lib/saved-data";

interface SavedDataRecord {
  _id: string;
  category: string;
  toolId?: string;
  createdAt: string;
  data?: Record<string, unknown>;
}

function getStringValue(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getNumberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function formatSavedDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toSafeArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export default function SavedDataPage() {
  const { user, isLoading, authFetch } = useAuth();
  const [items, setItems] = React.useState<SavedDataRecord[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const signupHref = "/register?redirect=%2Fsaved-data";
  const loginHref = "/login?redirect=%2Fsaved-data";

  const fetchSavedData = React.useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsFetching(true);
    setError(null);
    try {
      const response = await authFetch("/api/saved-data");
      const payload = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        setError(getResponseMessage(payload) || "Failed to load your saved data.");
        return;
      }

      const data = (payload as { data?: unknown } | null)?.data;
      if (Array.isArray(data)) {
        setItems(data as SavedDataRecord[]);
      } else {
        setItems([]);
      }
    } catch {
      setError("Unable to load your saved data right now.");
    } finally {
      setIsFetching(false);
    }
  }, [authFetch, user]);

  React.useEffect(() => {
    fetchSavedData();
  }, [fetchSavedData]);

  function downloadItem(item: SavedDataRecord) {
    const raw = item.data;
    if (!raw || typeof raw !== "object") return;

    const fileName = getStringValue((raw as Record<string, unknown>).fileName);
    const mimeType = getStringValue((raw as Record<string, unknown>).mimeType);
    const fileBase64 = getStringValue((raw as Record<string, unknown>).fileBase64);

    if (fileName && mimeType && fileBase64) {
      const bytes = base64ToUint8(fileBase64);
      const blob = new Blob([toSafeArrayBuffer(bytes)], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    const fallbackName = `${item.toolId || item.category}-data.json`;
    const blob = new Blob([JSON.stringify(raw, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fallbackName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="border border-border/70">
        <CardHeader>
          <CardTitle>Your Saved Data</CardTitle>
          <CardDescription>
            Saved files are private and scoped to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Checking account...</p>
          )}

          {!isLoading && !user && (
            <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">
                Sign in to view your saved data.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={signupHref}>Create account</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={loginHref}>Login</Link>
                </Button>
              </div>
            </div>
          )}

          {!isLoading && user && (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  Signed in as {user.email}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fetchSavedData}
                  disabled={isFetching}
                >
                  {isFetching ? "Refreshing..." : "Refresh"}
                </Button>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              {!error && items.length === 0 && !isFetching && (
                <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                  You have no saved files yet. Open any tool, generate a file, and
                  click Save File.
                </div>
              )}

              {items.length > 0 && (
                <div className="space-y-3">
                  {items.map((item) => {
                    const data = (item.data ?? {}) as Record<string, unknown>;
                    const fileName = getStringValue(data.fileName) || "saved-output";
                    const fileSize = getNumberValue(data.fileSize);
                    const sourceTool = getStringValue(data.savedFromTool) || item.toolId || item.category;

                    return (
                      <div
                        key={item._id}
                        className="rounded-xl border border-border/70 bg-muted/10 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-2">
                            <p className="font-medium">{fileName}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline">{item.category}</Badge>
                              <Badge variant="secondary">{sourceTool}</Badge>
                              {fileSize !== null && (
                                <span>{formatFileSize(fileSize)}</span>
                              )}
                              <span>{formatSavedDate(item.createdAt)}</span>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => downloadItem(item)}>
                            Download
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
