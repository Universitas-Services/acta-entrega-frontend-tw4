'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { registerUser } from '@/services/authService';
import { SuccessAlertDialog } from './SuccessAlertDialog';
import { LegalPopup } from './LegalPopup';
import { TermsContent } from './TermsContent';
import { PrivacyContent } from './PrivacyContent';

const prefijosValidos = [
  '0412',
  '0422',
  '0414',
  '0424',
  '0426',
  '0416',
] as const;

// Schema para el Paso 1: Credenciales
const step1Schema = z
  .object({
    email: z.string().email({ message: 'Debe ser un correo válido.' }),
    password: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
      .regex(/[a-z]/, {
        message: 'Debe contener al menos una letra minúscula.',
      })
      .regex(/[A-Z]/, {
        message: 'Debe contener al menos una letra mayúscula.',
      })
      .regex(/[0-9]/, { message: 'Debe contener al menos un número.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Debe contener al menos un símbolo especial.',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

// Schema para el Paso 2: Datos Personales (solo para validación final)
const step2Schema = z.object({
  nombre: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(50, { message: 'El nombre no puede exceder los 50 caracteres.' })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/, {
      message: 'El nombre debe ser una sola palabra y solo contener letras.',
    }),
  apellido: z
    .string()
    .min(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
    .max(50, { message: 'El apellido no puede exceder los 50 caracteres.' })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/, {
      message: 'El apellido debe ser una sola palabra y solo contener letras.',
    }),
  prefijo: z.enum(prefijosValidos),
  numeroLocal: z.string().regex(/^\d{7}$/, {
    message: 'Debe ser un numero de 7 dígitos.',
  }),
});

// Schema que permite campos opcionales para evitar validación prematura
const formSchemaWithOptional = step1Schema.safeExtend({
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  prefijo: z.string().optional(),
  numeroLocal: z.string().optional(),
});

type FormFieldsOptional = z.infer<typeof formSchemaWithOptional>;

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormFieldsOptional>({
    resolver: zodResolver(formSchemaWithOptional), // Usar schema con campos opcionales
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldFocusError: false, // Evitar focus automático en errores
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      apellido: '',
      prefijo: '0412',
      numeroLocal: '',
    },
  });

  // Efecto para limpiar errores cuando cambie el paso
  useEffect(() => {
    form.clearErrors();
  }, [step, form]);

  // Lógica de transición que valida solo el schema del Paso 1
  const handleNextStep = () => {
    form.clearErrors();
    // Validamos los datos actuales del formulario contra el schema del Paso 1
    const result = step1Schema.safeParse(form.getValues());

    // Si la validación del paso 1 falla...
    if (!result.success) {
      // ...iteramos sobre los errores y los aplicamos manualmente al formulario.
      result.error.issues.forEach((issue) => {
        form.setError(issue.path[0] as keyof FormFieldsOptional, {
          type: 'manual',
          message: issue.message,
        });
      });
      return; // Detenemos la transición
    }

    // Si el paso 1 es válido, avanzamos al paso 2
    setStep(2);
  };

  // Función para volver al paso anterior
  const handlePreviousStep = () => {
    form.clearErrors();
    setStep(1);
  };

  async function onSubmit(values: FormFieldsOptional) {
    // Solo procesar el envío si realmente se está enviando el formulario
    if (!isSubmitting) {
      return;
    }

    // Validar que todos los campos del paso 2 estén completos usando el schema
    const step2Result = step2Schema.safeParse(values);
    if (!step2Result.success) {
      // Aplicar errores de validación del paso 2
      step2Result.error.issues.forEach((issue) => {
        form.setError(issue.path[0] as keyof FormFieldsOptional, {
          type: 'manual',
          message: issue.message,
        });
      });
      setIsSubmitting(false);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    try {
      const dataToSend = {
        email: values.email,
        password: values.password,
        nombre: values.nombre!,
        apellido: values.apellido!,
        telefono: `${values.prefijo}${values.numeroLocal}`,
      };
      await registerUser(dataToSend);
      setShowSuccessDialog(true);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Ocurrió un error inesperado durante el registro.');
      }
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="w-full max-w-md">
        {step === 2 && (
          <button
            type="button"
            onClick={handlePreviousStep}
            // Estilos actualizados con variables de tema
            className="flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </button>
        )}
        <div className="text-center mb-8">
          {/* Estilos de texto actualizados */}
          <h1 className="text-3xl font-bold text-foreground">
            {step === 1 ? 'Crea tu cuenta' : 'Completa tus datos'}
          </h1>
          <p className="text-muted-foreground">
            Por favor, introduce tus datos para continuar.
          </p>
        </div>

        {/* --- Indicador de Pasos --- */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div
            className={`text-center transition-opacity duration-300 ${step === 1 ? 'opacity-100' : 'opacity-50'}`}
          >
            <div
              // Clases de tema para el indicador
              className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              1
            </div>
            <p
              className={`mt-2 text-sm font-semibold ${step === 1 ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Credenciales
            </p>
          </div>
          <div
            className={`text-center transition-opacity duration-300 ${step === 2 ? 'opacity-100' : 'opacity-50'}`}
          >
            <div
              // Clases de tema para el indicador
              className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              2
            </div>
            <p
              className={`mt-2 text-sm font-semibold ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Datos personales
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
              // Estilo de alerta de error actualizado para usar la variante 'destructive'
              <div
                className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md relative"
                role="alert"
              >
                <span className="block sm:inline">{apiError}</span>
              </div>
            )}

            {/* --- PASO 1: CREDENCIALES --- */}
            <div className={step === 1 ? 'block' : 'hidden'}>
              <div className="space-y-4">
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
                            placeholder="Nueva contraseña"
                            {...field}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            // Ícono ahora usa el color de texto secundario
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground cursor-pointer"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="h-5 w-5" />
                            ) : (
                              <FaEye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Nueva contraseña"
                            {...field}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground cursor-pointer"
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash className="h-5 w-5" />
                            ) : (
                              <FaEye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* --- PASO 2: DATOS PERSONALES --- */}
            <div className={step === 2 ? 'block' : 'hidden'}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa tu nombre"
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
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa tu apellido"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <div className="flex items-start space-x-2">
                    <FormField
                      control={form.control}
                      name="prefijo"
                      render={({ field }) => (
                        <FormItem className="w-[120px]">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ''}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Prefijo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value="0412">0412</SelectItem>
                              <SelectItem value="0414">0414</SelectItem>
                              <SelectItem value="0416">0416</SelectItem>
                              <SelectItem value="0424">0424</SelectItem>
                              <SelectItem value="0426">0426</SelectItem>
                              <SelectItem value="0422">0422</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="numeroLocal"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="1234567"
                              maxLength={7}
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormItem>
              </div>
            </div>

            {/* Sección de Términos y Condiciones actualizada */}
            <div className="text-sm bg-muted p-4 rounded-lg text-center text-muted-foreground">
              Al crear una cuenta, aceptas los{' '}
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Términos y Condiciones
              </button>{' '}
              y la{' '}
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Política de Privacidad
              </button>
              .
            </div>

            {/* Botones actualizados para usar la variante por defecto */}
            {step === 1 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="w-full text-lg py-6 cursor-pointer"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full text-lg py-6 cursor-pointer"
                disabled={isLoading}
                onClick={() => setIsSubmitting(true)}
              >
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            )}
          </form>
        </Form>
        <div className="text-center mt-6 text-sm">
          {/* Enlace inferior actualizado */}
          <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
            replace
          >
            Inicia sesión
          </Link>
        </div>
      </div>

      <SuccessAlertDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="¡Registro Exitoso!"
        description="Hemos enviado un correo para que valides tu cuenta. Por favor, revisa tu bandeja de entrada."
        onConfirm={() => router.push('/login')}
      />
      <LegalPopup
        isOpen={isTermsOpen}
        onOpenChange={setIsTermsOpen}
        title="Términos y Condiciones"
      >
        <TermsContent />
      </LegalPopup>

      <LegalPopup
        isOpen={isPrivacyOpen}
        onOpenChange={setIsPrivacyOpen}
        title="Política de Privacidad"
      >
        <PrivacyContent />
      </LegalPopup>
    </>
  );
}
