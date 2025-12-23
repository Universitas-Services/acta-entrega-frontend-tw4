'use client';

import { useEffect } from 'react';
import Card from '@/components/Card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
} from 'react-icons/fa';
import {
  FaSquareXTwitter,
  FaSquareTwitter,
  FaArrowRight,
} from 'react-icons/fa6';
import { HiDocumentArrowUp, HiDocumentArrowDown } from 'react-icons/hi2';
import { SiSpringsecurity } from 'react-icons/si';
import { useHeader } from '@/context/HeaderContext';
import { useLoaderStore } from '@/stores/useLoaderStore';

export default function DashboardPage() {
  const { setTitle } = useHeader();
  const { showLoader } = useLoaderStore();

  useEffect(() => {
    setTitle('Menú principal');
  }, [setTitle]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* El ícono de fondo es gris, el ícono en sí debe ser del color correcto. El #C1C1C1 es --muted */}
        <Card
          icon={<HiDocumentArrowUp className="h-6 w-6 text-white" />} // <-- Ícono oscuro sobre fondo gris
          title="Acta de Entrega Saliente"
          description="Generar el acta de entrega con facilidad para el Servidor Público Saliente."
          hashtag="#UniversitasLegal"
          href="/dashboard/actas/saliente"
          gratis={true}
        />
        <Card
          icon={<HiDocumentArrowDown className="h-6 w-6 text-white" />} // <-- Ícono oscuro sobre fondo gris
          title="Actas de Entrega Entrante"
          description="Generar el acta de entrega con facilidad para el Servidor Público Entrante."
          hashtag="#UniversitasLegal"
          href="/dashboard/actas/entrante"
          gratis={true}
        />
        <Card
          icon={<SiSpringsecurity className="h-6 w-6 text-white" />} // <-- Ícono oscuro sobre fondo gris
          title="Maxima Autoridad"
          description="Generar el acta de entrega con facilidad para el Servidor Público asignado por la Máxima Autoridad."
          hashtag="#UniversitasLegal"
          href="/dashboard/actas/maxima-autoridad"
          gratis={true}
        />
      </div>

      {/* --- SECCIÓN "CONÓCENOS Y SÍGUENOS" --- */}
      {/* Clases actualizadas para usar bg-primary y text-primary-foreground */}
      <div className="w-full rounded-xl bg-primary text-primary-foreground p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Conócenos y síguenos en nuestras redes
            </h2>
            <p className="text-base text-primary-foreground/80">
              {' '}
              {/* Usando opacidad para texto secundario */}
              Forma parte de nuestra comunidad. Accede a todos nuestros cursos
              sobre diversos temas de la Administración Pública. Infórmate de
              temas de interés en nuestro medio digital, Ágora.
            </p>
          </div>
          <Button
            asChild
            // Usando bg-secondary para el color dorado
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold whitespace-nowrap w-full md:w-auto"
          >
            <Link
              href="/dashboard/conocenos"
              onClick={() => showLoader()}
              className="flex items-center gap-2"
            >
              Más información
              <FaArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="h-px w-full bg-primary-foreground/20 my-6" />

        {/* Sección Inferior Responsiva */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 'text-xl md:text-2xl': Tamaño de fuente adaptable. */}
          <h3 className="text-xl md:text-2xl font-bold">Síguenos en:</h3>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/ContratarVe/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
            >
              <FaFacebookSquare className="h-7 w-7" />
            </a>
            <a
              href="https://www.instagram.com/universitas.legal/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
            >
              <FaInstagramSquare className="h-7 w-7" />
            </a>
            <a
              href="https://www.linkedin.com/company/universitas-legal/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
            >
              <FaLinkedin className="h-7 w-7" />
            </a>
            <a
              href="https://twitter.com/contratosve"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
            >
              <FaSquareXTwitter className="h-7 w-7" />
            </a>
            <a
              href="https://twitter.com/contratarve"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
            >
              <FaSquareTwitter className="h-7 w-7" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
