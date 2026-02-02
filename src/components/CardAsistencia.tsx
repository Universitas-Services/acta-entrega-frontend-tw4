import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useLoaderStore } from '@/stores/useLoaderStore';

interface CardProProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function CardPro({
  href,
  icon,
  title,
  description,
  className,
}: CardProProps) {
  const { showLoader } = useLoaderStore();

  return (
    <Link
      href={href}
      onClick={() => showLoader()}
      className={cn('block w-full max-w-4xl', className)}
    >
      <div
        className={cn(
          // --- Contenedor Principal y Posicionamiento ---
          'relative w-full p-6 border rounded-4xl shadow-sm',
          'bg-card text-card-foreground',

          'h-auto sm:h-[200px]',
          'flex flex-col sm:flex-row gap-x-6 gap-y-4',
          'items-center',

          // --- Efectos visuales ---
          'bg-card shadow-sm border-2 border-chillon',
          'transition-all duration-300 ease-in-out',
          'hover:shadow-lg hover:scale-[1.01]'
        )}
      >
        {/* --- Contenedor del Ícono --- */}
        <div className="flex-shrink-0 self-start">{icon}</div>

        {/* --- Contenido de Texto --- */}
        <div className="flex flex-col md:pr-14">
          <h3 className="text-3xl font-bold text-primary mb-1">{title}</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
