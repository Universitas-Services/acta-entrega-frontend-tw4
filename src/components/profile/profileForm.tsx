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
  email: z.string().optional(),

  // Nombres y Apellidos: Máximo 20
  nombre: z
    .string()
    .min(1, 'El nombre es requerido.')
    .max(20, 'El nombre no puede tener más de 20 caracteres.'),

  apellido: z
    .string()
    .min(1, 'El apellido es requerido.')
    .max(20, 'El apellido no puede tener más de 20 caracteres.'),

  // Teléfono: Exactamente 11 caracteres (ni más, ni menos)
  telefono: z
    .string()
    .length(11, 'El teléfono debe tener 11 dígitos.')
    .regex(/^\d+$/, 'Solo se permiten números'),

  // Institución y Cargo: Máximo 20
  institucion: z
    .string()
    .min(1, 'La institución es requerida.')
    .max(20, 'La institución no puede tener más de 20 caracteres.'),

  cargo: z
    .string()
    .min(1, 'El cargo es requerido.')
    .max(20, 'El cargo no puede tener más de 20 caracteres.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState<ProfileFormValues | null>(
    null
  );

  // Ref para evitar múltiples cargas de datos
  const hasFetchedData = useRef(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: '',
      nombre: '',
      apellido: '',
      telefono: '',
      institucion: '',
      cargo: '',
    },
    mode: 'onSubmit',
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
          const formData = {
            email: data.email || '',
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            telefono: data.telefono || '',
            institucion: data.profile?.institucion || '',
            cargo: data.profile?.cargo || '',
          };

          // Guardamos la copia original
          setOriginalData(formData);

          // Llenamos el formulario
          form.reset(formData);
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
  }, [form]);

  // Función para manejar el submit del formulario
  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      // Actualizar datos básicos de usuario (User)
      await updateUser({
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
      });

      // Actualizar datos extendidos del perfil (Profile)
      await updateProfile({
        institucion: data.institucion,
        cargo: data.cargo,
      });

      // Si guardamos con éxito, actualizamos la "copia original" con los nuevos datos
      // para que si el usuario cancela una futura edición, vuelva a estos datos nuevos.
      setOriginalData(data);
      form.reset(data); // También reseteamos el estado "dirty" del form

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
                    <Input
                      {...field}
                      maxLength={20}
                      disabled={!isEditing || isLoading}
                    />
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
                    <Input
                      {...field}
                      maxLength={20}
                      disabled={!isEditing || isLoading}
                    />
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
                    <Input
                      {...field}
                      maxLength={11}
                      disabled={!isEditing || isLoading}
                    />
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
                    <Input
                      {...field}
                      maxLength={30}
                      disabled={!isEditing || isLoading}
                    />
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
                    <Input
                      {...field}
                      maxLength={20}
                      disabled={!isEditing || isLoading}
                    />
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
                    // Reseteamos el formulario a los datos ORIGINALES guardados en el estado
                    if (originalData) {
                      form.reset(originalData);
                    }
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
