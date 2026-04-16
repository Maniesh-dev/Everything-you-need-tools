"use client";

import React from "react";
import { PushPin } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/button";
import { usePinnedTools } from "@/context/PinnedToolsContext";
import { useAuthContext } from "@/context/AuthContext";
import { cn } from "@workspace/ui/lib/utils";

interface PinButtonProps {
  toolSlug: string;
  className?: string;
  showText?: boolean;
}

export function PinButton({ toolSlug, className, showText = false }: PinButtonProps) {
  const { user } = useAuthContext();
  const { pinnedTools, togglePin, isLoadingPinned } = usePinnedTools();

  if (!user) return null;

  const pinned = pinnedTools.includes(toolSlug);

  return (
    <Button
      variant="ghost"
      size={showText ? "default" : "icon"}
      onClick={() => togglePin(toolSlug)}
      disabled={isLoadingPinned}
      className={cn(
        "transition-colors",
        pinned ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground",
        className
      )}
      title={pinned ? "Unpin tool" : "Pin tool"}
    >
      <PushPin weight={pinned ? "fill" : "regular"} className={cn("size-5", pinned && "text-primary")} />
      {showText && <span className="ml-2">{pinned ? "Pinned" : "Pin"}</span>}
    </Button>
  );
}
