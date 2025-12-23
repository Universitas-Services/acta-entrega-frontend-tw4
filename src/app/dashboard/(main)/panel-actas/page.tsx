'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { Button } from '@/components/ui/button';
import { FaArrowRight } from 'react-icons/fa';

export default function CompliancePage() {
  const { setTitle } = useHeader();

  // Actualiza el título del Header al cargar la página
  useEffect(() => {
    setTitle('Panel de Actas');
  }, [setTitle]);

  return (
    // Contenedor principal para centrar la tarjeta
    <div className="flex justify-center items-start pt-4 md:pt-10">
      <div className="w-full max-w-4xl rounded-xl bg-primary text-primary-foreground p-6 md:p-8 shadow-lg">
        {/* Contenedor principal responsivo */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
          {/* Título y descripción principal */}
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              Gestiona, corrige y perfecciona todas tus actas en un solo lugar.
            </h2>
            <p className="text-base text-primary-foreground/80">
              {' '}
              {/* Texto con opacidad para un look más suave */}
              El Panel de Actas es tu centro de control exclusivo de la versión
              Pro.
              <br />
              Guarda un historial de todos tus documentos, revisa su estado,
              edita la información y genera el acta final para enviarla por
              correo o compartirla con un enlace seguro.
            </p>
          </div>

          <Button
            asChild
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold whitespace-nowrap w-full md:w-auto"
          >
            <a
              href="https://universitas.myflodesk.com/ae-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center" // Asegura que el ícono esté alineado
            >
              Adquirir versión PRO
              <FaArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="h-px w-full bg-primary-foreground/20 my-6" />

        {/* Lista de características */}
        <div>
          <p className="text-base font-semibold">
            Con el Panel de Actas Pro podrás:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-base text-primary-foreground/80">
            <li>
              Visualizar y editar todas tus actas guardadas en cualquier
              momento.
            </li>
            <li>Recibir alertas automáticas sobre anexos faltantes.</li>
            <li>
              Corregir y regenerar tus documentos cuantas veces sea necesario.
            </li>
            <li>Tener un historial completo para una gestión impecable.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
