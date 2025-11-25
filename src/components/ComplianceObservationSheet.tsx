'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area'; // Opcional si tienes ScrollArea, si no, usaremos div nativo
import { Separator } from '@/components/ui/separator';

interface ComplianceObservationSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  actaId: string;
  numeroCompliance: string;
}

export function ComplianceObservationSheet({
  isOpen,
  onOpenChange,
  numeroCompliance,
}: ComplianceObservationSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full bg-white text-black">
        {/* HEADER FIJO */}
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold text-primary">
            Observaciones del Acta
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Código:{' '}
            <span className="font-medium text-foreground">
              {numeroCompliance}
            </span>
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {/* CONTENIDO ESCROLLEABLE */}
        {/* flex-1 permite que este div ocupe el espacio restante y overflow-y-auto habilita el scroll */}
        <div className="flex-1 overflow-y-auto py-6 pr-2">
          {/* ESTADO VACÍO (Placeholder) */}
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground opacity-60">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <p className="text-sm max-w-xs">
              Aún no hay observaciones cargadas para esta acta de compliance.
              <br />
              <span className="text-xs italic">(Próximamente disponible)</span>
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
