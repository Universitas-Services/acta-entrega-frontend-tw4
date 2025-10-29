'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm, useFormState } from 'react-hook-form';
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
import { useState, useEffect, useRef, useCallback } from 'react';
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
import { LuTriangleAlert, LuBadgeAlert } from 'react-icons/lu';
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
import { BsSave } from 'react-icons/bs';
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
import { CiCircleCheck } from 'react-icons/ci';

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
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [alertContent, setAlertContent] = useState({
    message: '',
    action: () => {},
  });
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref para el timeout del alert
  const remainingTimeRef = useRef(8000); // Duración total del auto-cierre
  const startTimeRef = useRef(0);
  const [erroredSteps, setErroredSteps] = useState<number[]>([]);

  useEffect(() => {
    setTitle('Acta Máxima Autoridad (PRO)'); // Título específico
  }, [setTitle]);

  const form = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(actaMaximaAutoridadSchema),
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
  const watchedValues = form.watch(); // Observa todos los valores del formulario

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

  // --- useEffect para que el Alert desaparezca solo ---
  useEffect(() => {
    // Si hay un temporizador previo, lo limpiamos para evitar duplicados
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    // Si el alert debe mostrarse, iniciamos un nuevo temporizador
    if (showValidationAlert) {
      alertTimeoutRef.current = setTimeout(() => {
        setShowValidationAlert(false);
      }, 8000); // El alert se ocultará después de 8 segundos
    }

    // Función de limpieza: se ejecuta cuando el componente se desmonta
    // o cuando showValidationAlert cambia.
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [showValidationAlert]); // Este efecto depende del estado de visibilidad del alert

  // -- Funciones para manejar la animación de salida del Alert ---
  const hideAlert = useCallback(() => {
    setShowValidationAlert(false);
  }, []);

  // --- Lógica de pausa y reanudación del temporizador ---
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    alertTimeoutRef.current = setTimeout(hideAlert, remainingTimeRef.current);
  }, [hideAlert]);

  const pauseTimer = useCallback(() => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
      const elapsedTime = Date.now() - startTimeRef.current;
      remainingTimeRef.current -= elapsedTime;
    }
  }, []);

  // useEffect para iniciar el temporizador cuando el alert aparece
  useEffect(() => {
    if (showValidationAlert) {
      remainingTimeRef.current = 8000;
      startTimer();
    }
    // La función de limpieza no necesita cambiar
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [showValidationAlert, startTimer]); // Array de dependencias corregido y completo

  // --- Manejador de errores para la validación final ---
  const onFormInvalid = (errors: FieldErrors<FormData>) => {
    const errorFields = Object.keys(errors);

    // Si no hay campos con error, no hacer nada (medida de seguridad)
    if (errorFields.length === 0) return;

    const stepsWithErrors: number[] = [];
    steps.forEach((step, index) => {
      const fieldsToCheck = [...(step.fields as string[])];
      if (index === 8) {
        const selectedAnexo = getValues('Anexo_VII');
        if (selectedAnexo && selectedAnexo !== 'NO APLICA') {
          const dynamicContent =
            dynamicStepContent[selectedAnexo as keyof DynamicContent];
          if (dynamicContent?.type === 'questions') {
            fieldsToCheck.push(...dynamicContent.questions.map((q) => q.name));
          } else if (dynamicContent?.type === 'textarea') {
            fieldsToCheck.push(dynamicContent.fieldName);
          }
        }
      }
      const stepHasError = fieldsToCheck.some((field) =>
        errorFields.includes(field)
      );
      if (stepHasError) {
        stepsWithErrors.push(index + 1);
      }
    });

    if (stepsWithErrors.length > 0) {
      setErroredSteps(stepsWithErrors);
      const firstErrorStepIndex = stepsWithErrors[0] - 1;
      const alertMessage =
        stepsWithErrors.length === 1
          ? `Te faltan campos por llenar en el Paso ${stepsWithErrors[0]}.`
          : `Te faltan campos por llenar en los Pasos: ${stepsWithErrors.join(', ')}.`;

      // Crear el toast con un botón de acción
      setAlertContent({
        message: alertMessage,
        action: () => {
          hideAlert();
          setCurrentStep(firstErrorStepIndex);
          setShowValidationAlert(false); // Ocultar el alert después de hacer clic

          setTimeout(() => {
            const stepFields = steps[firstErrorStepIndex]?.fields || [];
            const firstErrorFieldInStep =
              (stepFields as string[]).find((field) =>
                errorFields.includes(field)
              ) || errorFields[0];

            if (firstErrorFieldInStep) {
              const element = document.getElementById(firstErrorFieldInStep);
              const formItem = element?.closest<HTMLElement>(
                '.flex.flex-col, .space-y-4.p-4.border.rounded-md, [data-slot="form-item"], FormItem'
              );
              const target = formItem || element;

              if (contentScrollRef.current && target) {
                const containerRect =
                  contentScrollRef.current.getBoundingClientRect();
                const itemRect = target.getBoundingClientRect();
                const itemTopInContainer =
                  itemRect.top -
                  containerRect.top +
                  contentScrollRef.current.scrollTop;
                const desiredScrollTop =
                  itemTopInContainer -
                  contentScrollRef.current.clientHeight / 2 +
                  target.clientHeight / 2;

                contentScrollRef.current.scrollTo({
                  top: desiredScrollTop,
                  behavior: 'smooth',
                });
              }
            }
          }, 100);
        },
      });
      // Muestra el Alert
      setShowValidationAlert(true);
    }
  };

  const contentScrollRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función de Guardar
  const handleSaveProgress = async () => {
    // Convertir a async si llamas a API
    console.log('Guardando progreso...', getValues());
    setIsLoading(true); // Indicar carga
    // Aquí iría la lógica REAL para guardar en backend
    // Simulamos un guardado exitoso
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular llamada a API
      toast.success('Progreso guardado exitosamente.');
      setIsSavedOnce(true); // <-- Marcar como guardado
      // Opcional: podrías querer resetear el estado 'isDirty' después de guardar
      // form.reset({}, { keepValues: true }); // Resetea 'isDirty' manteniendo valores
      // setIsDirty(false); // O forzarlo manualmente
    } catch (error) {
      toast.error('Error al guardar el progreso.');
    } finally {
      setIsLoading(false);
    }
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
      const errors = form.formState.errors;
      const firstErrorField = fieldsToValidate.find((field) => errors[field]);

      if (firstErrorField) {
        const mainContent = contentScrollRef.current;
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

          toast.warning(
            'Por favor, completa todos los campos requeridos en este paso.'
          );
        }
      }
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

  // --- Lógica de paginación ---
  const totalSteps = steps.length;
  const currentPage = currentStep + 1;
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 1; // Número de páginas visibles alrededor de la actual

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
      const isErrored = erroredSteps.includes(pageNum);
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
                  'pointer-events-none opacity-50 text-muted-foreground',
                isErrored &&
                  'bg-red-100 text-red-700 border border-red-300 shadow-sm shadow-red-200 hover:bg-red-200'
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

  useEffect(() => {
    // Solo ejecutamos esta lógica si hay errores que estamos rastreando.
    if (erroredSteps.length === 0) return;

    const checkErroredSteps = async () => {
      const stillErrored: number[] = [];
      // Usamos Promise.all para validar todos los pasos con errores en paralelo.
      await Promise.all(
        erroredSteps.map(async (stepNum) => {
          const stepIndex = stepNum - 1;
          const fieldsToValidate = steps[stepIndex]
            ?.fields as (keyof FormData)[];
          // Disparamos la validación solo para los campos de este paso.
          const isStepValid = await form.trigger(fieldsToValidate);

          if (!isStepValid) {
            stillErrored.push(stepNum);
          }
        })
      );
      // Actualizamos el estado solo si la lista de errores ha cambiado.
      if (stillErrored.length !== erroredSteps.length) {
        setErroredSteps(stillErrored);
      }
    };

    // Debounce: esperamos 500ms después de que el usuario deje de escribir para validar.
    const debounceTimeout = setTimeout(checkErroredSteps, 500);

    // Limpieza: cancelamos el timeout si el usuario sigue escribiendo.
    return () => clearTimeout(debounceTimeout);
  }, [watchedValues, erroredSteps, form]); // Dependemos de los valores y la lista de errores.

  // --- Renderizado Condicional del Contenido ---
  const currentStepData = steps[currentStep];
  const selectedAnexo = watch('Anexo_VII') as
    | keyof DynamicContent
    | 'NO APLICA'
    | undefined
    | ''; // Para el paso 9

  return (
    <>
      {/* --- Alert flotante personalizado --- */}
      {showValidationAlert && (
        <Alert
          variant="destructive"
          onMouseEnter={pauseTimer}
          onMouseLeave={startTimer}
          className="relative pr-10 fixed top-5 right-5 z-50 w-full max-w-md animate-in fade-in-90 slide-in-from-top-4 shadow-lg shadow-red-500/15"
        >
          <LuBadgeAlert className="h-4 w-4" />
          <AlertTitle>Campos Incompletos</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            {alertContent.message}
            <Button
              variant="destructive"
              size="sm"
              onClick={alertContent.action}
              className="flex-shrink-0 cursor-pointer"
            >
              Ir al error
            </Button>
          </AlertDescription>
          <button
            onClick={() => setShowValidationAlert(false)}
            className="absolute top-2 right-2 p-1 rounded-md text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Cerrar alerta"
          ></button>
        </Alert>
      )}
      <Card className="w-full bg-white flex flex-col h-[calc(100vh-10rem)] gap-0 overflow-hidden">
        {/* Header Fijo */}
        <CardHeader className="border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-1">
                {currentStepData?.title || 'Acta MA PRO'}
              </CardTitle>
              <ShadcnCardDescription className="text-sm font-bold text-g5 italic whitespace-pre-line">
                {currentStepData?.subtitle}
              </ShadcnCardDescription>
            </div>
            {/* Botón Guardar (desde paso 3 / índice 2) */}
            {currentStep >= 2 && (
              <Button
                size="sm"
                onClick={handleSaveProgress}
                disabled={isLoading}
                className="cursor-pointer shadow-xs border bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold"
              >
                <BsSave className="mr-2 h-4 w-4" />
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            )}
          </div>
        </CardHeader>
        <Form {...form}>
          {/* <form> nativo */}
          <form
            noValidate // Previene la validación HTML5 nativa
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Contenido desplazable */}
            <div ref={contentScrollRef} className="flex-1 overflow-y-auto p-6">
              {apiError && (
                <Alert variant="destructive">
                  <LuTriangleAlert className="h-4 w-4" />
                  <AlertTitle>Error al Crear el Acta</AlertTitle>
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}

              {/* PASO 1 (Índice 0) */}
              {currentStep === 0 && (
                <div className="space-y-8">
                  {/* --- Primera Sección: Identificación --- */}
                  <div className="space-y-4 border rounded-lg">
                    <div className="mb-4 p-4">
                      <h3 className="font-bold text-lg">
                        Identificación del cargo y organismo
                      </h3>
                      <p className="text-sm text-gray-500 italic font-bold">
                        Artículo 10.2 Resolución CGR N.º 01-000162 de fecha
                        27-07-2009
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-4 pb-4">
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
                              RIF del órgano, entidad, oficina o dependencia de
                              la Administración Pública
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
                  <div className="space-y-4 border rounded-lg">
                    <div className="mb-4 p-4">
                      <h3 className="font-bold text-lg">
                        Detalles de la suscripción del acta
                      </h3>
                      <p className="text-sm text-gray-500 italic font-bold">
                        Artículo 10.1 Resolución CGR N.º 01-000162 de fecha
                        27-07-2009
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-4 pb-4">
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
                                Motivo de la entrega del órgano, entidad,
                                oficina o dependencia de la Administración
                                Pública
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
                                  <SelectItem value="Ascenso">
                                    Ascenso
                                  </SelectItem>
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

              {/* PASO 2 (Índice 1) */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Servidor Público Designado
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormFieldWithExtras
                      name="nombreServidorEntrante"
                      label="Nombre"
                      subtitle="Ej: Pedro Jose Rodríguez Hernández"
                      maxLength={50}
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
                    />
                    <FormFieldWithExtras
                      name="profesionServidorEntrante"
                      label="Profesión"
                      subtitle="Ej: Contador, Ingeniero, Abogado"
                      maxLength={50}
                      validationType="textOnly"
                    />
                    <FormFieldWithExtras
                      name="designacionServidorEntrante"
                      label="Datos de designación"
                      subtitle="Ej: Resolución N° 000/00 de fecha 00-00-0000 publicado en Gaceta N° 0000 de fecha 00-00-0000"
                      maxLength={150}
                    />
                  </div>
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Auditor
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormFieldWithExtras
                      name="nombreAuditor"
                      label="Nombre"
                      subtitle="Ej: Pedro José Rodríguez Hernández"
                      maxLength={50}
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
                    />
                    <FormFieldWithExtras
                      name="profesionAuditor"
                      label="Profesión"
                      subtitle="Ej: Contador, Ingeniero, Abogado"
                      maxLength={50}
                      validationType="textOnly"
                    />
                  </div>
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Testigos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-4 p-4 border rounded-md">
                      <p className="font-medium">Testigo N° 1</p>
                      <FormFieldWithExtras
                        name="nombreTestigo1"
                        label="Nombre"
                        subtitle="Ej: Pedro José Rodríguez Hernández"
                        maxLength={50}
                        validationType="textOnly"
                      />
                      <FormField
                        control={form.control}
                        name="cedulaTestigo1"
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
                        name="profesionTestigo1"
                        label="Profesión"
                        subtitle="Ej: Contador, Ingeniero, Abogado"
                        maxLength={50}
                        validationType="textOnly"
                      />
                    </div>
                    <div className="space-y-4 p-4 border rounded-md">
                      <p className="font-medium">Testigo N° 2</p>
                      <FormFieldWithExtras
                        name="nombreTestigo2"
                        label="Nombre"
                        subtitle="Ej: Pedro José Rodríguez Hernández"
                        maxLength={50}
                        validationType="textOnly"
                      />
                      <FormField
                        control={form.control}
                        name="cedulaTestigo2"
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
                        name="profesionTestigo2"
                        label="Profesión"
                        subtitle="Ej: Contador, Ingeniero, Abogado"
                        maxLength={50}
                        validationType="textOnly"
                      />
                    </div>
                  </div>
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
                      subtitle="Ej: Resolución N° 000/00 de fecha 00-00-0000 publicado en Gaceta N° 0000 de fecha 00-00-0000"
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
                          Cualquier otra información o documentación que se
                          considere necesaria indicando la fecha de corte.
                        </FormLabel>
                        <ShadcnCardDescription className="text-xs">
                          Está referida a que además de los documentos
                          requeridos de manera estándar, las partes involucradas
                          pueden aportar datos adicionales que puedan influir en
                          la evaluación o decisión del organismo
                          correspondiente. La fecha de corte es crucial porque
                          establece un límite temporal para la información
                          presentada, asegurando que todas las partes estén en
                          la misma página respecto a la temporalidad de los
                          datos.
                        </ShadcnCardDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Describa aquí la información adicional..."
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
                      <FormItem className="pt-2">
                        <FormLabel>ANEXOS ADICIONALES</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Seleccione un anexo..." />
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
                        {dynamicStepContent[selectedAnexo].type ===
                          'questions' &&
                          dynamicStepContent[selectedAnexo].questions.map(
                            (q) => (
                              <SiNoQuestion
                                key={q.name}
                                name={q.name}
                                label={q.label}
                              />
                            )
                          )}
                        {dynamicStepContent[selectedAnexo].type ===
                          'textarea' && (
                          <FormField
                            control={form.control}
                            name={dynamicStepContent[selectedAnexo].fieldName}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder={`Describa aquí la información sobre el ${dynamicStepContent[selectedAnexo].title.toLowerCase()}...`}
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
                    label="Nos complace que haya completado su acta. ¿Le gustaría recibir información para obtener la versión Pro con acceso a funcionalidades avanzadas?"
                    options={['SI', 'NO']}
                  />
                  {/* Mensaje de finalización condicional */}
                  {form.watch('interesProducto') && ( // Mostrar si ya se respondió
                    <div className="text-center p-6 mt-8 bg-gray-50 rounded-lg border border-dashed transition-opacity duration-500">
                      <CiCircleCheck className="mx-auto h-12 w-12 text-green5" />
                      <h3 className="mt-4 text-xl font-semibold text-g8">
                        ¡Ha completado el formulario!
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Ha llenado exitosamente el acta de entrega. Por favor,
                        revise los datos en los pasos anteriores usando el botón
                        Anterior.
                        <br />
                        Una vez que esté seguro, presione <b>Crear acta</b> para
                        generar el documento final.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Fin div scrollable */}
            {/* Botón submit oculto */}
            <button
              type="submit"
              className="hidden"
              id="ma-pro-submit-button"
              onClick={form.handleSubmit(onSubmit)}
            ></button>
          </form>{' '}
          {/* Fin <form> */}
        </Form>{' '}
        {/* Fin <Form> */}
        {/* Footer Fijo con Paginación */}
        <CardFooter className="border-t sticky bottom-0 bg-white z-10">
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
                  'text-foreground cursor-pointer shadow-md shadow-gray-500/50 active:shadow-inner transition-all bg-button-anterior hover:bg-accent',
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
                    nextStep();
                  }}
                  className={cn(
                    'text-white cursor-pointer shadow-lg shadow-blue-500/50 active:shadow-inner transition-all bg-primary hover:bg-primary/90 hover:text-white',
                    isLoading && 'pointer-events-none opacity-50'
                  )}
                >
                  Siguiente
                </PaginationNext>
              ) : (
                <Button
                  type="button"
                  form="ma-pro-form"
                  onClick={form.handleSubmit(onSubmit, onFormInvalid)}
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
    </>
  );
}
