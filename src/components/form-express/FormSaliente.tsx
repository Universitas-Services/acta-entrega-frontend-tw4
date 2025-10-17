'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription as ShadcnCardDescription,
} from '@/components/ui/card';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/HeaderContext';
import { Textarea } from '@/components/ui/textarea';
import { createActaSalientePaga } from '@/services/actasService';
import { InputCompuesto } from '../InputCompuesto';
import { LocationSelector } from '../LocationSelector';
import { ShadcnDatePicker } from '../DatePicker';
import { ShadcnTimePicker } from '../TimePicker';
import { SiNoQuestion } from '../SiNoQuestion';
import { SuccessAlertDialog } from '../SuccessAlertDialog';
import { actaSalienteSchema } from '@/lib/schemas';
import { CiCircleCheck } from 'react-icons/ci';
import { LuTriangleAlert } from 'react-icons/lu';
import {
  steps,
  anexosAdicionalesTitulos,
  dynamicStepContentSaliente,
  DynamicContent,
} from '@/lib/acta-saliente-constants';
import { useFormDirtyStore } from '@/stores/useFormDirtyStore';
import { useFormState } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FormFieldWithExtras } from '../FormFieldWithExtras';
import { format } from 'date-fns';
import { toast } from 'sonner';

type FormData = z.infer<typeof actaSalienteSchema>;
type DynamicStepKey = keyof DynamicContent;

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function ActaSalienteForm() {
  const router = useRouter();
  const { setTitle } = useHeader();
  const [currentStep, setCurrentStep] = useState(0);
  const [finalStepAnswered, setFinalStepAnswered] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setTitle('Acta Saliente');
  }, [setTitle]);

  const form = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(actaSalienteSchema),
    shouldUnregister: false,
    defaultValues: {
      email: '',
      rifOrgano: '',
      denominacionCargo: '',
      nombreOrgano: '',
      ciudadSuscripcion: '',
      estadoSuscripcion: '',
      horaSuscripcion: '',
      fechaSuscripcion: '',
      direccionOrgano: '',
      motivoEntrega: '',

      nombreServidorSaliente: '',
      cedulaServidorSaliente: '',
      designacionServidorSaliente: '',

      nombreServidorRecibe: '',
      cedulaServidorRecibe: '',
      designacionServidorRecibe: '',

      Anexo_VI: '',
      Anexo_VII: '',
      disponeEstadoSituacionPresupuestaria: '',
      disponeRelacionGastosComprometidosNoCausados: '',
      disponeRelacionGastosComprometidosCausadosNoPagados: '',
      disponeEstadoPresupuestarioPorPartidas: '',
      disponeEstadoPresupuestarioDetalleCuentas: '',
      disponeEstadosFinancieros: '',
      disponeBalanceComprobacion: '',
      disponeEstadoSituacionFinanciera: '',
      disponeEstadoRendimientoFinanciero: '',
      disponeEstadoMovimientosPatrimonio: '',
      disponeRelacionCuentasPorCobrar: '',
      disponeRelacionCuentasPorPagar: '',
      disponeRelacionCuentasFondosTerceros: '',
      disponeSituacionFondosAnticipo: '',
      disponeSituacionCajaChica: '',
      disponeActaArqueoCajasChicas: '',
      disponeListadoRegistroAuxiliarProveedores: '',
      disponeReportesLibrosContables: '',
      disponeReportesCuentasBancarias: '',
      disponeReportesConciliacionesBancarias: '',
      disponeReportesRetenciones: '',
      disponeReporteProcesosContrataciones: '',
      disponeReporteFideicomisoPrestaciones: '',
      disponeReporteBonosVacacionales: '',
      disponeCuadroResumenCargos: '',
      disponeCuadroResumenValidadoRRHH: '',
      disponeReporteNominas: '',
      disponeInventarioBienes: '',
      disponeEjecucionPlanOperativo: '',
      incluyeCausasIncumplimientoMetas: '',
      disponePlanOperativoAnual: '',
      disponeClasificacionArchivo: '',
      incluyeUbicacionFisicaArchivo: '',
      disponeRelacionMontosFondosAsignados: '',
      disponeSaldoEfectivoFondos: '',
      disponeRelacionBienesAsignados: '',
      disponeRelacionBienesAsignadosUnidadBienes: '',
      disponeEstadosBancariosConciliados: '',
      disponeListaComprobantesGastos: '',
      disponeChequesEmitidosPendientesCobro: '',
      disponeListadoTransferenciaBancaria: '',
      disponeCaucionFuncionario: '',
      disponeCuadroDemostrativoRecaudado: '',
      disponeRelacionExpedientesAbiertos: '',
      disponeSituacionTesoroNacional: '',
      disponeInfoEjecucionPresupuestoNacional: '',
      disponeMontoDeudaPublicaNacional: '',
      disponeSituacionCuentasNacion: '',
      disponeSituacionTesoroEstadal: '',
      disponeInfoEjecucionPresupuestoEstadal: '',
      disponeSituacionCuentasEstado: '',
      disponeSituacionTesoroDistritalMunicipal: '',
      disponeInfoEjecucionPresupuestoDistritalMunicipal: '',
      disponeSituacionCuentasDistritalesMunicipales: '',
      disponeInventarioTerrenosEjidos: '',
      disponeRelacionIngresosVentaTerrenos: '',
      accionesAuditoria: '',
      deficienciasActa: '',
      interesProducto: '',
    },
  });

  const { getValues, watch, setValue } = form;

  const selectedAnexo = watch('Anexo_VII') as DynamicStepKey;

  const { setIsDirty } = useFormDirtyStore();
  const { isDirty } = useFormState({ control: form.control });

  // useEffect para comunicar el estado del formulario al store
  useEffect(() => {
    setIsDirty(isDirty);

    // Función de limpieza: se ejecuta cuando el componente se desmonta
    return () => {
      setIsDirty(false);
    };
  }, [isDirty, setIsDirty]);

  const onSubmit = async (data: FormData) => {
    console.log('DATOS FINALES A ENVIAR:', data);
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await createActaSalientePaga(data);
      console.log('Respuesta del servidor:', response);

      // Prepara el contenido para el diálogo de éxito
      setDialogContent({
        title: `¡Acta de Entrega N° ${response.numeroActa} generada!`,
        description:
          'Su documento ha sido creado exitosamente. Se ha enviado a su dirección de correo electrónico y la recibirá en un plazo de 5 minutos.',
      });

      // Muestra el diálogo
      setShowSuccessDialog(true);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Esta función ahora apunta al contenedor de scroll específico.
  const scrollToTop = () => {
    const mainContent = document.getElementById('main-content-container');
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const nextStep = async () => {
    // Obtener los campos a validar en este paso
    let fieldsToValidate: (keyof FormData)[] = steps[currentStep]
      .fields as (keyof FormData)[];

    // validar campos dinámicos
    if (currentStep === 9) {
      const selectedAnexoKey = getValues('Anexo_VII') as DynamicStepKey;
      const anexoContent = dynamicStepContentSaliente[selectedAnexoKey];

      if (anexoContent) {
        if (anexoContent.type === 'questions') {
          // Si es de preguntas, validamos solo esas preguntas
          fieldsToValidate = anexoContent.questions.map(
            (q) => q.name as keyof FormData
          );
        } else if (anexoContent.type === 'textarea') {
          // Si es de texto, validamos solo ese campo de texto
          fieldsToValidate = [anexoContent.fieldName];
        }
      }
    }

    // Se dispara la validación, pero le decimos que no haga focus automáticamente
    const isValid = await form.trigger(fieldsToValidate, {
      shouldFocus: false,
    });

    // --- LÓGICA DE SCROLL AUTO - De campos faltantes ---
    if (!isValid) {
      const errors = form.formState.errors;
      const firstErrorField = fieldsToValidate.find((field) => errors[field]);

      if (firstErrorField) {
        const mainContent = document.getElementById('main-content-container');
        const element = document.getElementById(firstErrorField);
        // Buscamos por FormItem, que es el contenedor visual completo del campo
        const formItem = element?.closest<HTMLElement>(
          '.flex.flex-col, .space-y-4.p-4.border.rounded-md, [data-slot="form-item"], FormItem'
        );

        // Fallback por si closest no funciona
        const finalTarget = formItem || element;

        if (mainContent && finalTarget) {
          const containerRect = mainContent.getBoundingClientRect();
          const itemRect = finalTarget.getBoundingClientRect();

          const itemTopInContainer =
            itemRect.top - containerRect.top + mainContent.scrollTop;

          const desiredScrollTop =
            itemTopInContainer -
            mainContent.clientHeight / 2 +
            finalTarget.clientHeight / 2;

          mainContent.scrollTo({
            top: desiredScrollTop,
            behavior: 'smooth',
          });

          toast.warning('Por favor, revisa los campos marcados en rojo.');
        }
      }
      return;
    }

    // --- Lógica de Cambio de Paso (solo se ejecuta si NO hay errores) ---
    scrollToTop(); // Llevamos al tope ANTES de cambiar el contenido
    setTimeout(() => {
      if (currentStep === 8 && getValues('Anexo_VII') === 'NO APLICA') {
        setCurrentStep(10);
      } else if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 100); // Delay para que el scroll ocurra antes del cambio de contenido
  };

  const prevStep = () => {
    scrollToTop(); // Siempre subimos al cambiar de paso
    setTimeout(() => {
      if (currentStep === 10 && getValues('Anexo_VII') === 'NO APLICA') {
        setCurrentStep(8);
      } else if (currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    }, 100); // Delay para que el scroll ocurra antes del cambio de contenido
  };

  // Lógica para reiniciar la ciudad cuando cambia el estado

  // Observamos el campo del estado para reaccionar a sus cambios.
  const estadoSuscripcion = watch('estadoSuscripcion');

  // Usamos el hook para recordar cuál fue el valor anterior del estado.
  const previousEstado = usePrevious(estadoSuscripcion);

  // Este useEffect se ejecutará cada vez que el estado cambie.
  useEffect(() => {
    // La condición clave: solo actuamos si hubo un estado anterior
    // y el estado actual es diferente. Esto previene que se ejecute
    // al cargar por primera vez o al volver a un paso.
    if (previousEstado && estadoSuscripcion !== previousEstado) {
      // Si la condición se cumple, significa que el usuario ha cambiado
      // activamente el estado, por lo que reseteamos la ciudad.
      setValue('ciudadSuscripcion', '', { shouldValidate: true });
    }
  }, [estadoSuscripcion, previousEstado, setValue]);

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-[24px]">
          {currentStep === 9 && dynamicStepContentSaliente[selectedAnexo]
            ? dynamicStepContentSaliente[selectedAnexo].title
            : steps[currentStep].title}
        </CardTitle>
        <ShadcnCardDescription className="whitespace-pre-line italic font-bold">
          {currentStep === 9 && dynamicStepContentSaliente[selectedAnexo]
            ? dynamicStepContentSaliente[selectedAnexo].subtitle
            : steps[currentStep].subtitle}
        </ShadcnCardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Mensaje de error de la API */}
            {apiError && (
              <Alert variant="destructive">
                <LuTriangleAlert className="h-4 w-4" />
                <AlertTitle>Error al Crear el Acta</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <SuccessAlertDialog
              isOpen={showSuccessDialog}
              onClose={() => setShowSuccessDialog(false)}
              title={dialogContent.title}
              description={dialogContent.description}
              onConfirm={() => {
                setShowSuccessDialog(false);
                // La redirección ahora ocurre cuando el usuario presiona "Entendido"
                router.push('/dashboard');
              }}
            />

            {currentStep === 0 && (
              <div className="space-y-8">
                {/* --- Primera Sección: Identificación --- */}
                <div className="space-y-4 p-6 border rounded-lg">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">
                      Identificación del cargo y organismo
                    </h3>
                    <p className="text-sm text-gray-500 italic font-bold">
                      Artículo 10.2 Resolución CGR N.º 01-000162 de fecha
                      27-07-2009
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <FormFieldWithExtras
                      name="email"
                      label="Dirección de correo electrónico"
                      subtitle="Ej: ejemplo@dominio.com"
                    />
                    <FormField
                      control={form.control}
                      name="rifOrgano"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            RIF del órgano, entidad, oficina o dependencia de la
                            Administración Pública
                          </FormLabel>
                          <FormDescription className="italic">
                            Ej: G-00000000-0
                          </FormDescription>
                          <FormControl>
                            <InputCompuesto
                              id={field.name}
                              type="rif"
                              options={['G', 'J', 'E']} // Opciones para el desplegable
                              placeholder=""
                              {...field}
                              onChange={(value) => field.onChange(value)} // Conecta el cambio con el formulario
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormFieldWithExtras
                      name="denominacionCargo"
                      label="Denominación del cargo"
                      subtitle="Ej: Presidencia, dirección, coordinación"
                      maxLength={50}
                      validationType="textOnly"
                    />
                    <FormFieldWithExtras
                      name="nombreOrgano"
                      label="Nombre del órgano, entidad, oficina o dependencia de la Administración Pública"
                      subtitle="Ej: Instituto Nacional de Transporte Terrestre (INTT)"
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* --- Segunda Sección: Detalles de Suscripción --- */}
                <div className="space-y-4 p-6 border rounded-lg">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">
                      Detalles de la suscripción del acta
                    </h3>
                    <p className="text-sm text-gray-500 italic font-bold">
                      Artículo 10.1 Resolución CGR N.º 01-000162 de fecha
                      27-07-2009
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <LocationSelector
                      control={form.control}
                      form={form}
                      estadoFieldName="estadoSuscripcion"
                      ciudadFieldName="ciudadSuscripcion"
                    />

                    <FormField
                      control={form.control}
                      name="horaSuscripcion"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Hora de suscripción del acta</FormLabel>
                          <ShadcnTimePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fechaSuscripcion"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha de la suscripción</FormLabel>
                          <ShadcnDatePicker
                            // 'T00:00:00' para que la fecha se interprete en la zona horaria local y no en UTC.
                            value={
                              field.value
                                ? new Date(`${field.value}T00:00:00`)
                                : undefined
                            }
                            onChange={(date) => {
                              if (date) {
                                field.onChange(format(date, 'yyyy-MM-dd'));
                              }
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2">
                      <FormFieldWithExtras
                        name="direccionOrgano"
                        label="Dirección exacta y completa de la ubicación del órgano, entidad, oficina o dependencia que se entrega"
                        subtitle="Ej: Avenida 00, entre calles 00 y 00, Edif. Central, Piso 2, Despacho de la presidencia"
                        maxLength={300}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="motivoEntrega"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Motivo de la entrega del órgano, entidad, oficina
                              o dependencia de la Administración Pública
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="cursor-pointer">
                                  <SelectValue placeholder="Seleccione un motivo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent
                                position="popper"
                                className="bg-white z-50 max-h-60 overflow-y-auto text-black"
                              >
                                <SelectItem value="Renuncia">
                                  Renuncia
                                </SelectItem>
                                <SelectItem value="Jubilación">
                                  Jubilación
                                </SelectItem>
                                <SelectItem value="Muerte">Muerte</SelectItem>
                                <SelectItem value="Incapacidad absoluta">
                                  Incapacidad absoluta
                                </SelectItem>
                                <SelectItem value="Destitución">
                                  Destitución
                                </SelectItem>
                                <SelectItem value="Supresión del cargo">
                                  {' '}
                                  Supresión del cargo
                                </SelectItem>
                                <SelectItem value="Expiración del período">
                                  {' '}
                                  Expiración del período
                                </SelectItem>
                                <SelectItem value="Ascenso">Ascenso</SelectItem>
                                <SelectItem value="Traslado">
                                  Traslado
                                </SelectItem>
                                <SelectItem value="Rotación">
                                  Rotación
                                </SelectItem>
                                <SelectItem value="Comisión de servicio">
                                  Comisión de servicio
                                </SelectItem>
                                <SelectItem value="Licencia">
                                  Licencia
                                </SelectItem>
                                <SelectItem value="Suspensión">
                                  Suspensión
                                </SelectItem>
                                <SelectItem value="Inhabilitación">
                                  Inhabilitación
                                </SelectItem>
                                <SelectItem value="Revocatoria del mandato">
                                  Revocatoria del mandato
                                </SelectItem>
                                <SelectItem value="Declaración de abandono del cargo">
                                  {' '}
                                  Declaración de abandono del cargo
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Servidor Público Saliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormFieldWithExtras
                    name="nombreServidorSaliente"
                    label="Nombre"
                    subtitle="Ej: Pedro José Rodríguez Hernández"
                    maxLength={50}
                    validationType="textOnly"
                  />
                  <FormField
                    control={form.control}
                    name="cedulaServidorSaliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cédula</FormLabel>
                        <FormDescription className="italic">
                          Ej: V-00.000.000
                        </FormDescription>
                        <FormControl>
                          <InputCompuesto
                            id={field.name}
                            type="cedula"
                            options={['V', 'E']} // Opciones para el desplegable
                            placeholder=""
                            {...field}
                            onChange={(value) => field.onChange(value)} // Conecta el cambio con el formulario
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormFieldWithExtras
                    name="designacionServidorSaliente"
                    label="Datos de designación"
                    subtitle="Ej: Resolución N° 000/00 de fecha 00-00-0000 publicado en Gaceta N° 0000 de fecha 00-00-000"
                    maxLength={150}
                  />
                </div>

                <h3 className="text-lg font-semibold border-b pb-2">
                  Servidor Público Entrante
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormFieldWithExtras
                    name="nombreServidorRecibe"
                    label="Nombre"
                    subtitle="Ej: Pedro José Rodríguez Hernández"
                    maxLength={50}
                    validationType="textOnly"
                  />
                  <FormField
                    control={form.control}
                    name="cedulaServidorRecibe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cédula</FormLabel>
                        <FormDescription className="italic">
                          Ej: V-00.000.000
                        </FormDescription>
                        <FormControl>
                          <InputCompuesto
                            id={field.name}
                            type="cedula"
                            options={['V', 'E']} // Opciones para el desplegable
                            placeholder=""
                            {...field}
                            onChange={(value) => field.onChange(value)} // Conecta el cambio con el formulario
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormFieldWithExtras
                    name="designacionServidorRecibe"
                    label="Datos de designación"
                    subtitle="Ej: Resolución N° 000/00 de fecha 00-00-0000 publicado en Gaceta N° 0000 de fecha 00-00-000"
                    maxLength={150}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="disponeEstadoSituacionPresupuestaria"
                  label="¿Dispone usted del documento Estado de situación presupuestaria  que muestra todos los momentos presupuestarios y sus detalles. Incluye: presupuesto original, modificaciones, presupuesto modificado, compromisos, causado, pagado, por pagar y presupuesto disponible a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="disponeRelacionGastosComprometidosNoCausados"
                  label="¿Dispone usted del documento Relación de gastos comprometidos no causados a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="disponeRelacionGastosComprometidosCausadosNoPagados"
                  label="¿Dispone usted del documento Relación de gastos comprometidos causados y no pagados a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="disponeEstadoPresupuestarioPorPartidas"
                  label="¿Dispone usted del documento Estado presupuestario del ejercicio vigente por partidas?"
                />
                <SiNoQuestion
                  name="disponeEstadoPresupuestarioDetalleCuentas"
                  label="¿Dispone usted del documento Estado presupuestario del ejercicio con los detalles de sus cuentas?"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="disponeEstadosFinancieros"
                  label="¿Dispone usted del documento Estados financieros a la fecha de la entrega?"
                />
                <SiNoQuestion
                  name="disponeBalanceComprobacion"
                  label="¿Dispone usted del documento Balance de comprobación a la fecha de la elaboración de los estados financieros y sus notas explicativas a la fecha de la entrega?"
                />
                <SiNoQuestion
                  name="disponeEstadoSituacionFinanciera"
                  label="¿Dispone usted del documento Estado de situación financiera / balance general y sus notas explicativas a la fecha de la entrega?"
                />
                <SiNoQuestion
                  name="disponeEstadoRendimientoFinanciero"
                  label="¿Dispone usted del documento Estado de rendimiento financiero / Estado de ganancias y pérdidas y sus notas explicativas a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="disponeEstadoMovimientosPatrimonio"
                  label="¿Dispone usted del documento Estado de movimientos de las cuentas de patrimonio y sus notas explicativas a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="disponeRelacionCuentasPorCobrar"
                  label="¿Dispone usted del documento Relación de cuentas por cobrar a la fecha del Acta de Entrega?"
                />
                <SiNoQuestion
                  name="disponeRelacionCuentasPorPagar"
                  label="¿Dispone usted del documento Relación de cuentas por pagar a la fecha del Acta de Entrega?"
                />
                <SiNoQuestion
                  name="disponeRelacionCuentasFondosTerceros"
                  label="¿Dispone usted del documento Relación de las cuentas de los fondos de terceros?"
                />
                <SiNoQuestion
                  name="disponeSituacionFondosAnticipo"
                  label="¿Dispone usted del documento Situación de los fondos en anticipo?"
                />
                <SiNoQuestion
                  name="disponeSituacionCajaChica"
                  label="¿Dispone usted del documento Situación de la caja chica?"
                />
                <SiNoQuestion
                  name="disponeActaArqueoCajasChicas"
                  label="¿Dispone usted del documento Acta de arqueo de las cajas chicas a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="disponeListadoRegistroAuxiliarProveedores"
                  label="¿Dispone usted del documento Listado del registro auxiliar de proveedores?"
                />
                <SiNoQuestion
                  name="disponeReportesLibrosContables"
                  label="¿Dispone usted del documento Reportes de libros contables (diario y mayores analíticos) a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="disponeReportesCuentasBancarias"
                  label="¿Dispone usted del documento Reportes de las cuentas bancarias (movimientos a la fecha del cese de funciones)?"
                />
                <SiNoQuestion
                  name="disponeReportesConciliacionesBancarias"
                  label="¿Dispone usted del documento Reportes de las conciliaciones bancarias a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="disponeReportesRetenciones"
                  label="¿Dispone usted del documento Reportes de retenciones de pagos pendientes por enterar correspondientes a ISLR, IVA y Retenciones por contratos (obras, bienes y servicios) a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="disponeReporteProcesosContrataciones"
                  label="¿Dispone usted del documento Reporte de los procesos de Contrataciones Públicas a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="disponeReporteFideicomisoPrestaciones"
                  label="¿Dispone usted del documento Reporte del fideicomiso de prestaciones sociales a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="disponeReporteBonosVacacionales"
                  label="¿Dispone usted del documento Reporte de bonos vacacionales a la fecha del cese de funciones?"
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="disponeCuadroResumenCargos"
                  label="¿Dispone usted del documento cuadro resumen indicando el número de cargos existentes, clasificados en empleados, obreros, fijos o contratados?"
                />
                <SiNoQuestion
                  name="disponeCuadroResumenValidadoRRHH"
                  label="¿Dispone usted del documento cuadro resumen validado por la Oficina de recursos humanos?"
                />
                <SiNoQuestion
                  name="disponeReporteNominas"
                  label="¿Dispone usted del documento Reporte de nóminas a la fecha del cese de funciones?"
                />
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="disponeInventarioBienes"
                  label="¿Dispone usted del documento Inventario de bienes e inmuebles esta elaborado a la fecha de entrega. Debe contener: comprobación física, condición de los bienes, responsable patrimonial, responsable por uso, fecha de verificación, número del acta de verificación, código, descripción, marca, modelo, número del serial, estado de conservación, ubicación y valor de mercado de los bienes?"
                />
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="disponeEjecucionPlanOperativo"
                  label="¿Dispone usted del documento Ejecución del Plan Operativo a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="incluyeCausasIncumplimientoMetas"
                  label="¿Usted incluye las causas que originaron el incumplimiento de algunas metas en la ejecución del Plan Operativo?"
                />
                <SiNoQuestion
                  name="disponePlanOperativoAnual"
                  label="¿Dispone usted del documento Plan Operativo anual?"
                />
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="disponeClasificacionArchivo"
                  label="¿Dispone usted del documento clasificación del archivo?"
                />
                <SiNoQuestion
                  name="incluyeUbicacionFisicaArchivo"
                  label="¿Usted incluye la ubicación física del archivo?"
                />
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="Anexo_VI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cualquier otra información o documentación que se
                        considere necesaria indicando la fecha de corte.
                      </FormLabel>
                      <ShadcnCardDescription className="text-xs">
                        Está referida a que además de los documentos requeridos
                        de manera estándar, las partes involucradas pueden
                        aportar datos adicionales que puedan influir en la
                        evaluación o decisión del organismo correspondiente. La
                        fecha de corte es crucial porque establece un límite
                        temporal para la información presentada, asegurando que
                        todas las partes estén en la misma página respecto a la
                        temporalidad de los datos.
                      </ShadcnCardDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Describa aquí la información adicional..."
                          {...field}
                          disabled={isLoading}
                          maxLength={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Anexo_VII"
                  render={({ field }) => (
                    <FormItem className="pt-2">
                      <FormLabel>ANEXOS ADICIONALES</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Seleccione un anexo a detallar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-black bg-white z-50 max-h-60 overflow-y-auto">
                          {anexosAdicionalesTitulos.map((anexo) => (
                            <SelectItem
                              key={anexo.longTitle}
                              value={anexo.longTitle}
                              className="whitespace-normal h-auto"
                            >
                              {anexo.shortTitle}
                            </SelectItem>
                          ))}
                          <SelectItem value="NO APLICA">NO APLICA</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 9 && (
              <div>
                {selectedAnexo && dynamicStepContentSaliente[selectedAnexo] ? (
                  (() => {
                    const content = dynamicStepContentSaliente[selectedAnexo];
                    switch (content.type) {
                      case 'questions':
                        return (
                          <div className="space-y-4">
                            {content.questions.map((q) => (
                              <SiNoQuestion
                                key={q.name}
                                name={q.name as keyof FormData}
                                label={q.label}
                              />
                            ))}
                          </div>
                        );
                      case 'textarea':
                        return (
                          <FormField
                            control={form.control}
                            name={content.fieldName}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder={`Describa aquí la información sobre "${content.title}"...`}
                                    {...field}
                                    rows={8}
                                    disabled={isLoading}
                                    maxLength={500}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                      default:
                        return null;
                    }
                  })()
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>
                      Por favor, seleccione un tipo de anexo en el paso anterior
                      para continuar.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 10 && (
              <div className="space-y-8">
                {/* Pregunta sobre la versión Pro */}
                <SiNoQuestion
                  name="interesProducto"
                  label="Nos complace que haya completado su acta. ¿Le gustaría recibir información para obtener la versión Pro con acceso a funcionalidades avanzadas?"
                  options={['SI', 'NO']}
                  onValueChange={() => {
                    // Cuando el usuario responde, mostramos el mensaje de finalización
                    setFinalStepAnswered(true);
                  }}
                  isLoading={isLoading}
                />

                {/* Mensaje de finalización (condicional) */}
                {finalStepAnswered && (
                  <div className="text-center p-6 mt-8 bg-gray-50 rounded-lg border border-dashed transition-opacity duration-500">
                    <CiCircleCheck className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">
                      ¡Ha completado el formulario!
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Ha llenado exitosamente el acta de entrega. Por favor,
                      revise los datos en los pasos anteriores usando el botón
                      Anterior.
                      <br />
                      Una vez que esté seguro, presione el botón{' '}
                      <b>Crear acta</b> para generar el documento final.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navegación entre pasos */}
            <div className="flex items-center justify-between pt-8">
              {/* Columna Izquierda (para el botón Anterior) */}
              <div className="w-1/3">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isLoading}
                    className="cursor-pointer shadow-md active:shadow-inner transition-all"
                  >
                    Anterior
                  </Button>
                )}
              </div>

              {/* Columna Central (para el indicador de Pasos) */}
              <div className="flex w-1/3 justify-center">
                <div className="bg-pasos-gris px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-sm font-bold text-gray-700">
                    Paso {currentStep + 1} de {steps.length}
                  </p>
                </div>
              </div>

              {/* Columna Derecha (para el botón Siguiente/Finalizar) */}
              <div className="flex w-1/3 justify-end">
                {currentStep < steps.length - 1 && (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                    variant="default"
                    className="cursor-pointer shadow-md active:bg-primary/80 active:translate-y-px transition-all"
                  >
                    Siguiente
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="default"
                    className="cursor-pointer shadow-md active:bg-primary/80 active:translate-y-px transition-all"
                  >
                    {isLoading ? 'Creando Acta...' : 'Crear acta'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
