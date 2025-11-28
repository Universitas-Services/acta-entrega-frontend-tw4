'use client';

import { useLoaderStore } from '@/stores/useLoaderStore';
import { Spinner } from '@/components/ui/spinner';

export function GlobalSpinner() {
  const { isLoading } = useLoaderStore();

  if (!isLoading) return null;

  return (
    // z-[9999] asegura que esté por encima de TODO (incluyendo sidebars y modales)
    // bg-background/80 + backdrop-blur da un efecto moderno y oculta el "destello"
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background backdrop-blur-sm transition-all duration-200">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="text-primary w-16 h-16" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse"></p>
      </div>
    </div>
  );
}
