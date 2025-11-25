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
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  updateUser,
  updateProfile,
  getMyProfile,
} from '@/services/authService';

// El esquema de validación se mantiene intacto
const profileSchema = z.object({
  email: z.string().optional(), // Agregado para mostrarlo
  nombre: z.string().min(1, 'El nombre es requerido.'),
  apellido: z.string().min(1, 'El apellido es requerido.'),
  telefono: z.string().min(1, 'El teléfono es requerido.'),
  institucion: z.string().min(1, 'La institución es requerida.'),
  cargo: z.string().min(1, 'El cargo es requerido.'),
  plazoEntregaActa: z.string().min(1, 'El plazo de entrega es requerido.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ref para evitar múltiples cargas de datos
  const hasFetchedData = useRef(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: '', // Valor inicial
      nombre: '',
      apellido: '',
      telefono: '',
      institucion: '',
      cargo: '',
      plazoEntregaActa: '',
    },
    mode: 'onChange',
  });

  // Efecto para cargar los datos directamente del servidor
  useEffect(() => {
    if (hasFetchedData.current) return;

    const loadUserProfile = async () => {
      try {
        // Marcamos que ya hemos intentado cargar los datos
        hasFetchedData.current = true;
        setIsLoading(true);

        const data = await getMyProfile();

        if (data) {
          form.reset({
            email: data.email || '',
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            telefono: data.telefono || '',
            institucion: data.profile?.institucion || '',
            cargo: data.profile?.cargo || '',
            plazoEntregaActa: data.profile?.plazoEntregaActa || '',
          });
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        toast.error('No se pudo cargar la información del perfil.');
        // Si falla, permitimos reintentar en un futuro montaje si fuera necesario
        hasFetchedData.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Función para manejar el submit del formulario
  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      // Actualizar datos básicos de usuario (User)
      await updateUser({
        nombre: data.nombre,
        apellido: data.apellido,
      });

      // Actualizar datos extendidos del perfil (Profile)
      await updateProfile({
        institucion: data.institucion,
        cargo: data.cargo,
      });

      toast.success('Perfil actualizado correctamente.');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al actualizar el perfil.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !form.getValues().nombre) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>
          Actualiza tu información personal y detalles profesionales.
        </CardDescription>
      </CardHeader>
      <Separator className="mb-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-2 flex flex-col gap-5 pb-8">
            {/* Campo Email - Solo ReadOnly */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      disabled
                      className="bg-muted text-muted-foreground cursor-not-allowed"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre"
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
              control={form.control}
              name="apellido"
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
              control={form.control}
              name="telefono"
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
              control={form.control}
              name="institucion"
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
              control={form.control}
              name="cargo"
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
                    form.reset(form.getValues());
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
