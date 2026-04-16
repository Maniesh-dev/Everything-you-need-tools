"use client";

import React from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { usePinnedTools } from "@/context/PinnedToolsContext";
import { PinButton } from "./pin-button";

interface PinToolHeaderActionProps {
  toolSlug: string;
}

export function PinToolHeaderAction({ toolSlug }: PinToolHeaderActionProps) {
  const { user, isLoading } = useAuthContext();
  const { pinnedTools } = usePinnedTools();

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="w-full ml-auto flex items-center gap-2">
        <p className="text-sm text-muted-foreground text-center">
          Want to pin this tool? <Link href="/login" className="text-white hover:underline font-medium bg-green-500 px-2 py-1 rounded-full ml-2">please Login</Link>
        </p>
      </div>
    );
  }

  const pinned = pinnedTools.includes(toolSlug);

  return (
    <div className="ml-auto flex items-center gap-2">
      <p className="hidden md:inline-block text-sm font-medium text-foreground">
        {pinned ? "You Pinned this tool" : "Pin this tool"}
      </p>
      <PinButton toolSlug={toolSlug} />
    </div>
  );
}
