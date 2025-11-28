'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { RepoCardPro } from '@/components/RepoCardPro';

// Data
const cardData = [
  {
    imageUrl: '/repositorio/Consideraciones-generales.png',
    description:
      'Para garantizar un proceso de entrega-recepción transparente, te invitamos a leer detenidamente las siguientes consideraciones.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/consideraciones-generales/',
  },
  {
    imageUrl: '/repositorio/descargar-resolucion.png',
    description: 'Descarga la Resolución CGR N°01-000162 de fecha 27-07-2009.',
    buttonText: 'Descarga aquí',
    linkHref:
      'https://drive.google.com/file/d/1L5y59yCxXiOfbDyuuU3V_5RfT1qouzI-/view',
  },
  {
    imageUrl: '/repositorio/imagen curso para APP.png',
    description:
      'Programa esencial para la elaboración y gestión de Actas de Entrega. Profundiza en el marco jurídico clave.',
    buttonText: 'Más información',
    linkHref: 'https://universitas.academy/cursos/actas-de-entrega/',
  },
  {
    imageUrl: '/repositorio/control-fiscal.png',
    description:
      'Fortalece tus competencias en auditoría con las Jornadas de Control Fiscal. Ponencias y material exclusivo.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/jornadas-de-control-fiscal/',
  },
  {
    imageUrl: '/repositorio/biblioteca-contrataciones.png',
    description:
      'Optimiza tus procesos con la Biblioteca Legal de Universitas. Normativa especializada y jurisprudencia.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/biblioteca-contratacion-publica/',
  },
  {
    imageUrl: '/repositorio/biblioteca-ordenanzas.png',
    description:
      'Biblioteca de Ordenanzas Municipales. Explora decretos y resoluciones de cientos de municipios.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/biblioteca-de-ordenanzas-municipales/',
  },
  {
    imageUrl: '/repositorio/control-fiscal.png',
    description:
      'Fortalece tus competencias en auditoría con las Jornadas de Control Fiscal. Ponencias y material exclusivo.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/jornadas-de-control-fiscal/',
  },
  {
    imageUrl: '/repositorio/biblioteca-contrataciones.png',
    description:
      'Optimiza tus procesos con la Biblioteca Legal de Universitas. Normativa especializada y jurisprudencia.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/biblioteca-contratacion-publica/',
  },
  {
    imageUrl: '/repositorio/biblioteca-ordenanzas.png',
    description:
      'Biblioteca de Ordenanzas Municipales. Explora decretos y resoluciones de cientos de municipios.',
    buttonText: 'Ingrese aquí',
    linkHref: 'https://universitas.legal/biblioteca-de-ordenanzas-municipales/',
  },
];

export default function RepositorioLegalProPage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle('Repositorio legal');
  }, [setTitle]);

  return (
    /* ------------------------------------------------------------
       CAMBIO APLICADO AQUÍ: 
       Se agregó 'pb-24' (Padding Bottom grande) al contenedor principal.
       Esto crea un espacio vacío al final de la página para que las
       últimas tarjetas no queden pegadas al borde inferior del navegador.
       ------------------------------------------------------------
    */
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
