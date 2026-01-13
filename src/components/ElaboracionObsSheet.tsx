'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AiOutlineEye } from 'react-icons/ai';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  getObservacionesElaboracion,
  analyzeActa,
  regenerarObservaciones,
  type ObservacionElaboracion,
} from '@/services/actasService';
import { toast } from 'sonner';

interface ElaboracionObsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  actaId: string;
  numeroActa: string;
  onStartGeneration?: () => void;
  tieneObservaciones?: boolean;
}

export function ElaboracionObsSheet({
  isOpen,
  onClose,
  actaId,
  numeroActa,
  onStartGeneration,
  tieneObservaciones,
}: ElaboracionObsSheetProps) {
  const [observaciones, setObservaciones] =
    useState<ObservacionElaboracion | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar observaciones al abrir el Sheet
  useEffect(() => {
    if (!isOpen) return;

    const loadObservaciones = async () => {
      // Si tieneObservaciones es FALSE, NO ejecutar GET
      if (tieneObservaciones === false) {
        setObservaciones(null);
        setIsLoading(false);
        return;
      }

      // Si tieneObservaciones es TRUE, ejecutar GET normalmente
      setIsLoading(true);
      try {
        const data = await getObservacionesElaboracion(actaId);
        setObservaciones(data);
      } catch (error) {
        // No hay observaciones aún o error
        setObservaciones(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadObservaciones();
  }, [isOpen, actaId, tieneObservaciones]);

  // Generar observaciones
  const handleGenerate = () => {
    // Cerrar Sheet
    onClose();

    // Mostrar Toast
    toast.success(
      'Generación iniciada. Te notificaremos cuando esté lista (2-5 min).'
    );

    // Cambiar badge a amarillo (generando)
    if (onStartGeneration) onStartGeneration();

    // Ejecutar generación en segundo plano (sin bloquear)
    analyzeActa(actaId).catch((error) => {
      toast.error('Error al iniciar generación de observaciones');
    });
  };

  // Regenerar observaciones
  const handleRegenerate = () => {
    // Cerrar Sheet
    onClose();

    // Mostrar Toast
    toast.success(
      'Regeneración iniciada. Te notificaremos cuando esté lista (2-5 min).'
    );

    // Cambiar badge a amarillo (generando)
    if (onStartGeneration) onStartGeneration();

    // Ejecutar regeneración en segundo plano (sin bloquear)
    regenerarObservaciones(actaId).catch((error) => {
      toast.error('Error al regenerar observaciones');
    });
  };

  // Renderizar contenido según estado
  const renderContent = () => {
    // Estado: Sin observaciones
    if (!observaciones && !isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
            <BsExclamationCircle className="w-10 h-10 text-gray-400" />
          </div>
          <div className="space-y-2 max-w-xs px-4">
            <p className="text-sm text-muted-foreground">
              Esta acta está lista para generar observaciones.
            </p>
            <Button onClick={handleGenerate} className="mt-4 cursor-pointer">
              Generar Observaciones
            </Button>
          </div>
        </div>
      );
    }

    // Estado: Acta perfecta (observaciones existe pero analisis está vacío)
    if (
      observaciones &&
      observaciones.analisis &&
      observaciones.analisis.length === 0
    ) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <BsCheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <div className="space-y-2 max-w-xs px-4">
            <p className="text-lg font-semibold text-green-700">
              ¡Acta Perfecta!
            </p>
            <p className="text-sm text-muted-foreground">
              Su acta está perfecta, por lo que no tiene observaciones.
            </p>
          </div>
        </div>
      );
    }

    // Estado: Con observaciones
    if (
      observaciones &&
      observaciones.analisis &&
      observaciones.analisis.length > 0
    ) {
      return (
        <div className="space-y-4">
          {/* Header con total de hallazgos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900">
              Total de hallazgos: {observaciones.totalHallazgos}
            </p>
          </div>

          {/* Renderizar cada observación */}
          {observaciones.analisis.map((obs, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Criterio */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Criterio
                </p>
                <p className="text-sm text-gray-800 wrap-break-word">
                  {obs.criterio}
                </p>
              </div>

              {/* Pregunta */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Pregunta
                </p>
                <p className="text-sm text-gray-800 wrap-break-words">
                  {obs.pregunta}
                </p>
              </div>

              {/* Condición */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Condición
                </p>
                <p className="text-sm text-gray-800 wrap-break-words">
                  {obs.condicion}
                </p>
              </div>

              {/* Observación Legal */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Observación Legal
                </p>
                <p className="text-sm text-gray-800 wrap-break-words whitespace-pre-wrap">
                  {obs.observacion_legal}
                </p>
              </div>

              {/* Respuesta y Dato Faltante */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Respuesta
                  </p>
                  <Badge
                    variant={
                      obs.respuesta === 'N/A' ? 'secondary' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {obs.respuesta}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-100 sm:w-150 flex flex-col h-full bg-white shadow-xl border-l">
        <SheetHeader className="pb-4 border-b space-y-3 shrink-0">
          {/* Título */}
          <div className="flex items-center gap-2 text-primary">
            <AiOutlineEye className="w-5 h-5" />
            <SheetTitle className="text-lg font-bold">
              Observaciones de Elaboración
            </SheetTitle>
          </div>

          <SheetDescription className="text-sm text-muted-foreground">
            Acta ID:{' '}
            <span className="font-mono font-medium text-foreground">
              #{numeroActa}
            </span>
          </SheetDescription>
        </SheetHeader>

        {/* CONTENIDO PRINCIPAL CON SCROLL */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="px-6 pt-0 pb-0">
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
                <div className="space-y-4">
                  {observaciones &&
                    observaciones.analisis &&
                    observaciones.analisis.length > 0 && (
                      <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full w-fit">
                        <BsCheckCircle className="w-3 h-3" />
                        Análisis completado
                      </div>
                    )}
                  {renderContent()}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* FOOTER con botón Actualizar Observación */}
        {observaciones && !isLoading && (
          <SheetFooter className="border-t pt-4 px-6 pb-6 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRegenerate}
              className="w-full cursor-pointer"
            >
              Actualizar Observación
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
