// src/components/form-pro/Form-MA-pro.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription as ShadcnCardDescription,
  CardFooter,
} from '@/components/ui/card';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/HeaderContext';
import { Textarea } from '@/components/ui/textarea'; // Necesario para paso dinámico
import { InputCompuesto } from '../InputCompuesto';
import { LocationSelector } from '../LocationSelector';
import { ShadcnDatePicker } from '../DatePicker';
import { ShadcnTimePicker } from '../TimePicker';
import { SiNoQuestion } from '../SiNoQuestion';
import { SuccessAlertDialog } from '../SuccessAlertDialog';
import { actaMaximaAutoridadSchema } from '@/lib/schemas'; // Schema de MA
import { LuTriangleAlert } from 'react-icons/lu';
import {
  steps, // Importar steps de las nuevas constantes
  anexosAdicionalesTitulos, // Importar títulos para dropdown
  dynamicStepContent, // Importar contenido dinámico
  DynamicContent, // Importar tipo
  StepInfo, // Importar tipo
} from '@/lib/acta-ma-pro-constants'; // Usar las NUEVAS constantes
import { useFormDirtyStore } from '@/stores/useFormDirtyStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FormFieldWithExtras } from '../FormFieldWithExtras';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { FiSave } from 'react-icons/fi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input'; // Importar Input si FFWExtras no lo cubre todo
// Comentar la llamada real a la API por ahora
// import { createActaMaximaAutoridad } from '@/services/actasService';

// Tipado del formulario usando el schema importado
type FormData = z.infer<typeof actaMaximaAutoridadSchema>;

