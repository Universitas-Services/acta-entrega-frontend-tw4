'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area'; // Opcional si tienes ScrollArea, si no, usaremos div nativo
import { AlertCircle, Bot, CheckCircle } from 'lucide-react'; // Iconos sugeridos
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

interface ComplianceObservationSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void; // Función para cerrar manualmente
  actaId: string;
  numeroCompliance: string;
  observaciones?: string | null;
  isLoading: boolean; // Controla el Spinner
}

export function ComplianceObservationSheet({
  isOpen,
  onClose,
  onOpenChange,
  numeroCompliance,
  observaciones,
  isLoading,
}: ComplianceObservationSheetProps) {
  // Función auxiliar para renderizar el contenido de las observaciones
  const renderContent = () => {
    // 1. Caso: No hay data y no está cargando
    if (!observaciones && !isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 text-muted-foreground opacity-60">
          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-sm max-w-xs px-4">
            Aún no hay observaciones generadas para esta acta.
            <br />
            <span className="text-xs italic">
              El análisis IA se ejecuta automáticamente tras guardar. Intente
              recargar en unos minutos.
            </span>
          </p>
        </div>
      );
    }

    // 2. Caso: Data es un texto simple (String)
    if (observaciones) {
      return (
        <div className="text-sm leading-relaxed text-gray-700 space-y-4 whitespace-pre-line">
          {observaciones}
        </div>
      );
    }

    return null;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[600px] flex flex-col h-full bg-white shadow-xl border-l">
        {/* HEADER */}
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Bot className="w-5 h-5" />
            <SheetTitle className="text-lg font-bold">
              Análisis de observaciones
            </SheetTitle>
          </div>
          <SheetDescription className="text-sm text-muted-foreground flex items-center justify-between">
            <span>
              Acta ID:{' '}
              <span className="font-mono font-medium text-foreground">
                #{numeroCompliance}
              </span>
            </span>
            {isLoading && (
              <Badge
                variant="outline"
                className="animate-pulse border-blue-200 text-blue-600 bg-blue-50"
              >
                Procesando
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>

        {/* CONTENIDO PRINCIPAL CON SCROLL */}
        <ScrollArea className="flex-1 -mx-6 px-6 py-6">
          {isLoading ? (
            // ESTADO DE CARGA (Spinner)
            <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
              <Spinner className="h-10 w-10 text-primary" />
              <div className="text-center space-y-1">
                <p className="font-medium text-gray-900">
                  Cargando observaciones...
                </p>
              </div>
            </div>
          ) : (
            // CONTENIDO REAL
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {observaciones && (
                <div className="mb-4 flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                  <CheckCircle className="w-3 h-3" />
                  Análisis completado
                </div>
              )}
              {renderContent()}
            </div>
          )}
        </ScrollArea>

        {/* FOOTER (Opcional, para acciones extras) */}
        {observaciones && !isLoading && (
          <div className="pt-4 border-t mt-auto">
            <p className="text-[10px] text-center text-muted-foreground">
              Este análisis fue generado por Inteligencia Artificial y debe ser
              verificado por un experto legal.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
