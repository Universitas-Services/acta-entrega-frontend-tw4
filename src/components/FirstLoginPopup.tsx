'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { updateProfile } from '@/services/authService';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

// Esquema de validación para el formulario del popup
const popupSchema = z.object({
  institucion: z.string().min(1, 'La institución es requerida.'),
  cargo: z.string().min(1, 'El cargo es requerido.'),
  plazoEntregaActa: z.string().min(1, 'El plazo de entrega es requerido.'),
});

type PopupFormData = z.infer<typeof popupSchema>;

export function FirstLoginPopup({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const setShowFirstLoginPopup = useAuthStore(
    (state) => state.setShowFirstLoginPopup
  );

  const form = useForm<PopupFormData>({
    resolver: zodResolver(popupSchema),
    defaultValues: {
      institucion: '',
      cargo: '',
      plazoEntregaActa: '',
    },
  });

  // --- onSubmit CORREGIDO ---
  async function onSubmit(values: PopupFormData) {
    setIsLoading(true);
    try {
      const newProfile = await updateProfile({
        institucion: values.institucion,
        cargo: values.cargo,
        plazoEntregaActa: values.plazoEntregaActa,
      });

      setUserProfile(newProfile);

      toast.success('¡Perfil completado! Bienvenido/a.');

      setShowFirstLoginPopup(false); // Cierra el popup
    } catch (apiError: unknown) {
      console.error('Error al completar el perfil:', apiError);

      if (isAxiosError(apiError) && apiError.response) {
        toast.error(
          apiError.response.data.message || 'Error al guardar el perfil.'
        );
      } else if (apiError instanceof Error) {
        toast.error(apiError.message);
      } else {
        toast.error('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (isOpen && !open) {
      return;
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="max-w-md bg-white"
      >
        <DialogHeader>
          <DialogTitle>¡Bienvenido! Completa tu perfil</DialogTitle>
          <DialogDescription>
            Necesitamos la siguiente información para continuar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="institucion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institución</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plazoEntregaActa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Día del plazo para la entrega del acta</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Selecciona una opción..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card">
                      <SelectItem value="Día 1">Día 1</SelectItem>
                      <SelectItem value="Día 2">Día 2</SelectItem>
                      <SelectItem value="Día 3">Día 3</SelectItem>
                      <SelectItem value="No lo sé">No lo sé</SelectItem>
                      <SelectItem value="No voy a entregar un cargo aún">
                        No voy a entregar un cargo aún
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar y continuar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
