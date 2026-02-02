'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';
import Image from 'next/image';

export default function AcercaDePage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle('Acerca de');
  }, [setTitle]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        {/* Encabezado con Logo y Título */}
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left mb-6">
          <div className="relative h-[100px] w-[100px] flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
            <Image
              src="/LOGO_CON_FONDO.png"
              alt="Universitas Legal Logo"
              fill // Usamos 'fill' para que la imagen llene el contenedor
              className="object-contain" // 'object-contain' para que no se deforme
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">
              Acerca de Acta de Entrega
            </h2>
            <p className="text-md text-muted-foreground italic">
              Una solución innovadora del Equipo de Actas de Entrega.
            </p>
          </div>
        </div>

        {/* Separador */}
        <hr className="my-6" />

        {/* Contenido Principal */}
        <div className="space-y-4 text-g7 leading-relaxed">
          <p>
            <strong>Acta de Entrega</strong> es la solución tecnológica líder
            diseñada para asistir de manera integral a los servidores públicos
            en Venezuela. Nuestra plataforma transforma un proceso
            administrativo tradicionalmente complejo en una experiencia digital
            simple, estructurada y con total seguridad jurídica.
          </p>
          <p>
            El núcleo de nuestro sistema es una{' '}
            <strong>interfaz inteligente</strong> que guía al usuario a través
            de formularios dinámicos, facilitando la recopilación y organización
            de toda la información requerida por los órganos de control fiscal.
          </p>
          <p className="p-4 bg-muted/30 border-l-4 border-primary rounded-r-lg">
            Nuestra plataforma integra herramientas de vanguardia, como el{' '}
            <strong>Consultor IA</strong>, un asistente normativo que actúa de
            forma proactiva, y un <strong>Sistema de Alertas</strong>{' '}
            automatizado que garantiza el cumplimiento de los lapsos legales de
            3, 5 y 120 días. Además, el <strong>módulo de Compliance</strong>{' '}
            permite realizar auditorías preventivas antes de la firma final,
            asegurando que cada acta cumpla estrictamente con la
            <strong>Resolución N.º 01-00-0162 de la CGR</strong>.
          </p>
          <p>
            <strong>Acta de Entrega</strong> no es solo una aplicación para
            generar documentos; es un compromiso con la transparencia, la
            eficiencia y la seguridad jurídica. Es una herramienta potente y
            confiable diseñada para aportar control y tranquilidad a la labor de
            los servidores públicos de nuestro país.
          </p>
        </div>
      </div>
    </div>
  );
}
