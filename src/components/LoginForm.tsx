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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '@/stores/useAuthStore';

const formSchema = z.object({
  email: z.string().email({
    message: 'Por favor, ingresa un correo electrónico válido.',
  }),
  password: z.string().min(1, {
    message: 'La contraseña es requerida.',
  }),
});

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      await login(values);

      router.push('/dashboard');
    } catch (err: unknown) {
      // Si el store lanza un error (ej. 401 Credenciales Inválidas),
      // el 'authService' lo captura y lo muestra aquí.
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido.');
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Actas de Entrega</h1>
        <p className="text-muted-foreground">Inicia sesión para continuar</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div
              className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingresa tu correo"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña"
                      {...field}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground cursor-pointer"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right text-sm">
            <Link
              href="/recuperar-contrasena"
              className="font-semibold text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full text-lg py-6 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-6 text-sm">
        <span className="text-muted-foreground">¿No tienes cuenta? </span>
        <Link
          href="/registro"
          className="font-bold text-primary hover:underline"
        >
          Regístrate AQUÍ
        </Link>
      </div>
    </div>
  );
}
