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
import { useRouter, useSearchParams } from 'next/navigation';
import { useHeader } from '@/context/HeaderContext';
import { Textarea } from '@/components/ui/textarea';
import { InputCompuesto } from '../InputCompuesto';
import { LocationSelector } from '../LocationSelector';
import { ShadcnDatePicker } from '../DatePicker';
import { ShadcnTimePicker } from '../TimePicker';
import { SiNoQuestion } from '../SiNoQuestion';
import { SuccessAlertDialog } from '../SuccessAlertDialog';
import {
  createActaSalientePro,
  getActaById,
  updateActa,
} from '@/services/actasService';
import { actaSalienteProSchema } from '@/lib/schemas';
import { LuTriangleAlert, LuBadgeAlert } from 'react-icons/lu';
import {
  steps,
  anexosAdicionalesTitulos,
  dynamicStepContent,
  type DynamicContent,
} from '@/lib/pro/acta-saliente-pro-constants';
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
import { Spinner } from '@/components/ui/spinner';

// Tipado del formulario usando el schema importado
type FormData = z.infer<typeof actaSalienteProSchema>;

export function ActaSalienteProForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlActaId = searchParams.get('id'); // ID que viene de la URL (si recargas la página)
  const { setTitle } = useHeader();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSavedOnce, setIsSavedOnce] = useState(false); // Estado de guardado
  const [alertContent, setAlertContent] = useState({
    message: '',
    action: () => {},
  });
  const [erroredSteps, setErroredSteps] = useState<number[]>([]);
  const [isFormGloballyValid, setIsFormGloballyValid] = useState(false);

  // --- ESTADO PARA RASTREAR EL PASO 3 ---
  const [hasReachedStep3, setHasReachedStep3] = useState(false);

  // --- OBTENER ACCIONES DEL STORE ---
  const { setFormState, clearFormState } = useFormDirtyStore();

  // Estado para saber si estamos cargando datos iniciales (si hay ID)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(!!urlActaId);
  // Referencia para guardar el ID inmediatamente después de crear (sin esperar re-render)
  const lastSavedIdRef = useRef<string | null>(null);
  // Escudo para evitar que el useEffect de carga se dispare justo después de guardar
  const shouldSkipLoadRef = useRef<boolean>(false);
  // Referencia para evitar la doble carga en modo desarrollo
  const dataLoadedRef = useRef<string | null>(null);

  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle('Acta de entrega del servidor público SALIENTE');
  }, [setTitle]);

  const form = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(actaSalienteProSchema),
    shouldUnregister: false,
    defaultValues: {
      tiempoRealizacion: undefined as unknown as number,
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
      // Paso final
    },
  });

  // Lógica de Carga de Datos (GET)
  useEffect(() => {
    // Si el escudo está levantado (acabamos de crear), IGNORAMOS este efecto.
    if (shouldSkipLoadRef.current) {
      shouldSkipLoadRef.current = false; // Bajamos el escudo para el futuro
      return;
    }

    // Carga normal: Si hay ID en la URL, pedimos datos al backend.
    if (urlActaId) {
      // Si ya cargamos este ID específico en este ciclo de vida, no hacemos nada.
      if (dataLoadedRef.current === urlActaId) {
        return;
      }
      // Marcamos inmediatamente este ID como "en proceso de carga"
      dataLoadedRef.current = urlActaId;
      // Bajamos el escudo para el futuro
      setIsLoadingData(true);
      const loadData = async () => {
        try {
          const acta = await getActaById(urlActaId);

          if (acta && acta.metadata) {
            form.reset(acta.metadata);
            setIsSavedOnce(true);
            // Actualizamos la referencia para estar sincronizados
            lastSavedIdRef.current = acta.id;

            // Esperar a que form.reset() complete su procesamiento
            // antes de ejecutar la validación. Esto previene la race condition
            // donde form.trigger() se ejecuta antes de que los valores estén disponibles.
            setTimeout(async () => {
              // --- Validación para redirigir al primer paso incompleto ---
              let targetStepIndex = 0;
              for (let i = 0; i < steps.length; i++) {
                const stepConfig = steps[i];
                const baseFields = stepConfig.fields;
                const currentFieldsArray: (keyof FormData)[] = Array.isArray(
                  baseFields
                )
                  ? (baseFields as (keyof FormData)[])
                  : [];

                let fieldsToValidate: (keyof FormData)[] = currentFieldsArray;

                // Lógica específica para paso 9 (índice 8) - Anexos Adicionales
                if (i === 8) {
                  const selectedKey = form.getValues('Anexo_VII');
                  if (selectedKey && selectedKey !== 'NO APLICA') {
                    const dynamicContent =
                      dynamicStepContent[selectedKey as keyof DynamicContent];
                    if (dynamicContent) {
                      if (dynamicContent.type === 'questions') {
                        const dynamicFields = dynamicContent.questions.map(
                          (q) => q.name
                        );
                        fieldsToValidate = [
                          ...currentFieldsArray,
                          ...dynamicFields,
                        ];
                      } else if (dynamicContent.type === 'textarea') {
                        fieldsToValidate = [
                          ...currentFieldsArray,
                          dynamicContent.fieldName,
                        ];
                      }
                    }
                  }
                }

                if (fieldsToValidate.length > 0) {
                  // Validar silenciosamente
                  const isStepValid = await form.trigger(fieldsToValidate, {
                    shouldFocus: false,
                  });
                  if (!isStepValid) {
                    targetStepIndex = i;
                    // Limpiamos los errores para que no se muestren al usuario al entrar
                    form.clearErrors(fieldsToValidate);
                    break; // Encontramos el primero con error
                  }
                }
              }
              setCurrentStep(targetStepIndex);

              toast.success('Datos cargados correctamente.');
            }, 350); // 350ms es suficiente para que React Hook Form procese el reset
          }
        } catch (error) {
          console.error(error);
          toast.error('Error al cargar los datos.');
        } finally {
          setIsLoadingData(false);
        }
      };
      loadData();
    }
  }, [urlActaId, form]);

  // --- LÓGICA DE GUARDADO CENTRALIZADA ---
  const handleSaveOrUpdate = async (
    isFinalSubmission: boolean = false,
    showToast: boolean = true
  ): Promise<boolean> => {
    setIsLoading(true);
    setApiError(null);

    const currentData = form.getValues();

    try {
      let response;

      // DETERMINAR EL ID:
      // Prioridad 1: ID guardado en memoria (acabamos de crear el acta hace un segundo).
      // Prioridad 2: ID en la URL (cargamos el acta desde el dashboard).
      const existingId = lastSavedIdRef.current || urlActaId;

      if (existingId) {
        // --- CASO ACTUALIZAR (PATCH) ---
        console.log('Actualizando acta existente ID:', existingId);
        // Actualizar el acta existente
        response = await updateActa(existingId, currentData);

        if (showToast) {
          toast.success(
            isFinalSubmission
              ? 'Acta actualizada y finalizada.'
              : 'Cambios guardados correctamente.'
          );
        }
      } else {
        // --- CASO CREAR (POST) ---
        console.log('Creando nueva acta...');
        response = await createActaSalientePro(currentData);

        // Guardamos el ID en memoria INMEDIATAMENTE para el próximo clic
        lastSavedIdRef.current = response.id;

        // Levantamos el escudo para que el useEffect no recargue la data que ya tenemos
        shouldSkipLoadRef.current = true;

        // Actualizamos la URL silenciosamente para que si el usuario refresca, tenga el ID
        const newUrl = `${window.location.pathname}?id=${response.id}`;
        router.replace(newUrl, { scroll: false });

        setIsSavedOnce(true);
        if (showToast) {
          toast.success('Borrador creado exitosamente.');
        }
      }

      if (isFinalSubmission) {
        setDialogContent({
          title: `¡Acta de Entrega procesada!`,
          description: 'Su documento ha sido guardado exitosamente.',
        });
        setShowSuccessDialog(true);
      }

      return true;
    } catch (error) {
      console.error('Error al guardar:', error);
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      setApiError(msg);
      toast.error(`Error: ${msg}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Wrappers para botones ---
  const handleSaveProgress = useCallback(async () => {
    return await handleSaveOrUpdate(false, true);
  }, [form, urlActaId]); // Dependencias

  const handleSaveAndExit = async () => {
    // Definimos la promesa que ejecutará toast.promise
    const savePromise = async () => {
      // Llamamos a guardar, pero SILENCIOSO (showToast = false)
      const success = await handleSaveOrUpdate(false, false);

      if (!success) {
        throw new Error('No se pudo guardar el acta.');
      }

      // Pequeño delay artificial (800ms) para que el usuario lea "Guardando..."
      // Esto evita el "flickeo" rápido y da sensación de proceso robusto.
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Redirección
      router.push('/dashboard/panel-de-actas/elaboracion');
    };

    // Ejecutamos el Toast con estados
    toast.promise(savePromise(), {
      loading: 'Guardando cambios y redirigiendo al panel...',
      success: 'Datos guardados correctamente. Redirigiendo...',
      error: 'Ocurrió un error al intentar guardar y salir.',
    });
  };

  const onSubmit = async (data: FormData) => {
    await handleSaveOrUpdate(true, true);
  };

  const { isDirty } = useFormState({ control: form.control });
  const { watch, getValues, trigger } = form; // Necesitamos watch y getValues para el paso dinámico
  const watchedValues = form.watch(); // Observa todos los valores del formulario

  // Se llama cuando la validación global es exitosa
  const onValidationSuccess = () => {
    setErroredSteps([]); // Limpia los pasos en rojo
    setIsFormGloballyValid(true); // Activa el botón "Crear Acta"
  };

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
      setErroredSteps(stepsWithErrors); // Actualiza paginación en rojo
      const firstErrorStepIndex = stepsWithErrors[0] - 1;
      const alertMessage =
        stepsWithErrors.length === 1
          ? `Te faltan campos por llenar en el Paso ${stepsWithErrors[0]}.`
          : `Te faltan campos por llenar en los Pasos: ${stepsWithErrors.join(', ')}.`;

      // Actualiza el contenido para el panel del Paso 10
      setAlertContent({
        message: alertMessage,
        action: () => {
          // La acción para el botón "Ir al error"
          setCurrentStep(firstErrorStepIndex);
          // Lógica de scroll al campo
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
      setIsFormGloballyValid(false); // Desactiva el botón "Crear Acta"
    } else {
      // ESTE ES EL FALLBACK: Hay errores, pero no pudimos mapearlos a un paso.
      // (Con el schema corregido, esto no debería pasar, pero es una buena práctica tenerlo)
      setErroredSteps([]);
      setAlertContent({
        message:
          'Se encontraron errores de validación desconocidos. Revisa la consola para más detalles.',
        action: () => console.error('Errores no mapeados:', errors),
      });
      setIsFormGloballyValid(false);
    }
  };

  // Valida todo el formulario
  const runStep10Validation = async () => {
    const isValid = await form.trigger(); // Valida TODOS los campos
    if (isValid) {
      onValidationSuccess();
    } else {
      // Si es inválido, el resolver ya pobló formState.errors.
      // Solo necesitamos llamar a onFormInvalid para actualizar nuestros estados.
      onFormInvalid(form.formState.errors);
    }
  };

  const scrollToTop = () => {
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Funciones de Navegación (Adaptadas para 10 pasos y salto en Paso 9) ---
  const nextStep = async () => {
    const baseFields = steps[currentStep]?.fields;
    const currentFieldsArray: (keyof FormData)[] = Array.isArray(baseFields) // <-- Tipado corregido
      ? (baseFields as (keyof FormData)[])
      : [];

    let fieldsToValidate: (keyof FormData)[] = currentFieldsArray;

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
      setCurrentStep(8); // Volver al paso ANTERIOR al dropdown (índice 8)
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
          const baseFieldsIntermediate = steps[i]?.fields;
          const currentFieldsArrayIntermediate: (keyof FormData)[] =
            Array.isArray(baseFieldsIntermediate)
              ? (baseFieldsIntermediate as (keyof FormData)[])
              : [];

          let fieldsToValidateIntermediate: (keyof FormData)[] =
            currentFieldsArrayIntermediate;

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
      const isActive = currentPage === pageNum;

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
              isActive={isActive}
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

  // useEffect ahora dispara la validación completa en el Paso 10
  useEffect(() => {
    // Solo re-validamos si estamos en el Paso 10 y los datos cambian
    if (currentStep === 9) {
      const debounceTimeout = setTimeout(runStep10Validation, 500);
      return () => clearTimeout(debounceTimeout);
    }
  }, [watchedValues, currentStep]); // Dependemos de los valores y del paso actual

  // Dispara la validación UNA VEZ al entrar al Paso 10
  useEffect(() => {
    if (currentStep === 9) {
      // 9 es el índice del Paso 10
      runStep10Validation();
    }
  }, [currentStep]); // Se dispara solo cuando currentStep cambia

  // Re-validar pasos con errores en tiempo real
  useEffect(() => {
    // Si no hay errores rastreados, no hacer nada.
    if (erroredSteps.length === 0) return;

    const checkErroredSteps = async () => {
      const stillErrored: number[] = [];

      // Usamos Promise.all para validar todos los pasos con errores en paralelo.
      await Promise.all(
        erroredSteps.map(async (stepNum) => {
          const stepIndex = stepNum - 1;
          const stepConfig = steps[stepIndex];

          if (!stepConfig) return; // Seguridad
          const baseFields = stepConfig.fields;
          const currentFieldsArray: (keyof FormData)[] = Array.isArray(
            baseFields
          )
            ? (baseFields as (keyof FormData)[])
            : [];

          let fieldsToValidate: (keyof FormData)[] = currentFieldsArray;

          if (stepIndex === 8) {
            // Si es el Paso 9 (índice 8)
            const selectedKey = getValues('Anexo_VII');
            if (selectedKey && selectedKey !== 'NO APLICA') {
              const dynamicContent =
                dynamicStepContent[selectedKey as keyof DynamicContent];
              if (dynamicContent) {
                if (dynamicContent.type === 'questions') {
                  const dynamicFields = dynamicContent.questions.map(
                    (q) => q.name
                  );
                  fieldsToValidate = [...currentFieldsArray, ...dynamicFields];
                } else if (dynamicContent.type === 'textarea') {
                  fieldsToValidate = [
                    ...currentFieldsArray,
                    dynamicContent.fieldName,
                  ];
                }
              }
            }
          }

          // Si el paso no tiene campos (como el Paso 10), no lo validamos
          if (fieldsToValidate.length === 0) return;

          // Disparamos la validación solo para los campos de este paso.
          const isStepValid = await form.trigger(fieldsToValidate);

          if (!isStepValid) {
            stillErrored.push(stepNum);
          }
        })
      );

      // Actualizamos el estado solo si la lista de errores ha cambiado.
      // Usamos JSON.stringify para una comparación simple de arrays.
      if (JSON.stringify(stillErrored) !== JSON.stringify(erroredSteps)) {
        setErroredSteps(stillErrored);
      }
    };

    // Debounce: esperamos 500ms después de que el usuario deje de escribir para validar.
    const debounceTimeout = setTimeout(checkErroredSteps, 500);

    // Limpieza: cancelamos el timeout si el usuario sigue escribiendo.
    return () => clearTimeout(debounceTimeout);
  }, [watchedValues, erroredSteps, form, getValues]); // Dependemos de los valores y la lista de errores.

  // --- Renderizado Condicional del Contenido ---
  const currentStepData = steps[currentStep];
  const selectedAnexo = watch('Anexo_VII') as
    | keyof DynamicContent
    | 'NO APLICA'
    | undefined
    | ''; // Para el paso 9

  // --- useEffect PARA RASTREAR EL PASO 3 ---
  useEffect(() => {
    // currentStep es 0-indexado, así que el Paso 3 es el índice 2
    if (currentStep >= 2 && !hasReachedStep3) {
      setHasReachedStep3(true);
    }
  }, [currentStep, hasReachedStep3]);

  // --- useEffect PARA ACTUALIZAR EL STORE GLOBAL ---
  useEffect(() => {
    // Esta función se pasa al store para que el GuardedButton la llame
    const onSave = async () => {
      await handleSaveProgress();
    };

    setFormState({
      isDirty,
      isProForm: true,
      hasReachedStep3,
      // Si existe en la URL o si acabamos de guardar (ref), se pasa. Si no, va null.
      actaId: urlActaId || lastSavedIdRef.current,
      onSave, // Pasamos la función de guardado
    });

    // Al desmontar este componente (al salir de la pág), limpiar el store
    return () => {
      clearFormState();
    };
  }, [
    isDirty,
    hasReachedStep3,
    urlActaId,
    setFormState,
    clearFormState,
    handleSaveProgress,
  ]);

  // --- SPINNER DE CARGA INICIAL---
  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] h-full w-full space-y-4">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="text-lg font-medium text-muted-foreground animate-pulse">
          Cargando datos del acta...
        </p>
      </div>
    );
  }

  return (
    <>
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
                className="cursor-pointer shadow-xs border bg-chillon hover:bg-chillon/80 text-white font-semibold"
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

                  {/* --- Tiempo de Realización del Acta --- */}
                  <div className="space-y-4 border rounded-lg">
                    <div className="mb-4 p-4">
                      <h3 className="font-bold text-lg">
                        Tiempo de Realización del Acta
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 px-4 pb-4">
                      <FormField
                        control={form.control}
                        name="tiempoRealizacion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Seleccione el tiempo de realización
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value?.toString()}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="cursor-pointer">
                                  <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent
                                position="popper"
                                className="bg-white z-50 max-h-60 overflow-y-auto text-black"
                              >
                                <SelectItem value="0">0</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
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
                <div className="text-center p-6 mt-8 bg-gray-50 rounded-lg border border-dashed transition-opacity duration-500">
                  {!isFormGloballyValid ? (
                    // --- VISTA DE ERROR ---
                    <>
                      <LuBadgeAlert className="mx-auto h-12 w-12 text-destructive" />
                      <h3 className="mt-4 text-xl font-semibold text-g8">
                        Campos Incompletos
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {alertContent.message ||
                          'Revisa los pasos anteriores. Hay campos obligatorios sin llenar.'}
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={alertContent.action} // Reutiliza la acción de 'onFormInvalid'
                          className="cursor-pointer"
                        >
                          Ir al primer error
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSaveAndExit} // Nueva función
                          className="cursor-pointer text-black"
                          disabled={isLoading}
                        >
                          {isLoading
                            ? 'Guardando...'
                            : 'Guardar y Salir al Panel'}
                        </Button>
                      </div>
                    </>
                  ) : (
                    // --- VISTA DE ÉXITO ---
                    <>
                      <CiCircleCheck className="mx-auto h-12 w-12 text-green5" />
                      <h3 className="mt-4 text-xl font-semibold text-g8">
                        ¡Has completado el formulario!
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Ha llenado exitosamente el acta de entrega. Por favor,
                        revise los datos en los pasos anteriores usando el botón{' '}
                        <b>Anterior.</b>
                        <br />
                        Una vez que esté seguro, presione <b>Crear acta</b> para
                        generar el documento final.
                      </p>
                    </>
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
                    'text-white cursor-pointer shadow-lg shadow-blue-500/50 active:shadow-inner transition-all bg-chillon hover:bg-chillon/80 hover:text-white',
                    isLoading && 'pointer-events-none opacity-50'
                  )}
                >
                  Siguiente
                </PaginationNext>
              ) : (
                <Button
                  type="button"
                  form="ma-pro-form"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isLoading || !isFormGloballyValid}
                  variant="default"
                  className="text-white cursor-pointer shadow-lg shadow-blue-500/50 active:shadow-inner transition-all bg-chillon hover:bg-chillon/80 hover:text-white"
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
            //setShowSuccessDialog(false);
            router.push('/dashboard/panel-de-actas/elaboracion');
          }}
        />
      </Card>
    </>
  );
}
