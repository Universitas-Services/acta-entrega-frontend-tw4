'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { RepoCard } from '@/components/RepoCard';

const cardData = [
  {
    imageUrl: '/repositorio/Consideraciones-generales.png',
    description:
      'Para garantizar un proceso de entrega-recepción transparente, te invitamos a leer detenidamente las siguientes consideraciones',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/consideraciones-generales/',
  },
  {
    imageUrl: '/repositorio/descargar-resolucion.png',
    description: 'Descarga la Resolución CGR N°01-000162 de fecha 27-07-2009',
    buttonText: 'Descarga aquí',
    linkHref:
      'https://drive.google.com/file/d/1L5y59yCxXiOfbDyuuU3V_5RfT1qouzI-/view',
  },
  {
    imageUrl: '/repositorio/imagen curso para APP.png',
    description:
      'Este programa te equipará con las competencias esenciales para la elaboración y gestión de Actas de Entrega. Profundiza en el marco jurídico y los procedimientos clave, asegurando la transparencia y mitigación de riesgos en la administración pública.',
    buttonText: 'Más información',
    linkHref: 'https://universitas.academy/cursos/actas-de-entrega/',
  },
  {
    imageUrl: '/repositorio/control-fiscal.png',
    description:
      'Impulsa la transparencia y eficiencia institucional con la Biblioteca Legal de Universitas. Accede a un compendio normativo completo, doctrina administrativa y jurisprudencia esencial para fortalecer el control fiscal en todos los niveles del sector público.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/control-fiscal/',
  },
  {
    imageUrl: '/repositorio/biblioteca-contrataciones.png',
    description:
      'Optimiza tus procesos de contratación estatal con la Biblioteca Legal de Universitas. Accede a normativa especializada, doctrina administrativa y jurisprudencia clave para garantizar contrataciones públicas sostenibles, transparentes y ajustadas al interés general.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/contrataciones-publicas/',
  },
  {
    imageUrl: '/repositorio/biblioteca-ordenanzas.png',
    description:
      'Fortalece la gestión local con la Biblioteca de Ordenanzas Municipales de Universitas. Explora y descarga decretos, acuerdos y resoluciones de cientos de municipios, con acceso abierto y colaborativo para impulsar gobiernos más transparentes, eficientes y conectados con su comunidad',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/biblioteca-de-ordenanzas-municipales/',
  },
];

export default function RepositorioLegalPage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle('Repositorio legal');
  }, [setTitle]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {cardData.map((card, index) => (
        <RepoCard
          key={index}
          imageUrl={card.imageUrl}
          description={card.description}
          buttonText={card.buttonText}
          linkHref={card.linkHref}
          priority={index < 6}
        />
      ))}
    </div>
  );
}
