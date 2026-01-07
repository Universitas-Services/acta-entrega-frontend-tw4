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

// --- NUEVOS IMPORTS ---
import { LegalPopup } from '@/components/LegalPopup';
import { TermsContent } from '@/components/TermsContent';
import { PrivacyContent } from '@/components/PrivacyContent';

// Definición de tipos para manejar respuestas flexibles (Texto, JSX o Listas)
type FaqItem = {
  question: string;
  answer:
    | string
    | React.ReactNode
    | { intro?: string; points: (string | React.ReactNode)[] };
};

type FaqSection = {
  sectionId: string;
  title: string;
  items: FaqItem[];
};

export default function FaqPage() {
  const { setTitle } = useHeader();
  const [openSection, setOpenSection] = useState<string>('');

  // --- NUEVOS ESTADOS ---
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    setTitle('Preguntas frecuentes');
  }, [setTitle]);

  // --- DATOS MOVIDOS DENTRO DEL COMPONENTE ---
  const faqDataBySection: FaqSection[] = [
    {
      sectionId: 'section-1',
      title: 'Sobre la App y el servicio (general)',
      items: [
        {
          question: '¿Qué es "Acta de Entrega"?',
          answer: (
            <span>
              Es una herramienta digital diseñada para ayudar a los servidores
              públicos en Venezuela a generar actas de entrega de cargos, bienes
              y recursos. El sistema asegura que el documento cumpla con la
              estructura y los requisitos exigidos por la{' '}
              <strong>Resolución CGR N.º 01-00-0162</strong>.
            </span>
          ),
        },
        {
          question: '¿Para quién es esta aplicación?',
          answer:
            'Está dirigida a todos los servidores públicos dentro de la República Bolivariana de Venezuela que, por sus funciones, deban participar en un proceso de entrega y recepción de un cargo, ya sea en rol de servidor público saliente, entrante o como máxima autoridad de una institución, así como a sus equipos de apoyo (abogados, secretarios o asesores) que deban asesorar o apoyar en un proceso de entrega y recepción en la Administración Pública.',
        },
        {
          question:
            '¿Esta App sustituye el trabajo de la Unidad de Auditoría Interna?',
          answer:
            'No. La App es una herramienta de apoyo para el servidor público que tiene el deber legal de hacer la entrega. La Unidad de Auditoría Interna de tu organismo sigue siendo la encargada de verificar y recibir el acta física. La App te ayuda a llegar a ese momento con la documentación debidamente estructurada.',
        },
        {
          question: '¿Necesito ser abogado para usarla?',
          answer:
            'No. La App está diseñada para ser intuitiva y te guía paso a paso. Para dudas de normativas específicas, en esta versión te incluimos un Consultor IA que te ayuda a entender los requisitos legales.',
        },
        {
          question: '¿Puedo usar la App desde mi teléfono?',
          answer:
            'Sí. La plataforma es totalmente responsiva y funciona en navegadores de teléfonos móviles, tabletas y computadoras o laptops.',
        },
        {
          question: '¿Mis datos están seguros en la nube?',
          answer: (
            <span>
              Sí. Usamos proveedores de clase mundial (Google Cloud y Render).
              Tus claves están encriptadas. Pero recuerda que eres el primer
              guardián de tu seguridad: no compartas tu contraseña. Puedes
              ampliar esta información consultando nuestras{' '}
              {/* --- BOTÓN DE POLÍTICAS --- */}
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="text-primary font-bold hover:underline bg-transparent border-0 cursor-pointer p-0 inline align-baseline"
                type="button"
              >
                Políticas de privacidad.
              </button>
            </span>
          ),
        },
        {
          question: '¿Es una herramienta oficial del gobierno?',
          answer: (
            <span>
              No. Es una plataforma privada desarrollada por{' '}
              <strong>Universitas Services C.A.</strong> Actúa como una
              herramienta de apoyo tecnológico independiente para facilitar el
              cumplimiento de las normativas de control fiscal vigentes.
            </span>
          ),
        },
        {
          question: '¿La aplicación ofrece asesoría legal?',
          answer: (
            <span>
              La plataforma es una herramienta técnica. Si bien la versión PRO
              incluye un <strong>Consultor IA</strong> para dudas normativas
              rápidas, la App no sustituye el juicio de un profesional del
              derecho para estrategias legales o defensa en procedimientos
              administrativos.
            </span>
          ),
        },
      ],
    },
    {
      sectionId: 'section-2',
      title: 'Sobre la versión PRO (suscripción anual)',
      items: [
        {
          question: '¿Qué ventajas reales tiene la suscripción PRO?',
          answer: {
            intro: 'Obtienes acceso ilimitado a herramientas avanzadas:',
            points: [
              <span key="0">
                <strong>Edición ilimitada:</strong> Guarda borradores y edita
                tus actas en el panel de actas cuantas veces quieras.
              </span>,
              <span key="1">
                <strong>Módulo de Compliance:</strong> Un reporte en{' '}
                <strong>PDF</strong> que te alerta sobre omisiones o fallas
                según la ley.
              </span>,
              <span key="2">
                <strong>Consultor IA:</strong> Chat inteligente para resolver
                dudas generales sobre el proceso de la elaboración de acta de
                entrega basados en la Resolución N° 01-000162 de la CGR.
              </span>,
              <span key="3">
                <strong>Panel de actas:</strong> Historial sin límites de todas
                tus actas guardadas, elaboradas, descargadas y entregadas.
              </span>,
            ],
          },
        },
        {
          question: '¿El "Consultor IA" es un abogado real?',
          answer:
            'No. Es una inteligencia artificial entrenada con leyes venezolanas. Responde preguntas de texto sobre normas y requisitos pero no ofrece consejos de estrategia legal ni representación judicial. Si requiere de un especialista puede contratar una asesoría personalizada con nuestro equipo de expertos en la materia.',
        },
        {
          question:
            '¿La versión PRO garantiza que no tendré problemas con la Contraloría?',
          answer:
            'No garantiza que el servidor público no tenga problemas con la Contraloría ya que no valida, audita ni se hace responsable por la veracidad, integridad o licitud de la información suministrada por el Usuario. La App sólo garantiza que el formato y la estructura cumplen con la normativa.',
        },
        {
          question: '¿Qué pasa si se vence mi suscripción anual?',
          answer:
            'Tienes un periodo de gracia de 30 días para descargar tus documentos. Luego de ese tiempo, la información será eliminada de nuestros servidores por seguridad.',
        },
        {
          question: '¿Tienen política de reembolso?',
          answer: (
            <span>
              Sí, protegemos tu inversión. Ofrecemos un{' '}
              <strong>reembolso parcial del 50%</strong> si se solicita por
              escrito dentro de las primeras 24 horas posteriores al pago,
              siempre y cuando el usuario no haya utilizado la herramienta para
              generar actas ni haya hecho uso del módulo de Compliance. Una vez
              consumido el servicio principal, no aplican reembolsos. Puedes
              ampliar esta información consultando nuestros{' '}
              {/* --- BOTÓN DE TÉRMINOS --- */}
              <button
                onClick={() => setIsTermsOpen(true)}
                className="text-primary font-bold hover:underline bg-transparent border-0 cursor-pointer p-0 inline align-baseline"
                type="button"
              >
                Términos y condiciones
              </button>
              .
            </span>
          ),
        },
      ],
    },
    {
      sectionId: 'section-3',
      title: 'Soporte y ayuda',
      items: [
        {
          question: 'Tengo un problema técnico ¿a quién acudo?',
          answer: (
            <span>
              Escríbenos por WhatsApp o al correo{' '}
              <strong>contacto@universitas.legal</strong> de lunes a viernes en
              horario de oficina.
            </span>
          ),
        },
        {
          question: '¿El soporte técnico me ayuda con el contenido del acta?',
          answer: (
            <span>
              No. El soporte técnico solo resuelve fallas de la plataforma. Para
              dudas sobre el contenido legal, utiliza el{' '}
              <strong>Consultor IA</strong> o solicita una{' '}
              <strong>asesoría personalizada</strong> con uno de nuestros
              expertos a través de WhatsApp o al correo{' '}
              <strong>contacto@universitas.legal</strong>.
            </span>
          ),
        },
      ],
    },
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto pb-24">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4"
          onValueChange={(value) => setOpenSection(value)}
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
              <AccordionContent className="p-6 pt-0 pb-0">
                <div className="space-y-4">
                  {section.items.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-black">
                        {item.question}
                      </h4>
                      <div className="mt-2 text-muted-foreground leading-relaxed">
                        {/* Lógica de renderizado condicional segura */}
                        {item.answer &&
                        typeof item.answer === 'object' &&
                        'points' in item.answer ? (
                          // Renderizar objeto con lista de puntos
                          <div className="space-y-2">
                            {item.answer.intro && <p>{item.answer.intro}</p>}
                            <ul className="list-disc space-y-2 pl-5">
                              {item.answer.points.map((point, pointIndex) => (
                                <li key={pointIndex}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          // Renderizar string o ReactNode (JSX)
                          <div>{item.answer as React.ReactNode}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  <br />
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

      {/* --- POPUPS AGREGADOS AL FINAL --- */}
      <LegalPopup
        isOpen={isTermsOpen}
        onOpenChange={setIsTermsOpen}
        title="Términos y Condiciones"
      >
        <TermsContent />
      </LegalPopup>

      <LegalPopup
        isOpen={isPrivacyOpen}
        onOpenChange={setIsPrivacyOpen}
        title="Política de Privacidad"
      >
        <PrivacyContent />
      </LegalPopup>
    </>
  );
}
