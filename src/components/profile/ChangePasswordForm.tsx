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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { SuccessAlertDialog } from '../SuccessAlertDialog';
import { toast } from 'sonner';

// El robusto esquema de validación se mantiene intacto
const formSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida.'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.')
      .regex(/[a-z]/, 'Debe contener al menos una letra minúscula.')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula.')
      .regex(/[0-9]/, 'Debe contener al menos un número.')
      .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un símbolo especial.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export function ChangePasswordForm() {
  // La lógica de estado y de formulario se mantiene
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Asumimos un endpoint para cambiar la contraseña
      await apiClient.put('/user/password/change', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setShowSuccessDialog(true);
      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || 'Error al cambiar la contraseña.'
        );
      } else {
        toast.error('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>
                Para mayor seguridad, te recomendamos usar una contraseña única
                que no utilices en otros sitios.
              </CardDescription>
            </CardHeader>

            <Separator className="my-4" />

            <CardContent className="pt-4 pb-6">
              <div className="space-y-6">
                {/* Campo Contraseña Actual */}
                <FormField
                  name="currentPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña Actual</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer absolute inset-y-0 right-0 h-full px-3 text-muted-foreground"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo Nueva Contraseña */}
                <FormField
                  name="newPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer absolute inset-y-0 right-0 h-full px-3 text-muted-foreground"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo Confirmar Nueva Contraseña */}
                <FormField
                  name="confirmPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer absolute inset-y-0 right-0 h-full px-3 text-muted-foreground"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="border-t pt-6 flex justify-end">
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* El diálogo de éxito se mantiene y funcionará como antes */}
      <SuccessAlertDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="¡Contraseña Actualizada!"
        description="Tu contraseña ha sido cambiada exitosamente. Serás redirigido al menú principal."
        onConfirm={() => router.push('/dashboard')}
      />
    </>
  );
}
