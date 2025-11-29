'use client';

import { useHeader } from '@/context/HeaderContext';
import { useEffect } from 'react';
import { CardPro } from '@/components/CardAsistencia';
import { BsCollectionPlayFill } from 'react-icons/bs';
import { FaRobot } from 'react-icons/fa';
import { BsFillQuestionSquareFill } from 'react-icons/bs';

const proCardsData = [
  {
    id: 'preguntas-frecuentes',
    title: 'Preguntas Frecuentes',
    description:
      'Resuelve tus dudas sobre el funcionamiento de la aplicación, el proceso de gestión y los pasos clave que debes seguir. Encuentra respuestas rápidas y útiles para optimizar tu ruta.',
    href: '/dashboard/faq-pro',
    icon: (
      <BsFillQuestionSquareFill className="h-13 w-13 text-icon-asistencia" />
    ),
  },
  {
    id: 'consultor-ia',
    title: 'Consultor IA',
    description:
      'Resuelve tus dudas al instante. Nuestro Asesor  utiliza inteligencia artificial para analizar tu caso y responder tus preguntas sobre Actas de Entrega y normativas. Además, un agente experto revisará la consulta para entregarte un reporte con observaciones profesionales.',
    href: '/dashboard/consultoria',
    icon: <FaRobot className="h-13 w-13 text-icon-asistencia" />,
  },
  {
    id: 'video-tutoriales',
    title: 'Video - tutoriales',
    description:
      '¿Necesitas ayuda? Resuelve cualquier duda de la aplicación viendo nuestros videos explicativos. Guías visuales detalladas para que configures, uses y domines cada herramienta del sistema a tu propio ritmo.',
    href: '/dashboard/videos-tutoriales',
    icon: <BsCollectionPlayFill className="h-13 w-13 text-icon-asistencia" />,
  },
];

export default function ActasProDashboardPage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle('Asistencia al Usuario');
  }, [setTitle]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {proCardsData.map((card) => (
        <CardPro
          key={card.id}
          title={card.title}
          description={card.description}
          href={card.href}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
