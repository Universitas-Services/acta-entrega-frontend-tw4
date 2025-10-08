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
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

// El esquema de validación
const profileSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido.'),
  apellido: z.string().min(1, 'El apellido es requerido.'),
  telefono: z.string().min(1, 'El teléfono es requerido.'),
  institucion: z.string().min(1, 'La institución es requerida.'),
  cargo: z.string().min(1, 'El cargo es requerido.'),
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
  const { user, setAuth } = useAuthStore();

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
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/user/profile');
        form.reset(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del perfil:', error);
        toast.error('No se pudieron cargar los datos del perfil.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [form]);

  // LÓGICA DE ENVÍO Y ACTUALIZACIÓN DE ESTADO  (onSubmit)
  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put('/user/profile', data);
      toast.success(response.data.message || 'Perfil actualizado con éxito.');
      setIsEditing(false);

      // Actualiza el estado global del usuario para que se refleje en toda la app
      if (user) {
        const updatedUser = {
          ...user,
          name: data.nombre, // 'name' es la propiedad en el store
          apellido: data.apellido,
        };
        const token = localStorage.getItem('authToken');
        if (token) {
          setAuth(token, updatedUser);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ocurrió un error inesperado al guardar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ESTADO DE CARGA INICIAL CON UN SKELETON
  if (isLoading && !isEditing) {
    return <LoadingSkeleton />;
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Información del Perfil</CardTitle>
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
                <FormLabel>Correo Electrónico</FormLabel>
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
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="cursor-pointer"
              >
                Editar Perfil
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
