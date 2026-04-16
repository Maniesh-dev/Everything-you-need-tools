"use client";

import React from "react";
import Link from "next/link";
import { PushPin } from "@phosphor-icons/react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { useAuthContext } from "@/context/AuthContext";

export function PinToolPrompt() {
  const { user, isLoading } = useAuthContext();

  if (isLoading || user) return null;

  return (
    <Card className="mt-8 border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-4">
          <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <PushPin weight="fill" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Want to pin your favourite tool?</h3>
            <p className="text-sm text-muted-foreground">Log in to save this tool for quick access from your home page.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
