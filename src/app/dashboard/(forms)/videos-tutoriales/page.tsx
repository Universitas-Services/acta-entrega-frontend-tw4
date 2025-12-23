'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { RepoCardPro } from '@/components/RepoCardPro';

const cardData = [
  {
    imageUrl: '/repositorio-pro/Consideraciones generales.png',
    description:
      'Para garantizar un proceso de entrega-recepción transparente, te invitamos a leer detenidamente las siguientes consideraciones.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/consideraciones-generales/',
  },
  {
    imageUrl: '/repositorio-pro/REPOSITORIO LEGAL.png',
    description: 'Descarga la Resolución CGR N°01-000162 de fecha 27-07-2009.',
    buttonText: 'Descarga aquí',
    linkHref:
      'https://drive.google.com/file/d/1L5y59yCxXiOfbDyuuU3V_5RfT1qouzI-/view',
  },
  {
    imageUrl: '/repositorio/imagen curso para APP.png',
    description:
      'Profundiza en el marco jurídico y los procedimientos clave, asegurando la transparencia y mitigación de riesgos en la administración pública.',
    buttonText: 'Más información',
    linkHref: 'https://universitas.academy/cursos/actas-de-entrega/',
  },
  {
    imageUrl: '/repositorio-pro/ARTICULO AGORA 1.png',
    description:
      'Tienes 120 días para formular observaciones a un acta recibida. Descubre en este análisis los puntos clave que debes verificar para un control fiscal efectivo.',
    buttonText: 'Ingrese aquí',
    linkHref:
      'https://agora.universitasfundacion.com/verificacion-de-acta-de-entrega/',
  },
  {
    imageUrl: '/repositorio-pro/ARTICULO AGORA 2.png',
    description:
      'La Unidad de Auditoría Interna es el actor clave en la verificación. Conoce sus competencias, responsabilidades y el procedimiento que debe seguir para validar las actas.',
    buttonText: 'Ingrese aquí',
    linkHref:
      'https://agora.universitasfundacion.com/acta-de-entrega-verificacion/',
  },
  {
    imageUrl: '/repositorio-pro/ARTICULO AGORA 3.png',
    description:
      'El acta de entrega es más que un requisito; es una herramienta clave del Control Interno. Descubre cómo su correcta verificación previene riesgos y fortalece la gestión.',
    buttonText: 'Ingrese aquí',
    linkHref:
      'https://agora.universitasfundacion.com/verificacion-acta-de-entrega/',
  },
  {
    imageUrl: '/repositorio/control-fiscal.png',
    description:
      'Accede a un compendio normativo completo, doctrina administrativa y jurisprudencia esencial para fortalecer el control fiscal en todos los niveles del sector público.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/jornadas-de-control-fiscal/',
  },
  {
    imageUrl: '/repositorio/biblioteca-contrataciones.png',
    description:
      'Accede a normativa especializada, doctrina administrativa y jurisprudencia clave para garantizar contrataciones públicas sostenibles, transparentes y ajustadas al interés general.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/biblioteca-contratacion-publica/',
  },
  {
    imageUrl: '/repositorio/biblioteca-ordenanzas.png',
    description:
      'Explora y descarga decretos, acuerdos y resoluciones de cientos de municipios, con acceso abierto y colaborativo para impulsar gobiernos más transparentes, eficientes y conectados con su comunidad.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/biblioteca-de-ordenanzas-municipales/',
  },
];

export default function RepositorioLegalProPage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle('Videos tutoriales');
  }, [setTitle]);

  return (
    <div className="w-full p-4 md:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center mx-auto max-w-7xl">
        {cardData.map((card, index) => (
          <RepoCardPro
            key={index}
            imageUrl={card.imageUrl}
            description={card.description}
            buttonText={card.buttonText}
            linkHref={card.linkHref}
          />
        ))}
      </div>
    </div>
  );
}
