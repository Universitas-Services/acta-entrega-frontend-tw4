'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { updateUser, updateProfile } from '@/services/authService';

// El esquema de validación
const profileSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido.'),
  apellido: z.string().min(1, 'El apellido es requerido.'),
  telefono: z.string().min(1, 'El teléfono es requerido.'),
  institucion: z.string().min(1, 'La institución es requerida.'),
  cargo: z.string().min(1, 'El cargo es requerido.'),
  plazoEntregaActa: z
    .number({
      error: 'Debe ser un número',
    })
    .int('Debe ser un número entero')
    .min(1, 'El plazo debe ser al menos 1')
    .nullable()
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Componente para el estado de carga
const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full mt-2" />
    </CardHeader>
    <Separator className="my-4" />
    <CardContent className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
    <CardFooter className="border-t pt-6 flex justify-end">
      <Skeleton className="h-10 w-24" />
    </CardFooter>
  </Card>
);

export function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, fetchUser } = useAuthStore();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      telefono: '',
      institucion: '',
      cargo: '',
    },
  });

  // LÓGICA DE CARGA DE DATOS (useEffect)
  useEffect(() => {
    if (user) {
      form.reset({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        institucion: user.profile?.institucion || '',
        cargo: user.profile?.cargo || '',
        plazoEntregaActa: user.profile?.plazoEntregaActa || null,
      });
    }
  }, [user, form]);

  // LÓGICA DE ENVÍO Y ACTUALIZACIÓN DE ESTADO  (onSubmit)
  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      // Actualizamos los datos del Usuario
      await updateUser({
        nombre: values.nombre,
        apellido: values.apellido,
        telefono: values.telefono,
      });

      // Actualizamos los datos del Perfil
      await updateProfile({
        institucion: values.institucion,
        cargo: values.cargo,
        plazoEntregaActa: values.plazoEntregaActa,
      });

      // Volvemos a cargar el usuario en el store
      // para que los datos se actualicen en toda la app.
      await fetchUser();

      toast.success('Perfil actualizado exitosamente.');
      setIsEditing(false);
    } catch (error: unknown) {
      console.error('Error al actualizar el perfil:', error);

      // 👇 CORREGIDO: Añadimos un type guard
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocurrió un error desconocido.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  // ESTADO DE CARGA INICIAL CON UN SKELETON
  if (isLoading && !isEditing) {
    return <LoadingSkeleton />;
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Información del perfil</CardTitle>
            <CardDescription>
              Actualiza los datos de tu cuenta. El correo no puede ser
              modificado.
            </CardDescription>
          </CardHeader>

          <Separator className="my-4" />

          <CardContent className="pt-4 pb-6">
            {/* El 'space-y-6' crea el espaciado vertical entre cada campo del formulario */}
            <div className="space-y-6">
              {/* Campo de Correo (solo lectura) */}
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input value={user?.email || ''} disabled readOnly />
                </FormControl>
              </FormItem>

              {/* El resto de los campos ahora están en una sola columna */}
              <FormField
                name="nombre"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing || isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="apellido"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing || isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="telefono"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing || isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="institucion"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institución</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing || isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="cargo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing || isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 border-t pt-6">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  type="button"
                  className="cursor-pointer"
                  onClick={() => {
                    setIsEditing(false);
                    // Resetea el formulario a los valores originales
                    form.reset();
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={!form.formState.isDirty || isLoading}
                >
                  {isLoading ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="cursor-pointer"
              >
                Editar perfil
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
