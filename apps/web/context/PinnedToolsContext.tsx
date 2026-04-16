'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';

interface PinnedToolsContextType {
  pinnedTools: string[];
  isLoadingPinned: boolean;
  togglePin: (toolSlug: string) => Promise<void>;
  isPinned: (toolSlug: string) => boolean;
}

const PinnedToolsContext = createContext<PinnedToolsContextType | undefined>(undefined);

export function PinnedToolsProvider({ children }: { children: React.ReactNode }) {
  const { user, getAccessToken } = useAuthContext();
  const [pinnedTools, setPinnedTools] = useState<string[]>([]);
  const [isLoadingPinned, setIsLoadingPinned] = useState(false);

  useEffect(() => {
    if (!user) {
      setPinnedTools([]);
      return;
    }

    async function fetchPinned() {
      setIsLoadingPinned(true);
      try {
        const token = getAccessToken();
        if (!token) return;

        const res = await fetch('/api/user/pinned', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setPinnedTools(data.pinnedTools || []);
        }
      } catch (err) {
        console.error('Failed to fetch pinned tools', err);
      } finally {
        setIsLoadingPinned(false);
      }
    }

    fetchPinned();
  }, [user, getAccessToken]);

  const togglePin = useCallback(async (toolSlug: string) => {
    const token = getAccessToken();
    if (!token) return;

    // Optimistic UI update
    const wasPinned = pinnedTools.includes(toolSlug);
    if (wasPinned) {
      setPinnedTools(prev => prev.filter(slug => slug !== toolSlug));
    } else {
      setPinnedTools(prev => [...prev, toolSlug]);
    }

    try {
      const res = await fetch('/api/user/pinned', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ toolSlug })
      });
      const data = await res.json();
      if (data.success) {
        // Sync with server state
        setPinnedTools(data.pinnedTools || []);
      } else {
        // Revert on error
        setPinnedTools(prev => wasPinned ? [...prev, toolSlug] : prev.filter(slug => slug !== toolSlug));
      }
    } catch (err) {
      console.error('Failed to toggle pin', err);
      // Revert on error
      setPinnedTools(prev => wasPinned ? [...prev, toolSlug] : prev.filter(slug => slug !== toolSlug));
    }
  }, [getAccessToken, pinnedTools]);

  const isPinned = useCallback((toolSlug: string) => {
    return pinnedTools.includes(toolSlug);
  }, [pinnedTools]);

  return (
    <PinnedToolsContext.Provider value={{ pinnedTools, isLoadingPinned, togglePin, isPinned }}>
      {children}
    </PinnedToolsContext.Provider>
  );
}

export function usePinnedTools() {
  const context = useContext(PinnedToolsContext);
  if (context === undefined) {
    throw new Error('usePinnedTools must be used within a PinnedToolsProvider');
  }
  return context;
}
