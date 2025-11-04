'use client';

import { useHeader } from '@/context/HeaderContext';
import { useEffect } from 'react';
import { CardPro } from '@/components/Card-pro';
import { HiDocumentArrowUp, HiDocumentArrowDown } from 'react-icons/hi2';
import { SiSpringsecurity } from 'react-icons/si';

const proCardsData = [
  {
    id: 'elaboracion',
    title: 'Acta de entrega del servidor público SALIENTE',
    description:
      'Inicia aquí el proceso para documentar la transferencia de tu cargo, asegurando un cierre de gestión ordenado y conforme a la normativa.',
    href: '/dashboard/actas-pro/saliente-pro',
    icon: <HiDocumentArrowUp className="h-10 w-10 text-primary" />,
  },
  {
    id: 'compliance',
    title: 'Acta de entrega del servidor público ENTRANTE',
    description:
      'Comienza a elaborar el acta para recibir tu nuevo cargo. Registra el estado de la dependencia y establece un punto de partida claro para tu gestión.',
    href: '/dashboard/actas-pro/entrante-pro',
    icon: <HiDocumentArrowDown className="h-10 w-10 text-primary" />,
  },
  {
    id: 'ia',
    title: 'Acta de entrega MÁXIMA AUTORIDAD',
    description:
      'Utiliza esta opción para procesos de entrega sin servidor público designado, es decir actúes como el servidor público designado para el procedimiento.',
    href: '/dashboard/actas-pro/ma-pro',
    icon: <SiSpringsecurity className="h-10 w-10 text-primary" />,
  },
];

export default function ActasProDashboardPage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle('Elaboración de Actas de Entrega');
  }, [setTitle]);

  return (
    // Esta estructura está perfecta
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