export function ActaMaximaAutoridadProForm() {
  // Cambiar nombre del componente
  const router = useRouter();
  const { setTitle } = useHeader();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { setIsDirty } = useFormDirtyStore();
  const [isSavedOnce, setIsSavedOnce] = useState(false); // Estado de guardado

  useEffect(() => {
    setTitle('Acta Máxima Autoridad (PRO)'); // Título específico
  }, [setTitle]);

  const form = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(actaMaximaAutoridadSchema),
    shouldUnregister: false,
    // DefaultValues copiados/adaptados de Form-MA.tsx
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
      nombreServidorEntrante: '',
      cedulaServidorEntrante: '',
      profesionServidorEntrante: '',
      designacionServidorEntrante: '',
      nombreAuditor: '',
      cedulaAuditor: '',
      profesionAuditor: '',
      nombreTestigo1: '',
      cedulaTestigo1: '',
      profesionTestigo1: '',
      nombreTestigo2: '',
      cedulaTestigo2: '',
      profesionTestigo2: '',
      nombreServidorSaliente: '',
      cedulaServidorSaliente: '',
      designacionServidorSaliente: '',
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
      Anexo_VI: '',
      Anexo_VII: '', // Campos del paso 9
      // Campos dinámicos (inicializados)
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
      // Paso final
      interesProducto: '',
    },
  });

  const { isDirty } = useFormState({ control: form.control });
  const { watch, getValues, trigger } = form; // Necesitamos watch y getValues para el paso dinámico

  useEffect(() => {
    setIsDirty(isDirty);
    return () => setIsDirty(false);
  }, [isDirty, setIsDirty]);

  // onSubmit (SIMULADO POR AHORA)
  const onSubmit = async (data: FormData) => {
    console.log('DATOS FINALES A ENVIAR (MA-PRO):', data);
    setIsLoading(true);
    setApiError(null);
    try {
      // --- LÓGICA REAL (COMENTADA) ---
      /*
      const response = await createActaMaximaAutoridad(data); // Usar endpoint correcto de MA
      console.log('Respuesta del servidor:', response);
      setDialogContent({
        title: `¡Acta de Entrega N° ${response.numeroActa} generada!`,
        description: 'Su documento ha sido creado exitosamente...',
      });
      setShowSuccessDialog(true);
      */
      // --- SIMULACIÓN ---
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const numeroSimulado = `MA-PRO-${Math.floor(Math.random() * 1000)}`;
      setDialogContent({
        title: `¡Acta (PRO) N° ${numeroSimulado} generada!`,
        description: 'Simulación: Su documento PRO ha sido creado.',
      });
      setShowSuccessDialog(true);
      // --- FIN SIMULACIÓN ---
    } catch (error) {
      if (error instanceof Error) setApiError(error.message);
      else setApiError('Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const contentScrollRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProgress = async () => {
    /* ... (igual que en Compliance) ... */
  };

  // --- Funciones de Navegación (Adaptadas para 10 pasos y salto en Paso 9) ---
  const nextStep = async () => {
    let fieldsToValidate = steps[currentStep]?.fields;
    const currentFieldsArray = Array.isArray(fieldsToValidate)
      ? fieldsToValidate
      : [];

    // Lógica específica para validar el paso 9 (índice 8 - Anexos Adicionales)
    if (currentStep === 8) {
      const selectedKey = getValues('Anexo_VII'); // Campo dropdown
      if (selectedKey && selectedKey !== 'NO APLICA') {
        const dynamicContent =
          dynamicStepContent[selectedKey as keyof DynamicContent];
        if (dynamicContent) {
          if (dynamicContent.type === 'questions') {
            const dynamicFields = dynamicContent.questions.map((q) => q.name);
            fieldsToValidate = [...currentFieldsArray, ...dynamicFields];
          } else if (dynamicContent.type === 'textarea') {
            fieldsToValidate = [
              ...currentFieldsArray,
              dynamicContent.fieldName,
            ];
          }
        }
      }
      // Si es "NO APLICA", solo validamos 'Anexo_VI' y 'Anexo_VII' (ya en currentFieldsArray)
    } else {
      fieldsToValidate = currentFieldsArray;
    }

    const isValid = await trigger(fieldsToValidate, { shouldFocus: false });

    if (!isValid) {
      // ... (Scroll al error sin cambios) ...
      toast.warning(
        'Por favor, completa todos los campos requeridos en este paso.'
      );
      return;
    }

    // Navegar si es válido (ahora son 10 pasos, índice 0-9)
    if (currentStep < steps.length - 1) {
      // Lógica de salto para Paso 9
      if (currentStep === 8 && getValues('Anexo_VII') === 'NO APLICA') {
        setCurrentStep(9); // Saltar directamente al último paso (índice 9)
      } else {
        setCurrentStep((prev) => prev + 1);
      }
      scrollToTop();
    }
  };

  const prevStep = () => {
    // Lógica de salto al retroceder
    if (currentStep === 9 && getValues('Anexo_VII') === 'NO APLICA') {
      setCurrentStep(7); // Volver al paso ANTERIOR al dropdown (índice 7)
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      scrollToTop();
    }
  };

  const goToStep = async (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length || stepIndex === currentStep)
      return;

    if (isSavedOnce) {
      setCurrentStep(stepIndex);
      scrollToTop();
    } else {
      if (stepIndex < currentStep) {
        setCurrentStep(stepIndex);
        scrollToTop();
      } else {
        let canAdvance = true;
        for (let i = currentStep; i < stepIndex; i++) {
          let fieldsToValidateIntermediate = Array.isArray(steps[i]?.fields)
            ? steps[i].fields
            : [];
          // Añadir validación dinámica intermedia para el paso 9 (índice 8)
          if (i === 8) {
            const selectedKey = getValues('Anexo_VII');
            if (selectedKey && selectedKey !== 'NO APLICA') {
              const dynamicContent =
                dynamicStepContent[selectedKey as keyof DynamicContent];
              if (dynamicContent) {
                if (dynamicContent.type === 'questions') {
                  fieldsToValidateIntermediate = [
                    ...fieldsToValidateIntermediate,
                    ...dynamicContent.questions.map((q) => q.name),
                  ];
                } else if (dynamicContent.type === 'textarea') {
                  fieldsToValidateIntermediate = [
                    ...fieldsToValidateIntermediate,
                    dynamicContent.fieldName,
                  ];
                }
              }
            }
          }
          const isValidIntermediate = await trigger(
            fieldsToValidateIntermediate,
            { shouldFocus: false }
          );
          if (!isValidIntermediate) {
            canAdvance = false;
            setCurrentStep(i);
            scrollToTop();
            toast.warning(`Completa el Paso ${i + 1} antes de continuar.`);
            break;
          }
        }
        if (canAdvance) {
          setCurrentStep(stepIndex);
          scrollToTop();
        }
      }
    }
  };

  // --- Lógica de paginación (igual que en Compliance) ---
  const totalSteps = steps.length; // Ahora son 10
  const currentPage = currentStep + 1;
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 1; // Ajusta según necesites

    const pageNumbers: number[] = [];
    pageNumbers.push(1); // Siempre 1

    const startEllipsisThreshold = maxVisiblePages + 3;
    if (currentPage > startEllipsisThreshold) {
      pageNumbers.push(-1);
    }

    const rangeStart = Math.max(2, currentPage - maxVisiblePages);
    const rangeEnd = Math.min(totalSteps - 1, currentPage + maxVisiblePages);
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }

    const endEllipsisThreshold = totalSteps - maxVisiblePages - 2;
    if (currentPage < endEllipsisThreshold) {
      pageNumbers.push(-1);
    }

    if (totalSteps > 1) {
      pageNumbers.push(totalSteps);
    } // Siempre Total (si > 1)

    let lastPushed = 0;
    for (const pageNum of pageNumbers) {
      if (pageNum === -1) {
        if (lastPushed !== -1) {
          items.push(<PaginationEllipsis key={`ellipsis-${items.length}`} />);
          lastPushed = -1;
        }
      } else {
        const isDisabled = !isSavedOnce && pageNum > currentPage;
        items.push(
          <PaginationItem key={pageNum}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!isDisabled) {
                  goToStep(pageNum - 1);
                }
              }}
              isActive={currentPage === pageNum}
              className={cn(
                'cursor-pointer',
                currentPage === pageNum && 'font-bold',
                isDisabled &&
                  'pointer-events-none opacity-50 text-muted-foreground'
              )}
              aria-disabled={isDisabled}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        );
        lastPushed = pageNum;
      }
    }
    return items;
  };

  // --- Renderizado Condicional del Contenido ---
  const currentStepData = steps[currentStep];
  const selectedAnexo = watch('Anexo_VII') as
    | keyof DynamicContent
    | 'NO APLICA'
    | undefined
    | ''; // Para el paso 9

  return (
    // <Form> Provider envuelve todo

    <Card className="w-full bg-white flex flex-col h-[calc(100vh-10rem)] py-0 gap-0 overflow-hidden">
      {/* Header Fijo */}
      <CardHeader className="border-b sticky top-0 bg-white z-10 px-6 pt-6 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl mb-1">
              {currentStepData?.title || 'Acta MA PRO'}
            </CardTitle>
            {currentStepData?.subtitle && (
              <ShadcnCardDescription className="text-sm text-gray-500 italic font-bold">
                {currentStepData.subtitle}
              </ShadcnCardDescription>
            )}
          </div>
          {/* Botón Guardar (desde paso 3 / índice 2) */}
          {currentStep >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveProgress}
              disabled={isLoading}
            >
              <FiSave className="mr-2 h-4 w-4" />
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          )}
        </div>
        {/* Subtítulos fijos (No aplica para MA) */}
      </CardHeader>
      <Form {...form}>
        {/* <form> nativo */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-hidden relative"
        >
          {/* Contenido desplazable */}
          <div ref={contentScrollRef} className="flex-1 overflow-y-auto p-6">
            {apiError && (
              <Alert variant="destructive">
                <LuTriangleAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            {/* --- Renderizado Explícito Paso por Paso (Contenido de Form-MA) --- */}

            {/* PASO 1 (Índice 0) */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 items-stretch">
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
                />{' '}
                <FormFieldWithExtras
                  name="denominacionCargo"
                  label="Denominación del cargo"
                  subtitle="Ej: Presidencia..."
                />
                <FormFieldWithExtras
                  name="nombreOrgano"
                  label="Nombre del órgano..."
                  subtitle="Ej: INTT..."
                />
                {/* LocationSelector necesita FormProvider */}
                <LocationSelector
                  control={form.control}
                  form={form}
                  estadoFieldName="estadoSuscripcion"
                  ciudadFieldName="ciudadSuscripcion"
                />{' '}
                <FormField
                  control={form.control}
                  name="horaSuscripcion"
                  render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                      {' '}
                      <div>
                        <FormLabel>Hora de suscripción...</FormLabel>
                      </div>{' '}
                      <FormControl className="flex-grow">
                        <ShadcnTimePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="mt-auto" />{' '}
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
                            ? (() => {
                                // Parsea el string 'dd/MM/yyyy' manualmente
                                const [day, month, year] =
                                  field.value.split('/');
                                return new Date(
                                  `${year}-${month}-${day}T00:00:00`
                                );
                              })()
                            : undefined
                        }
                        onChange={(date) => {
                          if (date) {
                            field.onChange(format(date, 'dd/MM/yyyy'));
                          } else {
                            field.onChange(''); // Asegúrate de limpiar si no hay fecha
                          }
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />{' '}
                {/* El campo Dirección necesita ocupar 2 columnas */}
                <div className="md:col-span-2 h-full">
                  <FormFieldWithExtras
                    name="direccionOrgano"
                    label="Dirección exacta..."
                    subtitle="Ej: Av..."
                  />
                </div>
                <div className="md:col-span-2 h-full">
                  <FormField
                    control={form.control}
                    name="motivoEntrega"
                    render={({ field }) => (
                      <FormItem>
                        {' '}
                        <FormLabel>Motivo de la entrega...</FormLabel>{' '}
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un motivo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {' '}
                            {/* Opciones de Form-MA */}
                            <SelectItem value="Renuncia">Renuncia</SelectItem>
                            <SelectItem value="Jubilación">
                              Jubilación
                            </SelectItem>
                            {/*...otras...*/}
                          </SelectContent>
                        </Select>
                        <FormMessage />{' '}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* PASO 2 (Índice 1) */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Servidor Entrante */}
                <h3 className="text-lg font-semibold border-b pb-2">
                  Servidor Público Entrante
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormFieldWithExtras
                    name="nombreServidorEntrante"
                    label="Nombre"
                    subtitle="Ej: Pedro..."
                    validationType="textOnly"
                  />
                  <FormField
                    control={form.control}
                    name="cedulaServidorEntrante"
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
                  />{' '}
                  <FormFieldWithExtras
                    name="profesionServidorEntrante"
                    label="Profesión"
                    subtitle="Ej: Contador..."
                    validationType="textOnly"
                  />
                  <FormFieldWithExtras
                    name="designacionServidorEntrante"
                    label="Datos de designación"
                    subtitle="Ej: Resolución..."
                  />
                </div>
                {/* Auditor */}
                <h3 className="text-lg font-semibold border-b pb-2">Auditor</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormFieldWithExtras
                    name="nombreAuditor"
                    label="Nombre"
                    subtitle="Ej: Pedro..."
                    validationType="textOnly"
                  />
                  <FormField
                    control={form.control}
                    name="cedulaAuditor"
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
                  />{' '}
                  <FormFieldWithExtras
                    name="profesionAuditor"
                    label="Profesión"
                    subtitle="Ej: Contador..."
                    validationType="textOnly"
                  />
                </div>
                {/* Testigos */}
                <h3 className="text-lg font-semibold border-b pb-2">
                  Testigos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-4 p-4 border rounded-md">
                    <p className="font-medium">Testigo N° 1</p>
                    {/* Campos Testigo 1 */}
                  </div>
                  <div className="space-y-4 p-4 border rounded-md">
                    <p className="font-medium">Testigo N° 2</p>
                    {/* Campos Testigo 2 */}
                  </div>
                </div>
                {/* Servidor Saliente */}
                <h3 className="text-lg font-semibold border-b pb-2">
                  Servidor Público Saliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Campos Servidor Saliente */}
                </div>
              </div>
            )}

            {/* PASOS 3 a 8 (Índices 2 a 7) - Usar SiNoQuestion */}
            {currentStep >= 2 && currentStep <= 7 && (
              <div className="space-y-4">
                {steps[currentStep].fields.map((fieldName) => (
                  <SiNoQuestion
                    key={fieldName}
                    name={fieldName}
                    // Obtener label de acta-ma-constants (puede requerir ajuste en constants)
                    label={fieldName
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())} // Generar label básico
                    // Opciones fijas para MA
                    options={['SI', 'NO']}
                  />
                ))}
              </div>
            )}

            {/* PASO 9 (Índice 8) - ANEXOS ADICIONALES (DINÁMICO) */}
            {currentStep === 8 && (
              <div className="space-y-6">
                {/* Campo Anexo_VI (Textarea de Form-MA) */}
                <FormField
                  control={form.control}
                  name="Anexo_VI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cualquier otra información o documentación...
                      </FormLabel>
                      <ShadcnCardDescription className="text-xs">
                        ...
                      </ShadcnCardDescription>
                      <FormControl>
                        <Textarea
                          placeholder="..."
                          {...field}
                          maxLength={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Dropdown Anexo_VII */}
                <FormField
                  control={form.control}
                  name="Anexo_VII"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        ANEXOS ADICIONALES (Según Tipo de Entidad)
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un anexo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {anexosAdicionalesTitulos.map((anexo) => (
                            <SelectItem
                              key={anexo.longTitle}
                              value={anexo.longTitle}
                            >
                              {anexo.shortTitle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Renderizado Condicional del Contenido Dinámico */}
                {selectedAnexo &&
                  selectedAnexo !== 'NO APLICA' &&
                  dynamicStepContent[selectedAnexo] && (
                    <div className="mt-6 space-y-4 border-t pt-6">
                      <h3 className="font-semibold text-lg">
                        {dynamicStepContent[selectedAnexo].title}
                      </h3>
                      <p className="text-sm italic text-gray-500">
                        {dynamicStepContent[selectedAnexo].subtitle}
                      </p>
                      {dynamicStepContent[selectedAnexo].type === 'questions' &&
                        dynamicStepContent[selectedAnexo].questions.map((q) => (
                          <SiNoQuestion
                            key={q.name}
                            name={q.name}
                            label={q.label}
                            options={['SI', 'NO']}
                          /> // MA usa SI/NO
                        ))}
                      {dynamicStepContent[selectedAnexo].type ===
                        'textarea' && (
                        <FormField
                          control={form.control}
                          name={dynamicStepContent[selectedAnexo].fieldName}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder={`Describa aquí...`}
                                  {...field}
                                  rows={8}
                                  maxLength={500}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}
              </div>
            )}

            {/* PASO 10 (Índice 9) - FINAL */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="interesProducto"
                  label="Nos complace que haya completado su acta..."
                  options={['SI', 'NO']}
                />
                {/* Mensaje de finalización condicional (opcional) */}
              </div>
            )}
          </div>{' '}
          {/* Fin div scrollable */}
          {/* Botón submit oculto */}
          <button
            type="submit"
            className="hidden"
            id="ma-pro-submit-button"
          ></button>
        </form>{' '}
        {/* Fin <form> */}
      </Form>{' '}
      {/* Fin <Form> */}
      {/* Footer Fijo con Paginación */}
      <CardFooter className="border-t sticky bottom-0 bg-white z-10 p-4">
        <div className="flex items-center justify-between w-full">
          {/* Columna Izquierda (Anterior) */}
          <div className="w-1/4 flex justify-start">
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                prevStep();
              }}
              className={cn(
                'cursor-pointer',
                currentStep === 0 && 'pointer-events-none opacity-50'
              )}
            >
              Anterior
            </PaginationPrevious>
          </div>
          {/* Columna Central (Paginación) */}
          <div className="flex w-1/2 justify-center">
            <Pagination>
              <PaginationContent>{renderPaginationItems()}</PaginationContent>
            </Pagination>
          </div>
          {/* Columna Derecha (Siguiente/Finalizar) */}
          <div className="w-1/4 flex justify-end">
            {currentStep < steps.length - 1 ? (
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit(nextStep)();
                }}
                className={cn(
                  'cursor-pointer',
                  isLoading && 'pointer-events-none opacity-50'
                )}
              >
                Siguiente
              </PaginationNext>
            ) : (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                variant="default"
                className="cursor-pointer shadow-sm"
              >
                {isLoading ? 'Enviando...' : 'Crear Acta (PRO)'}
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
      {/* Diálogo de éxito */}
      <SuccessAlertDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title={dialogContent.title}
        description={dialogContent.description}
        onConfirm={() => {
          setShowSuccessDialog(false);
          router.push('/dashboard');
        }}
      />
    </Card>
  );
}
