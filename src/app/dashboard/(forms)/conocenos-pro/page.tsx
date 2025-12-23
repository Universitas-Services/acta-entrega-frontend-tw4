'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { RepoCardPro } from '@/components/RepoCardPro';

const cardData = [
  {
    imageUrl: '/conocenos/Jornadas-control-fiscal.png',
    description:
      'Transforma tu carrera y domina la vanguardia de la gestión pública con las Jornadas de Control Fiscal. Universitas Academy te brinda acceso exclusivo a los expertos más influyentes del sector.',
    buttonText: 'Ingresa aquí',
    linkHref: 'https://universitas.academy/cursos/jornadas-de-control-fiscal/',
  },
  {
    imageUrl: '/conocenos-pro/funcionario-publico.jpg',
    description:
      'Domina el marco legal que rige tu carrera. Un curso esencial sobre los derechos, deberes y responsabilidades de todo servidor público, desde el ingreso hasta el retiro.',
    buttonText: 'Ingresa aquí',
    linkHref: 'https://universitas.academy/cursos/el-funcionario-publico/',
  },
  {
    imageUrl: '/repositorio/imagen curso para APP.png',
    description:
      'Este programa te equipará con las competencias esenciales para la elaboración y gestión de Actas de Entrega.',
    buttonText: 'Más información',
    linkHref: 'https://universitas.academy/cursos/actas-de-entrega/',
  },
  {
    imageUrl: '/conocenos/Universitas-Academy.png',
    description:
      'Eleva tu perfil profesional con Universitas Academy, la plataforma de formación en línea que te conecta con el conocimiento de vanguardia en derecho y administración pública.',
    buttonText: 'Más información',
    linkHref: 'https://universitas.academy/',
  },
  {
    imageUrl: '/conocenos/Jornadas-de-contrataciones-públicas.png',
    description:
      'Actualízate con los mayores expertos del país. Accede a las ponencias y debates de nuestras más recientes jornadas sobre los retos actuales de la contratación pública.',
    buttonText: 'Inscríbete aquí',
    linkHref:
      'https://universitas.academy/cursos/jornadas-contrataciones-publicas/',
  },
  {
    imageUrl: '/conocenos/card-agora.png',
    description:
      'Ágora es un espacio diseñado para que los profesionales puedan publicar sus artículos de investigación o de opinión y noticias.',
    buttonText: 'Ingresa aquí',
    linkHref:
      'https://agora.universitasfundacion.com/category/universitas-legal/',
  },
  {
    imageUrl:
      '/conocenos-pro/Regimen-disciplinario-del-funcionario-publico.png',
    description:
      'Conoce a fondo el procedimiento de amonestación y destitución. Un curso clave para comprender las faltas, sanciones y protegerte de riesgos disciplinarios.',
    buttonText: 'Inscríbete aquí',
    linkHref:
      'https://universitas.academy/cursos/regimen-disciplinario-del-funcionario-publico/ ',
  },
  {
    imageUrl: '/conocenos-pro/Control-gestion-publica.png',
    description:
      'Fortalece la gestión de tu entidad. Profundiza en los sistemas de control interno, la responsabilidad administrativa y las herramientas para una administración eficiente y transparente.',
    buttonText: 'Inscríbete aquí',
    linkHref:
      'https://universitas.academy/cursos/control-en-la-gestion-publica/ ',
  },
  {
    imageUrl: '/conocenos-pro/Fundamentos-contratacion-publica.png',
    description:
      'Evita errores costosos en los procesos de compra del Estado. Domina las leyes, modalidades y principios esenciales de la contratación pública en Venezuela.',
    buttonText: 'Inscríbete aquí',
    linkHref:
      'https://universitas.academy/cursos/fundamentos-de-la-contratacion-publica/ ',
  },
];

export default function RepositorioLegalProPage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle('Conócenos');
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
