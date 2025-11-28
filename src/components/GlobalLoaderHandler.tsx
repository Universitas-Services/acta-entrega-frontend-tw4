'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoaderStore } from '@/stores/useLoaderStore';

function LoaderHandlerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hideLoader } = useLoaderStore();

  // Cada vez que cambia la URL (pathname o params), apagamos el loader
  useEffect(() => {
    hideLoader();
  }, [pathname, searchParams, hideLoader]);

  return null;
}

export function GlobalLoaderHandler() {
  return (
    // Suspense es necesario porque usamos useSearchParams
    <Suspense fallback={null}>
      <LoaderHandlerContent />
    </Suspense>
  );
}
