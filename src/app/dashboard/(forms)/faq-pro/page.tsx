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
              <strong>Resolución CGR N.° 01-00-0162</strong>.
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
      title: 'Tipos de cuentas y versiones',
      items: [
        {
          question: '¿Qué limitaciones tiene la versión express (gratuita)?',
          answer: (
            <span>
              La versión express es de <strong>&quot;sesión única&quot;</strong>
              . Permite generar un máximo de{' '}
              <strong>un (1) acta por cada rol disponible</strong> (1 para
              Saliente, 1 para Entrante y 1 para Máxima Autoridad). Importante:
              Si cierras el navegador antes de terminar, perderás los datos
              ingresados.
            </span>
          ),
        },
        {
          question: '¿Qué ventajas obtengo al pasar a la versión PRO?',
          answer: {
            intro:
              'La suscripción PRO es un centro de gestión integral que ofrece:',
            points: [
              <span key="0">
                <strong>Edición Ilimitada:</strong> Guarda borradores y edita
                tus actas cuantas veces quieras desde tu panel.
              </span>,
              <span key="1">
                <strong>Módulo de Compliance:</strong> Un reporte técnico en{' '}
                <strong>PDF</strong> que audita tu acta y te alerta sobre
                omisiones legales.
              </span>,
              <span key="2">
                <strong>Recuperación garantizada:</strong> Tus actas quedan
                guardadas en la nube. Si pierdes el correo, siempre podrás
                descargarlas de nuevo.
              </span>,
              <span key="3">
                <strong>Consultor IA:</strong> Chat 24/7 para resolver dudas
                sobre la normativa de la CGR.
              </span>,
            ],
          },
        },
        {
          question: '¿Qué pasa si pierdo el correo con el enlace de mi acta?',
          answer: {
            points: [
              <span key="0">
                <strong>En versión express:</strong> Por razones de seguridad y
                al ser una herramienta de sesión única,{' '}
                <strong>no podemos reenviar el acta</strong>. Si pierdes el
                correo, deberás cargar los datos nuevamente.
              </span>,
              <span key="1">
                <strong>En versión PRO:</strong> No hay riesgo. Tu acta
                permanece en tu panel de control durante toda la vigencia de tu
                suscripción.
              </span>,
            ],
          },
        },
        {
          question: '¿Es obligatorio pasar a la versión pro?',
          answer:
            'No. Puede utilizar la versión express según sus limitaciones. La versión pro es una opción para usuarios que necesitan generar múltiples actas, requieren almacenamiento o desean utilizar las funcionalidades avanzadas.',
        },
      ],
    },
    {
      sectionId: 'section-3',
      title: 'Pagos y suscripción PRO',
      items: [
        {
          question: '¿Cómo activo mi cuenta PRO?',
          answer:
            'El proceso es asistido vía WhatsApp. Tras enviar tu comprobante de pago (Pago Móvil, Zelle o transferencia), activamos tu cuenta manualmente.',
        },
        {
          question: '¿Cuánto tarda en activarse la cuenta?',
          answer:
            'El proceso puede tomar entre 24 y 48 horas hábiles tras la validación del pago.',
        },
        {
          question: '¿El pago es por una sola vez?',
          answer: (
            <span>
              No. La versión PRO funciona bajo un modelo de{' '}
              <strong>suscripción anual con renovación</strong>. Esto garantiza
              que tu historial de actas esté seguro y que tengas acceso a
              actualizaciones legales durante todo el año.
            </span>
          ),
        },
        {
          question: '¿Emiten factura fiscal?',
          answer: (
            <span>
              Sí. Somos <strong>Universitas Services C.A.</strong> y emitimos
              factura fiscal válida en Venezuela. Debes solicitarla al equipo de
              ventas al realizar tu pago.
            </span>
          ),
        },
        {
          question: '¿Tienen política de reembolso?',
          answer: (
            <span>
              Sí. Ofrecemos un reembolso del 50% si se solicita dentro de las
              primeras 24 horas tras el pago, siempre que no se haya generado
              ninguna acta ni se haya usado el módulo de Compliance, de acuerdo
              a lo establecido en nuestros {/* --- BOTÓN DE TÉRMINOS --- */}
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
      sectionId: 'section-4',
      title: 'Funcionalidades y uso',
      items: [
        {
          question:
            '¿En qué consisten las funciones de inteligencia artificial (IA)?',
          answer:
            'En la versión pro, la IA actúa como un asistente. Puede analizar la información para darle alertas proactivas (por ejemplo, sobre plazos) y sugerirle documentos de debida diligencia. También cuenta con un asesor virtual para responder dudas sobre el proceso.',
        },
        {
          question: '¿Cuánto tiempo guardan mi información?',
          answer: {
            points: [
              <span key="0">
                <strong>Express:</strong> Guardamos una copia interna por 90
                días para soporte técnico, luego se borra permanentemente.
              </span>,
              <span key="1">
                <strong>PRO:</strong> Tus datos están disponibles durante toda
                la suscripción. Si no renuevas, tienes un periodo de gracia de
                30 días para descargar todo antes del borrado definitivo.
              </span>,
            ],
          },
        },
        {
          question: '¿Puedo compartir mi cuenta o mi contraseña con un colega?',
          answer: (
            <span>
              No. Por razones de seguridad y para proteger la integridad de su
              información, las cuentas son estrictamente personales e
              intransferibles. Compartir sus credenciales está prohibido en los{' '}
              {/* --- BOTÓN DE TÉRMINOS (2) --- */}
              <button
                onClick={() => setIsTermsOpen(true)}
                className="text-primary/80 font-bold hover:underline bg-transparent border-0 cursor-pointer p-0 inline align-baseline"
                type="button"
              >
                términos y condiciones
              </button>
              .
            </span>
          ),
        },
        {
          question: '¿Quién es responsable de la veracidad de los datos?',
          answer: (
            <span>
              El usuario. De acuerdo con el{' '}
              <strong>Artículo 18 de la Resolución 162 de la CGR</strong>, la
              exactitud cualitativa y cuantitativa del acta es responsabilidad
              exclusiva del servidor público. La App facilita la estructura,
              pero no valida si la información declarada es real.
            </span>
          ),
        },
      ],
    },
    {
      sectionId: 'section-5',
      title: 'Datos y seguridad',
      items: [
        {
          question:
            '¿Quién es el dueño de la información que yo introduzco en la aplicación?',
          answer:
            'Usted. El usuario es en todo momento el propietario del contenido que se introduce. Nosotros solo tenemos una licencia limitada para procesar esa información y prestarle el servicio.',
        },
        {
          question:
            '¿Universitas Services C.A. revisa el contenido de mis actas?',
          answer:
            'No. Su información es privada. No verificamos, validamos ni revisamos la veracidad o legalidad del contenido que usted introduce. La responsabilidad sobre el contenido es exclusivamente suya.',
        },
        {
          question: '¿Qué pasa con mis documentos si elimino mi cuenta?',
          answer:
            'Si decide eliminar su cuenta, su perfil y acceso a la plataforma serán borrados. Sin embargo, usted conservará el acceso a los documentos que ya había generado, a través de los enlaces de Google Docs que le fueron enviados a su correo electrónico.',
        },
      ],
    },
    {
      sectionId: 'section-6',
      title: 'Soporte y contacto',
      items: [
        {
          question: '¿Cómo obtengo soporte técnico?',
          answer: (
            <span>
              A través del botón de WhatsApp en la App o escribiendo a{' '}
              <strong>contacto@universitas.legal</strong>. Atendemos de lunes a
              viernes en horario de oficina para problemas técnicos de acceso.
              El soporte no incluye redacción de actas ni interpretación de
              leyes.
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
              <AccordionContent className="p-6 pt-0">
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
