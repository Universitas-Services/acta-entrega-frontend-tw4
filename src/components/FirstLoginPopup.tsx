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
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios'; // axios para el manejo de errores

// Esquema de validación para el formulario del popup
const popupSchema = z.object({
  institucion: z.string().min(1, 'La institución es requerida.'),
  cargo: z.string().min(1, 'El cargo es requerido.'),
  plazoEntregaActa: z.string().min(1, 'Debes seleccionar una opción.'),
});

type PopupFormData = z.infer<typeof popupSchema>;

export function FirstLoginPopup({ isOpen }: { isOpen: boolean }) {
  const { completeFirstLogin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<PopupFormData>({
    resolver: zodResolver(popupSchema),
    defaultValues: {
      institucion: '',
      cargo: '',
      plazoEntregaActa: '',
    },
  });

  const onSubmit = async (data: PopupFormData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await apiClient.post('/user/complete-profile', data);
      completeFirstLogin();
    } catch (error) {
      // Atrapamos el error sin el tipo 'any'
      // Verificamos de forma segura si es un error de Axios
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
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
            {apiError && (
              <p className="text-sm font-medium text-destructive">{apiError}</p>
            )}

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
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar y Continuar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
