'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { Button } from '@/components/ui/button';
import { FaArrowRight } from 'react-icons/fa';

export default function CompliancePage() {
  const { setTitle } = useHeader();

  // Actualiza el título del Header al cargar la página
  useEffect(() => {
    setTitle('Asistente Virtual');
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
              Tu Asesor IA, experto en experto en Actas de Entrega. Disponible
              al instante.
            </h2>
            <p className="text-base text-primary-foreground/80">
              {' '}
              {/* Texto con opacidad para un look más suave */}
              Resuelve tus dudas al instante. Nuestro Asesor utiliza
              inteligencia artificial para analizar tu caso y responder tus
              preguntas sobre Actas de Entrega y normativas. Además, un agente
              experto revisará la consulta para entregarte un reporte con
              observaciones profesionales.
            </p>
          </div>

          <Button
            asChild
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold whitespace-nowrap w-full md:w-auto"
          >
            <a
              href="https://api.whatsapp.com/send?phone=+584125253023&text=Hola,%20quiero%20adquirir%20Actas%20de%20Entregas%20PRO"
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
          <p className="text-base font-semibold">Con el Asesor IA podrás:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-base text-primary-foreground/80">
            <li>Consultar 24/7 sobre normativas y procedimientos.</li>
            <li>Recibir respuestas aplicadas directamente a tu caso.</li>
            <li>
              Obtener un reporte de observaciones validado por un experto.
            </li>
            <li>Aclarar dudas complejas de forma rápida y segura.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
