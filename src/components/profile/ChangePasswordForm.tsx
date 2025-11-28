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
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { SuccessAlertDialog } from '../SuccessAlertDialog';
import { toast } from 'sonner';
import { changePassword } from '@/services/authService';

// El robusto esquema de validación se mantiene intacto
const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'La contraseña actual es requerida.')
      .max(16, 'La contraseña no puede tener más de 16 caracteres.'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.')
      .max(16, 'La contraseña no puede tener más de 16 caracteres.')
      .regex(/[a-z]/, 'Debe contener al menos una letra minúscula.')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula.')
      .regex(/[0-9]/, 'Debe contener al menos un número.')
      .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial.'),
    confirmPassword: z
      .string()
      .min(8, 'Confirma tu nueva contraseña.')
      .max(16, 'La contraseña no puede tener más de 16 caracteres.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

export function ChangePasswordForm() {
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

  async function onSubmit(values: FormValues) {
    // Verificamos si la nueva contraseña es igual a la actual antes de enviar
    if (values.currentPassword === values.newPassword) {
      toast.error('La nueva contraseña debe ser distinta a la actual.');
      // Detenemos la función aquí, no se hace la llamada al servidor
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      setShowSuccessDialog(true);
      form.reset(); // Limpiamos el formulario tras el éxito
    } catch (error: unknown) {
      console.error(error);
      // Mostramos el mensaje de error que viene del servicio (ej. "Contraseña actual incorrecta")
      let errorMessage = 'Error al cambiar la contraseña';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Clase común para los botones de "Ojo"
  const eyeButtonClass =
    'cursor-pointer absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:bg-transparent hover:-translate-y-0.5 transition-transform duration-200';

  return (
    <>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Cambiar contraseña</CardTitle>
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
                      <FormLabel>Contraseña actual</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            {...field}
                            maxLength={16}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            tabIndex={-1} // Evita selección con Tab
                            className={eyeButtonClass}
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
                      <FormLabel>Nueva contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            {...field}
                            maxLength={16}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            tabIndex={-1} // Evita selección con Tab
                            className={eyeButtonClass}
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
                      <FormLabel>Confirmar nueva contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...field}
                            maxLength={16}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            tabIndex={-1} // Evita selección con Tab
                            className={eyeButtonClass}
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
                {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <SuccessAlertDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="¡Contraseña Actualizada!"
        description="Tu contraseña ha sido cambiada exitosamente."
        onConfirm={() => setShowSuccessDialog(false)}
      />
    </>
  );
}
