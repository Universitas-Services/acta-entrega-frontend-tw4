'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FaArrowRight } from 'react-icons/fa6';

interface RepoCardProProps {
  imageUrl: string;
  description: string;
  buttonText: string;
  linkHref: string;
  className?: string;
}

export function RepoCardPro({
  imageUrl,
  description,
  buttonText,
  linkHref,
  className,
}: RepoCardProProps) {
  return (
    <div
      className={cn(
        // Estructura Base y Tamaño Fijo
        'flex flex-col h-full w-full max-w-[380px]',
        // Estilos Visuales: Borde Chillon estático, Fondo Blanco, Redondeado
        'bg-white border-2 border-chillon rounded-3xl',
        // Sombra fija
        'shadow-md',
        className
      )}
    >
      {/* Contenedor de Imagen */}
      <div className="p-5 pb-0">
        {/* rounded-full para imagen circular/ovalada según diseño Figma */}
        <div className="relative w-full aspect-video ">
          <Image
            src={imageUrl}
            alt="Recurso Universitas"
            fill
            // Quitada la animación de escala
            className="rounded-4xl object-cover"
            sizes="(max-width: 768px) 100vw, 350px"
          />
        </div>
      </div>

      {/* Línea Separadora Azul Estática */}
      <div className="px-5 py-4">
        {/* Color bg-chillon fijo, sin hover */}
        <div className="h-0.5 w-full bg-chillon rounded-full" />
      </div>

      {/* Contenido de Texto y Botón */}
      <div className="flex flex-col flex-grow px-6 pb-6 space-y-4">
        {/* Descripción */}
        <div className="flex-grow flex items-center justify-center">
          <p className="text-sm text-gray-600 font-medium text-center leading-relaxed">
            {description}
          </p>
        </div>

        {/* Botón de Acción */}
        <div className="pt-2">
          <Button
            asChild
            className="w-full h-full rounded-xl text-lg bg-chillon text-primary-foreground hover:bg-chillon/90 font-bold shadow-sm"
          >
            <Link
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              {buttonText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
