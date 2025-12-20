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
    // Link para que toda la tarjeta sea navegable
    <Link
      href={href}
      onClick={() => showLoader()}
      className={cn('block w-full max-w-4xl', className)}
    >
      <div
        className={cn(
          // --- Contenedor Principal y Posicionamiento ---
          'relative w-full h-full p-6 border rounded-3xl shadow-sm',
          'bg-card text-card-foreground',

          // --- LAYOUT RESPONSIVE Y ALINEACIÓN ---
          // 1. Es `flex-col` en móvil (apilado) y `flex-row` en pantallas `sm` o más grandes.
          // 2. `items-start` alinea todo (ícono y texto) al TOPE, que es el cambio clave que pediste.
          // 3. `gap-x-6` es el espacio horizontal (desktop), `gap-y-4` es el vertical (móvil).
          'flex flex-col sm:flex-row items-start gap-x-6 gap-y-4',

          // --- Efectos visuales ---
          'bg-card shadow-sm border-2 border-primary',
          'transition-all duration-300 ease-in-out',
          'hover:shadow-lg hover:scale-[1.01]'
        )}
      >
        {/* --- Píldora "PRO" --- */}
        {/* Se posiciona de forma absoluta con respecto al contenedor (`relative`). */}
        <span
          className={cn(
            'absolute top-6 right-6 text-xs font-bold rounded-full px-3 py-1',
            'bg-chillon text-primary'
          )}
        >
          PRO
        </span>

        {/* --- Contenedor del Ícono --- */}
        {/* `flex-shrink-0` evita que el ícono se encoja si el texto es muy largo. */}
        <div className="flex-shrink-0">{icon}</div>

        {/* --- Contenido de Texto --- */}
        {/* `pr-12` o `pr-14` añade un padding a la derecha para que el texto largo
            no se ponga debajo de la píldora "PRO" que está en `absolute`. */}
        <div className="flex flex-col pr-14">
          <h3 className="text-lg font-bold text-primary mb-1">{title}</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
