'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deleteAccount } from '@/services/authService';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import axios from 'axios';

export function DeleteAccountSection() {
  // Toda la lógica de estado y de los diálogos se mantiene igual
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isFirstConfirmOpen, setIsFirstConfirmOpen] = useState(false);
  const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const finalConfirmationPhrase = 'eliminar mi cuenta de actas';

  const handleFinalDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAccount(password);
      toast.success('Tu cuenta ha sido eliminada permanentemente.');
      logout();
      router.push('/login');
    } catch (error) {
      // Implementamos el manejo de errores con tipado seguro
      let errorMessage = 'Ocurrió un error inesperado al eliminar la cuenta.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        // Si es un error de Axios con un mensaje del backend, lo usamos
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        // Si es un error genérico, usamos su mensaje
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsFinalConfirmOpen(false);
    }
  };

  const openFinalDialog = () => {
    setIsFirstConfirmOpen(false);
    // Pequeño retraso para que las animaciones de los diálogos no se solapen
    setTimeout(() => {
      setIsFinalConfirmOpen(true);
    }, 150);
  };

  return (
    <>
      {/* Usamos un borde destructivo para señalar una zona de peligro */}
      <Card className="border-destructive overflow-hidden p-0 gap-0">
        <CardHeader className="p-6">
          <CardTitle>Eliminar cuenta</CardTitle>
          <CardDescription>
            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor,
            asegúrate de que realmente quieres hacerlo. Toda tu información y
            actas guardadas se perderán permanentemente.
          </CardDescription>
        </CardHeader>

        <div className="bg-destructive/5">
          <CardFooter className="border-t border-destructive p-6 flex justify-end">
            {/* El botón usa la variante 'destructive' del tema */}
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setIsFirstConfirmOpen(true)}
            >
              Eliminar cuenta
            </Button>
          </CardFooter>
        </div>
      </Card>

      {/* --- Diálogos de Confirmación (Lógica sin cambios) --- */}

      {/* Primer Diálogo de Alerta */}
      <AlertDialog
        open={isFirstConfirmOpen}
        onOpenChange={setIsFirstConfirmOpen}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">
              ¿Estás absolutamente seguro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible y no se puede deshacer. Esto eliminará
              permanentemente tu cuenta y todos tus datos de nuestros
              servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white cursor-pointer hover:bg-destructive/90"
              onClick={openFinalDialog}
            >
              Continuar con la eliminación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo Final de Confirmación con Contraseña */}
      <Dialog open={isFinalConfirmOpen} onOpenChange={setIsFinalConfirmOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">
              Confirmación final requerida
            </DialogTitle>
            <DialogDescription>
              Para confirmar, escribe{' '}
              <strong className="text-destructive">
                {finalConfirmationPhrase}
              </strong>{' '}
              en el campo de abajo y proporciona tu contraseña actual.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirmationText" className="text-black">
                Frase de confirmación
              </Label>
              <Input
                id="confirmationText"
                name="confirmationText"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                autoComplete="off"
                className="text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">
                Contraseña actual
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black"
              />
            </div>
          </div>
          <Button
            variant="destructive"
            className="w-full cursor-pointer"
            onClick={handleFinalDelete}
            disabled={
              isLoading ||
              confirmationText.toLowerCase() !== finalConfirmationPhrase ||
              !password
            }
          >
            {isLoading ? 'Eliminando...' : 'Eliminar cuenta permanentemente'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
