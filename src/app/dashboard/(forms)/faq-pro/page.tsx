'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/HeaderContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { IoLogoWhatsapp } from 'react-icons/io';
import { cn } from '@/lib/utils';

const faqDataBySection = [
  {
    sectionId: 'section-1',
    title: 'Sobre la plataforma y el servicio',
    items: [
      {
        question: '¿Qué es "Acta de Entrega"?',
        answer:
          'Es una solución digital avanzada diseñada para asistir a los servidores públicos en Venezuela en la generación de actas de entrega de cargos, bienes y recursos. El sistema asegura que el documento generado cumpla estrictamente con la estructura y los requisitos exigidos por la Resolución CGR N.º 01-00-0162 de fecha 27-07-2009.',
      },
      {
        question: '¿Para quién es esta aplicación?',
        answer:
          'Está dirigida a todos los servidores públicos de la República Bolivariana de Venezuela que deban participar en un proceso de entrega y recepción (salientes, entrantes o máximas autoridades), así como a sus equipos de apoyo (abogados, secretarios o asesores) que gestionen procesos de rendición de cuentas en la Administración Pública.',
      },
      {
        question:
          '¿Esta App sustituye el trabajo de la Unidad de Auditoría Interna (UAI)?',
        answer:
          'No. La plataforma es una herramienta de apoyo técnico para el servidor público, quien tiene el deber legal de elaborar el acta. La Unidad de Auditoría Interna de cada organismo sigue siendo la encargada de verificar y recibir el documento físico. La App garantiza que usted llegue a ese momento con la documentación debidamente estructurada y validada.',
      },
      {
        question: '¿Necesito ser abogado para usarla?',
        answer:
          'No. La interfaz es intuitiva y guía al usuario paso a paso. Para dudas sobre normativas específicas, la plataforma incluye un Consultor IA que ayuda a comprender los requisitos legales y técnicos en tiempo real.',
      },
      {
        question: '¿Puedo usar la App desde mi teléfono?',
        answer:
          'Sí. La plataforma es totalmente responsiva y funciona de manera óptima en navegadores de teléfonos móviles, tabletas, laptops y computadoras de escritorio.',
      },
      {
        question: '¿Mis datos están seguros?',
        answer:
          'Sí. Utilizamos infraestructura de clase mundial con altos estándares de seguridad. Todas las credenciales están encriptadas. Como medida de seguridad adicional, le recomendamos no compartir su contraseña con terceros.',
      },
      {
        question: '¿Es una herramienta oficial del gobierno?',
        answer:
          'No. Es una plataforma privada de apoyo tecnológico independiente. Su función es facilitar al servidor público el cumplimiento de las normativas de control fiscal vigentes mediante el uso de herramientas digitales de precisión.',
      },
      {
        question: '¿La aplicación ofrece asesoría legal?',
        answer:
          'La plataforma es una herramienta de soporte técnico y normativo. El Consultor IA resuelve dudas sobre la estructura y requisitos de la resolución, pero la herramienta no sustituye el juicio de un profesional del derecho para estrategias de defensa en procedimientos administrativos complejos.',
      },
    ],
  },
  {
    sectionId: 'section-2',
    title: 'Funcionalidades de la plataforma',
    items: [
      {
        question: '¿Qué herramientas incluye mi acceso a la plataforma?',
        answer: {
          intro:
            'Su acceso le otorga herramientas integrales para una gestión completa:',
          points: [
            'Edición dinámica: Guarde borradores y edite sus actas en su panel personal cuantas veces sea necesario antes de la firma.',
            'Módulo de Compliance: Genera un reporte técnico en PDF que le alerta sobre posibles omisiones o fallas según la normativa vigente.',
            'Consultor IA: Chat inteligente entrenado para resolver dudas sobre la elaboración del acta basándose en la Resolución N° 01-00-0162 de la CGR.',
            'Panel de actas: Historial completo de todas sus actas guardadas, elaboradas, descargadas y el registro de sus entregas.',
          ],
        },
      },
      {
        question: '¿El "Consultor IA" es un abogado real?',
        answer:
          'No. Es una inteligencia artificial especializada en el marco jurídico venezolano. Responde preguntas técnicas sobre normas y requisitos del acta de entrega, facilitando la autogestión del usuario.',
      },
      {
        question:
          '¿La plataforma garantiza que no tendré problemas con la Contraloría?',
        answer:
          'La plataforma garantiza que el formato y la estructura del documento cumplen con la normativa de la CGR. Sin embargo, no valida ni se hace responsable por la veracidad o integridad de la información suministrada por el usuario, siendo esta última responsabilidad exclusiva del servidor público según la ley.',
      },
    ],
  },
  {
    sectionId: 'section-3',
    title: 'Soporte y ayuda',
    items: [
      {
        question: 'Tengo un problema técnico, ¿a quién acudo?',
        answer:
          'Puede contactarnos a través de nuestros canales de atención técnica por WhatsApp o correo electrónico de lunes a viernes en horario de oficina.',
      },
      {
        question: '¿El soporte técnico me ayuda con el contenido del acta?',
        answer:
          'El soporte técnico se limita exclusivamente a resolver fallas de funcionamiento de la plataforma. Para dudas sobre el contenido legal o normativo, debe utilizar el Consultor IA integrado en su panel.',
      },
    ],
  },
];

export default function FaqPage() {
  const { setTitle } = useHeader();
  const [openSection, setOpenSection] = useState<string>('');

  useEffect(() => {
    setTitle('Preguntas frecuentes');
  }, [setTitle]);

  return (
    <>
      <div className="max-w-4xl mx-auto pb-24">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4"
          value={openSection}
          onValueChange={setOpenSection}
        >
          {faqDataBySection.map((section) => (
            <AccordionItem
              key={section.sectionId}
              value={section.sectionId}
              className={cn(
                'border rounded-lg bg-card shadow-sm',
                openSection === section.sectionId &&
                  'shadow-lg border-primary transition-all'
              )}
            >
              <AccordionTrigger
                className={cn(
                  'cursor-pointer p-4 text-lg font-semibold hover:no-underline ',
                  openSection === section.sectionId && 'text-primary'
                )}
              >
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <div className="space-y-6">
                  {section.items.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-black">
                        {item.question}
                      </h4>
                      <div className="mt-2 text-muted-foreground">
                        {typeof item.answer === 'string' ? (
                          <p>{item.answer}</p>
                        ) : (
                          <div className="space-y-2">
                            {'intro' in item.answer && item.answer.intro && (
                              <p>{item.answer.intro}</p>
                            )}
                            <ul className="list-disc space-y-1 pl-5">
                              {item.answer.points.map((point, pointIndex) => (
                                <li key={pointIndex}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <a
        href="https://api.whatsapp.com/send?phone=+584125253023&text=Hola,%20necesito%20ayuda%20en%20la%20APP%20de%20Actas%20de%20Entrega"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 text-green-500 hover:text-green-600 transition-transform hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <IoLogoWhatsapp className="h-14 w-14 drop-shadow-lg" />
      </a>
    </>
  );
}
