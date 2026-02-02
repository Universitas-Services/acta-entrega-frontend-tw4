'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { Button } from '@/components/ui/button';
import { FaArrowRight } from 'react-icons/fa';

export default function CompliancePage() {
  const { setTitle } = useHeader();

  // Actualiza el título del Header al cargar la página
  useEffect(() => {
    setTitle('Compliance Actas de Entrega');
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
              ¿Están tus Actas de Entrega a prueba de auditorías?
            </h2>
            <p className="text-base text-primary-foreground/80">
              {' '}
              {/* Texto con opacidad para un look más suave */}
              Un simple error en un acta de entrega puede resultar en hallazgos
              y sanciones.
              <br />
              Nuestra herramienta Revisión de Acta Pro te guía en una
              autoevaluación rápida para identificar incumplimientos y asegurar
              la correcta gestión de tu organismo.
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
          <p className="text-base font-semibold">Con la versión Pro podrás:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-base text-primary-foreground/80">
            <li>Realizar una autoevaluación guiada paso a paso.</li>
            <li>Identificar incumplimientos según la normativa vigente.</li>
            <li>Obtener un informe detallado con recomendaciones de mejora.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
