'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { RepoCard } from '@/components/RepoCard';

const cardData = [
  {
    imageUrl: '/conocenos/Jornadas-control-fiscal.png',
    description:
      'Transforma tu carrera y domina la vanguardia de la gestión pública con las Jornadas de Control Fiscal. Universitas Academy te brinda acceso exclusivo a los expertos más influyentes del sector, dándote las herramientas y estrategias definitivas para liderar con integridad y eficacia en el complejo entorno actual.',
    buttonText: 'Inscríbete aquí',
    linkHref: 'https://universitas.academy/cursos/jornadas-de-control-fiscal/',
  },
  {
    imageUrl: '/conocenos/adquiere-pro.png',
    description:
      'Asegura que tu acta sea impecable. La versión Pro te permite detallar todos los anexos cruciales para tu protección legal. ¡Actualízate ahora y obtén la máxima tranquilidad!',
    buttonText: 'Adquirir PRO aquí',
    linkHref: 'https://universitas.myflodesk.com/ae-pro',
  },
  {
    imageUrl: '/repositorio/imagen curso para APP.png',
    description:
      'Este programa te equipará con las competencias esenciales para la elaboración y gestión de Actas de Entrega. Profundiza en el marco jurídico y los procedimientos clave, asegurando la transparencia y mitigación de riesgos en la administración pública.',
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
      'Universitas Academy te ofrece acceso directo a los expertos más destacados, brindándote las estrategias y conocimientos de vanguardia para liderar con total seguridad y transparencia en el complejo escenario de las compras públicas.',
    buttonText: 'Ingrese aquí',
    linkHref:
      'https://universitas.academy/cursos/jornadas-contrataciones-publicas/',
  },
  {
    imageUrl: '/conocenos/card-agora.png',
    description:
      'Ágora es un espacio diseñado para que los profesionales puedan publicar sus artículos de investigación o de opinión y noticias. Nace de nuestras ganas de impulsar el crecimiento profesional de los miembros de nuestra comunidad y la conexión entre los mismos.',
    buttonText: 'Ingrese aquí',
    linkHref:
      'https://agora.universitasfundacion.com/category/universitas-legal/',
  },
];

export default function RepositorioLegalPage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle('Conócenos');
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
