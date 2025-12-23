'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';
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
import { SuccessAlertDialog } from '../SuccessAlertDialog';
import { createActaCompliance } from '@/services/actasService';
import {
  complianceSchema,
  ComplianceFormData,
} from '@/lib/pro/compliance-schema';
import { LuTriangleAlert } from 'react-icons/lu';
import {
  steps,
  anexosAdicionalesTitulosCompliance,
  dynamicStepContentCompliance,
  ComplianceDynamicContent,
} from '@/lib/pro/compliance-constants';
import { useFormDirtyStore } from '@/stores/useFormDirtyStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { toast } from 'sonner';
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
import { SiNoQuestion } from '../SiNoQuestion';
import { FormFieldWithExtras } from '../FormFieldWithExtras';
import { ShadcnDatePicker } from '../DatePicker';
import { InputCompuesto } from '../InputCompuesto';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CiCircleCheck } from 'react-icons/ci';
import { useLoaderStore } from '@/stores/useLoaderStore';

export function ComplianceForm() {
  const router = useRouter();
  const { setTitle } = useHeader();
  const [currentStep, setCurrentStep] = useState(0); // Inicia en el paso 0 (índice)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [highestStepVisited, setHighestStepVisited] = useState(currentStep);
  const { showLoader } = useLoaderStore();

  const { setFormState, clearFormState } = useFormDirtyStore();

  useEffect(() => {
    setTitle('Compliance de Actas de Entrega'); // Título específico
  }, [setTitle]);

  const form = useForm<ComplianceFormData>({
    mode: 'onChange',
    resolver: zodResolver(complianceSchema),
    shouldUnregister: false,
    defaultValues: {
      // Inicializar TODOS los campos con string vacío ''
      email: '',
      rifOrgano: '',
      nombreevaluador: '',
      denominacionCargo: '',
      nombreOrgano: '',
      nombreUnidad: '',
      fecha: '',
      nomenclaturaActa: '',
      acta_contiene_lugar_suscripcion: '',
      acta_contiene_fecha_suscripcion: '',
      acta_identifica_organo_entregado: '',
      acta_identifica_servidor_entrega: '',
      acta_identifica_servidor_recibe: '',
      acta_describe_motivo_entrega: '',
      acta_describe_fundamento_legal: '',
      acta_contiene_relacion_anexos_normas: '',
      acta_expresa_integracion_anexos: '',
      acta_suscrita_por_quien_entrega: '',
      acta_suscrita_por_quien_recibe: '',
      anexa_informacion_adicional: '',
      anexos_con_fecha_corte_al_cese: '',
      acta_deja_constancia_inexistencia_info: '',
      acta_especifica_errores_omisiones: '',
      acta_elaborada_original_y_3_copias: '',
      incluye_autorizacion_certificar_copias: '',
      original_archivado_despacho_autoridad: '',
      copia_certificada_entregada_a_servidor_recibe: '',
      copia_certificada_entregada_a_servidor_entrega: '',
      copia_entregada_auditoria_interna_en_plazo: '',
      anexo_estado_cuentas_general: '',
      anexo_situacion_presupuestaria_detallada: '',
      anexo_gastos_comprometidos_no_causados: '',
      anexo_gastos_causados_no_pagados: '',
      anexo_estado_presupuestario_por_partidas: '',
      anexo_estado_presupuestario_por_cuentas: '',
      anexo_estados_financieros: '',
      anexo_balance_comprobacion_y_notas: '',
      anexo_estado_situacion_financiera_y_notas: '',
      anexo_estado_rendimiento_financiero_y_notas: '',
      anexo_estado_movimiento_patrimonio_y_notas: '',
      anexo_relacion_cuentas_por_cobrar: '',
      anexo_relacion_cuentas_por_pagar: '',
      anexo_relacion_fondos_terceros: '',
      anexo_situacion_fondos_anticipo: '',
      anexo_situacion_caja_chica: '',
      anexo_acta_arqueo_caja_chica: '',
      anexo_listado_registro_proveedores: '',
      anexo_reporte_libros_contables: '',
      anexo_reporte_cuentas_bancarias: '',
      anexo_reporte_conciliaciones_bancarias: '',
      anexo_reporte_retenciones_pendientes: '',
      anexo_reporte_contrataciones_publicas: '',
      anexo_reporte_fideicomiso_prestaciones: '',
      anexo_reporte_bonos_vacacionales: '',
      anexo_mencion_numero_cargos_rrhh: '',
      incluye_cuadro_resumen_cargos: '',
      cuadro_resumen_cargos_validado_rrhh: '',
      anexo_reporte_nominas: '',
      anexo_inventario_bienes: '',
      inventario_bienes_fecha_entrega: '',
      inventario_bienes_comprobado_fisicamente: '',
      verificada_existencia_bienes_inventario: '',
      verificada_condicion_bienes_inventario: '',
      inventario_indica_responsable_patrimonial: '',
      inventario_indica_responsable_uso: '',
      inventario_indica_fecha_verificacion: '',
      inventario_indica_numero_acta_verificacion: '',
      inventario_indica_numero_registro_bien: '',
      inventario_indica_codigo_bien: '',
      inventario_indica_descripcion_bien: '',
      inventario_indica_marca_bien: '',
      inventario_indica_modelo_bien: '',
      inventario_indica_serial_bien: '',
      inventario_indica_estado_conservacion_bien: '',
      inventario_indica_ubicacion_bien: '',
      inventario_indica_valor_mercado_bien: '',
      anexo_ejecucion_poa: '',
      incluye_ejecucion_poa_fecha_entrega: '',
      incluye_causas_incumplimiento_metas_poa: '',
      incluye_plan_operativo_anual: '',
      anexo_indice_general_archivo: '',
      archivo_indica_clasificacion: '',
      archivo_indica_ubicacion_fisica: '',
      Anexo_VI: '', // Dropdown Paso 12
      incluye_relacion_montos_fondos_asignados: '',
      incluye_saldo_efectivo_fondos: '',
      incluye_relacion_bienes_asignados: '',
      incluye_relacion_bienes_unidad_bienes: '',
      incluye_estados_bancarios_conciliados: '',
      incluye_lista_comprobantes_gastos: '',
      incluye_cheques_pendientes_cobro: '',
      incluye_reporte_transferencias_bancarias: '',
      anexo_caucion_funcionario_admin: '',
      incluye_cuadro_liquidado_recaudado: '',
      incluye_relacion_expedientes_investigacion: '',
      incluye_situacion_tesoro_nacional: '',
      incluye_ejecucion_presupuesto_nacional: '',
      incluye_monto_deuda_publica_nacional: '',
      incluye_situacion_cuentas_nacion: '',
      incluye_situacion_tesoro_estadal: '',
      incluye_ejecucion_presupuesto_estadal: '',
      incluye_situacion_cuentas_estadal: '',
      incluye_situacion_tesoro_municipal: '',
      incluye_ejecucion_presupuesto_municipal: '',
      incluye_situacion_cuentas_municipal: '',
      incluye_inventario_terrenos_municipales: '',
      incluye_relacion_ingresos_venta_terrenos: '',
      interesProducto: '', // Último paso
    },
  });

  const { watch, getValues } = form; // Necesitamos watch para reaccionar al cambio del dropdown

  const { isDirty } = useFormState({ control: form.control });

  // Observar el valor seleccionado en el dropdown Anexo_VI
  const selectedAnexo = watch('Anexo_VI') as
    | keyof ComplianceDynamicContent
    | undefined
    | ''; // Tipado más preciso

  // Actualizar el useEffect para usar el store
  useEffect(() => {
    // Le decimos al store que el form está "sucio", pero que NO es un formulario Pro
    // (para que muestre el modal de 'unsavedChanges' y no el de 'saveOnExitPro')
    setFormState({
      isDirty: isDirty,
      isProForm: true,
      hasReachedStep3: false,
    });

    // Función de limpieza: se ejecuta cuando el componente se desmonta
    return () => {
      clearFormState();
    };
  }, [isDirty, setFormState, clearFormState]); // Dependencias actualizadas

  // Función onSubmit (placeholder por ahora)
  const onSubmit = async (data: ComplianceFormData) => {
    console.log('DATOS FINALES A ENVIAR:', data);
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await createActaCompliance(data);
      console.log('Respuesta del servidor:', response);

      // Prepara el contenido para el diálogo de éxito
      setDialogContent({
        title: `¡Acta de Entrega N° ${response.numeroCompliance} generada!`,
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

  // Función scrollToTop (modificada para el contenedor de scroll)
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // nextStep (lógica de validación ahora usa los fields correctos)
  const nextStep = async () => {
    // Definir los campos a validar para el paso actual
    let fieldsToValidate = steps[currentStep]?.fields;
    const currentFieldsArray = Array.isArray(fieldsToValidate)
      ? fieldsToValidate
      : [];

    // Lógica específica para validar el paso 12 (índice 11)
    if (currentStep === 11) {
      const selectedKey = form.getValues('Anexo_VI');
      if (selectedKey && selectedKey !== 'NO APLICA') {
        // Asumiendo que 'NO APLICA' existe y permite saltar
        const dynamicContent =
          dynamicStepContentCompliance[
            selectedKey as keyof ComplianceDynamicContent
          ];
        if (dynamicContent && dynamicContent.type === 'questions') {
          // Añadir los campos dinámicos a la validación
          const dynamicFields = dynamicContent.questions.map((q) => q.name);
          fieldsToValidate = [...currentFieldsArray, ...dynamicFields];
        }
      }
    }
    // Asegurarse de que fieldsToValidate es un array
    const fieldsArray = Array.isArray(fieldsToValidate) ? fieldsToValidate : [];

    const isValid = await form.trigger(fieldsArray, { shouldFocus: false });

    if (!isValid) {
      const errors = form.formState.errors;
      const firstErrorField = fieldsArray.find((field) => errors[field]);

      if (firstErrorField) {
        // --- Lógica de scroll estandarizada ---
        const mainContent = contentScrollRef.current;
        const element = document.getElementById(firstErrorField);
        // Selector robusto que busca el contenedor del campo del formulario
        const formItem = element?.closest<HTMLElement>(
          '.flex.flex-col, .space-y-4.p-4.border.rounded-md, [data-slot="form-item"], FormItem'
        );
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

    // Navegar si es válido
    if (currentStep < steps.length - 1) {
      let nextStepIndex = currentStep + 1; // Calcular el siguiente índice
      // Lógica de salto para Paso 11
      if (currentStep === 11 && getValues('Anexo_VI') === 'NO APLICA') {
        nextStepIndex = 12; // Saltar al último paso (índice 12)
      }
      setCurrentStep(nextStepIndex);
      // Actualizar highestStepVisited si es necesario
      setHighestStepVisited(Math.max(highestStepVisited, nextStepIndex));
      scrollToTop();
    }
  };

  const prevStep = () => {
    let prevStepIndex = currentStep - 1; // Calcular índice anterior
    // Lógica de salto al retroceder
    if (currentStep === 12 && getValues('Anexo_VI') === 'NO APLICA') {
      prevStepIndex = 10; // Volver al paso ANTERIOR al dropdown (índice 10)
    }
    if (prevStepIndex >= 0) {
      setCurrentStep(prevStepIndex);
      scrollToTop();
    }
  };

  // Función para ir a un paso específico (paginación)
  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length || stepIndex === currentStep)
      return;

    // Solo permitir ir a pasos ya visitados o anteriores
    if (stepIndex <= highestStepVisited) {
      setCurrentStep(stepIndex);
      scrollToTop();
    } else {
      // Si intenta saltar a un paso futuro no visitado
      toast.info(
        "Por favor, completa los pasos en orden usando el botón 'Siguiente'."
      );
    }
  };

  // --- Lógica para renderizar los números de página ---
  const totalSteps = steps.length;
  const currentPage = currentStep + 1; // Página actual (1-based index)

  // Función para generar los items de paginación
  // Muestra: 1 ... (actual-1) (actual) (actual+1) ... Total
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 1; // Ajusta según necesites

    // --- Lógica de renderizado de números ---
    const pageNumbers: number[] = [];
    // Siempre añadir página 1
    pageNumbers.push(1);

    // Ellipsis inicial y páginas cercanas
    const startEllipsisThreshold = maxVisiblePages + 3; // (1 + max + ellipsis + num)
    if (currentPage > startEllipsisThreshold) {
      pageNumbers.push(-1); // Usar -1 para representar ellipsis
    }
    const rangeStart = Math.max(2, currentPage - maxVisiblePages);
    const rangeEnd = Math.min(totalSteps - 1, currentPage + maxVisiblePages);
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }

    // Ellipsis final y última página
    const endEllipsisThreshold = totalSteps - maxVisiblePages - 2; // (total - max - ellipsis - num)
    if (currentPage < endEllipsisThreshold) {
      pageNumbers.push(-1); // Usar -1 para representar ellipsis
    }
    // Siempre añadir última página (si es diferente de 1)
    if (totalSteps > 1) {
      pageNumbers.push(totalSteps);
    }

    // --- Generar componentes ---
    let lastPushed = 0;
    for (const pageNum of pageNumbers) {
      if (pageNum === -1) {
        // Asegurarse de no añadir ellipsis duplicados
        if (lastPushed !== -1) {
          items.push(<PaginationEllipsis key={`ellipsis-${items.length}`} />);
          lastPushed = -1;
        }
      } else {
        // Lógica para deshabilitar si el índice del paso es mayor al visitado
        const isDisabled = pageNum - 1 > highestStepVisited; // <-- Nueva lógica de deshabilitación
        items.push(
          <PaginationItem key={pageNum}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Solo navegar si no está deshabilitado
                if (!isDisabled) {
                  goToStep(pageNum - 1);
                }
              }}
              isActive={currentPage === pageNum}
              // Aplicar clases de deshabilitado
              className={cn(
                'cursor-pointer',
                currentPage === pageNum && 'font-bold',
                isDisabled &&
                  'pointer-events-none opacity-50 text-muted-foreground' // Clases deshabilitado
              )}
              aria-disabled={isDisabled} // Accesibilidad
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

  // Obteniendo información del paso actual
  const currentStepData = steps[currentStep];

  return (
    // Card principal con flex y altura completa para layout fijo
    <Card className="w-full bg-white flex flex-col h-[calc(100vh-10rem)] gap-0 overflow-hidden">
      {' '}
      {/* Ajusta h si es necesario */}
      <CardHeader className="border-b sticky top-0 bg-white z-10">
        {' '}
        {/* Header fijo */}
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl mb-1">
              {currentStepData?.title || 'Compliance'}
            </CardTitle>
            <ShadcnCardDescription className="text-sm text-g5 italic whitespace-pre-line">
              {currentStepData?.subtitle}
            </ShadcnCardDescription>
          </div>
        </div>
        {/* Subtítulos fijos para Pasos 5 y 6 (Índices 4 y 5) */}
        {currentStep === 4 && ( // PASO 5
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
            <p>
              <strong>Situación presupuestaria</strong>
            </p>
            <p className="italic text-xs">
              Artículo 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.
            </p>
          </div>
        )}
        {currentStep === 5 && ( // PASO 6
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
            <p>
              <strong>Situación financiera y patrimonial</strong>
            </p>
            <p className="italic text-xs">
              Artículo 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.
            </p>
          </div>
        )}
      </CardHeader>
      {/* Contenedor del contenido desplazable */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} // onSubmit va aquí
          className="flex-1 flex flex-col overflow-hidden" // Gestiona espacio vertical
        >
          <div ref={contentScrollRef} className="flex-1 overflow-y-auto p-6">
            {/* Mensaje de error de la API */}
            {apiError && (
              <Alert variant="destructive">
                <LuTriangleAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            {/* PASO 1 (Índice 0) */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
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
                  name="nombreevaluador"
                  label="Nombre completo de la persona que revisa y/o evalúa"
                  subtitle="Ej: Pedro José Hernández Pérez"
                  maxLength={50}
                  validationType="textOnly"
                />
                <FormFieldWithExtras
                  name="denominacionCargo"
                  label="Denominación del Cargo Institucional"
                  subtitle="Ej: Presidencia, Dirección, Coordinación"
                  maxLength={50}
                  validationType="textOnly"
                />
                <FormFieldWithExtras
                  name="nombreOrgano"
                  label="Nombre del órgano, entidad, oficina o dependencia de la Administración Pública"
                  maxLength={50}
                />
                <FormFieldWithExtras
                  name="nombreUnidad"
                  label="Nombre de la unidad u oficina que revisa"
                  maxLength={50}
                  validationType="textOnly"
                />
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha</FormLabel>
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
                />
                <FormFieldWithExtras
                  name="nomenclaturaActa"
                  label="Indique la nomenclatura o código asignado al documento revisado"
                  subtitle="Ej: U.L-001"
                />
              </div>
            )}

            {/* PASO 2 (Índice 1) */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="acta_contiene_lugar_suscripcion"
                  label="1. ¿El acta contiene el lugar de la suscripción?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="acta_contiene_fecha_suscripcion"
                  label="2. ¿El acta contiene fecha de la suscripción?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="acta_identifica_organo_entregado"
                  label="3. ¿El acta contiene la identificación del órgano, entidad, oficina o dependencia que se entrega?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="acta_identifica_servidor_entrega"
                  label="4. ¿En el acta identifica a la persona quien entrega?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="acta_identifica_servidor_recibe"
                  label="5. ¿En el acta se identifica la persona quien recibe?"
                  options={['SI', 'NO']}
                />
              </div>
            )}

            {/* PASO 3 (Índice 2) */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="acta_describe_motivo_entrega"
                  label="6. ¿El acta describe el motivo de la entrega?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="acta_describe_fundamento_legal"
                  label="7. ¿El acta describe la fundamentación legal de la entrega?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="acta_contiene_relacion_anexos_normas"
                  label="8. ¿El acta contiene una relación completa de los anexos que la acompañan y que se mencionan en los artículos 11 al 17 de las Normas que regulan la entrega de órganos, entes y oficinas de la APP?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="acta_expresa_integracion_anexos"
                  label="9. ¿En el acta de entrega se expresa que los anexos forman parte integrante de la misma?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="acta_suscrita_por_quien_entrega"
                  label="10. ¿El acta se encuentra suscrita por parte de quien entrega?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="acta_suscrita_por_quien_recibe"
                  label="11. ¿El acta se encuentra suscrita por parte de quien recibe?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="anexa_informacion_adicional"
                  label="12. ¿Se anexa otra información o documentación que se considere necesaria?"
                />
              </div>
            )}

            {/* PASO 4 (Índice 3) */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexos_con_fecha_corte_al_cese"
                  label="13. ¿Los documentos anexos del acta de entrega presentan la información con fecha de corte al momento del cese en el ejercicio del empleo, cargo o función pública del servidor público que entrega?"
                />
                <SiNoQuestion
                  name="acta_deja_constancia_inexistencia_info"
                  label="14. ¿En el acta de entrega  se deja constancia de la  inexistencia de  información o documentos requeridos en los artículos 10 al 17 de la norma que regula la materia, según corresponda?"
                />
                <SiNoQuestion
                  name="acta_especifica_errores_omisiones"
                  label="15. ¿El acta de entrega específica errores, deficiencias u omisiones en el levantamiento de la misma?"
                />
                <SiNoQuestion
                  name="acta_elaborada_original_y_3_copias"
                  label="16. ¿El acta de entrega y sus anexos fue elaborada en original y tres (03) copias certificadas?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="incluye_autorizacion_certificar_copias"
                  label="17. ¿Se incluye el documento que debidamente autoriza al Servidor Público a certificar las copias del Acta de Entrega?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="original_archivado_despacho_autoridad"
                  label="18. ¿El original del acta de entrega y sus anexos fue archivada en el despacho de  la máxima autoridad jerárquica del órgano o entidad o en la oficina o dependencia que se entrega?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="copia_certificada_entregada_a_servidor_recibe"
                  label="19. ¿Una copia certificada del acta de entrega y sus anexos fue entregada al servidor público que recibe?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="copia_certificada_entregada_a_servidor_entrega"
                  label="20. ¿Una copia certificada del acta de entrega y sus anexos fue entregada al servidor público que entrega?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="copia_entregada_auditoria_interna_en_plazo"
                  label="21. ¿Se entregó una copia certificada del acta de entrega y sus anexos a la unidad de auditoría interna del órgano o entidad dentro de los cinco (05) días hábiles siguientes de la fecha de suscripción de la misma?"
                  options={['SI', 'NO']}
                />
              </div>
            )}

            {/* PASO 5 (Índice 4) */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_estado_cuentas_general"
                  label="22. ¿El Acta de entrega tiene como anexo: Estado de las cuentas que reflejen la situación presupuestaria, financiera y patrimonial, cuando sea aplicable?"
                />
                <SiNoQuestion
                  name="anexo_situacion_presupuestaria_detallada"
                  label="23. ¿El Estado de Situación Presupuestaria  muestra todos los momentos presupuestarios y sus detalles. Incluye: Presupuesto Original, Modificaciones, Presupuesto Modificado, Compromisos, Causado, Pagado, Por Pagar y Presupuesto Disponible a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="anexo_gastos_comprometidos_no_causados"
                  label="24. ¿El Acta de entrega tiene como anexo: Relación de Gastos Comprometidos, no causados a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="anexo_gastos_causados_no_pagados"
                  label="25. ¿El Acta de entrega tiene como anexo: Relación de Gastos Comprometidos, causados y no pagados a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="anexo_estado_presupuestario_por_partidas"
                  label="26. ¿El Acta de entrega tiene como anexo: El Estado Presupuestario del Ejercicio vigente por partidas?"
                />
                <SiNoQuestion
                  name="anexo_estado_presupuestario_por_cuentas"
                  label="27. ¿El Acta de entrega tiene como anexo: El Estado Presupuestario del Ejercicio con los detalles de sus cuentas?"
                />
              </div>
            )}

            {/* PASO 6 (Índice 5) */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_estados_financieros"
                  label="28. ¿El Acta de entrega tiene como anexo: Estados Financieros a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="anexo_balance_comprobacion_y_notas"
                  label="29. ¿El Acta de entrega tiene como anexo: El Balance de Comprobación a la fecha de elaboración de los Estados Financieros y sus notas explicativas a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="anexo_estado_situacion_financiera_y_notas"
                  label="30. ¿El Acta de entrega tiene como anexo: Estado de Situación Financiera / Balance General y sus notas explicativas a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="anexo_estado_rendimiento_financiero_y_notas"
                  label="31. ¿El Acta de entrega tiene como anexo: Estado de Rendimiento Financiero / Estado de Ganancia y Pérdidas y sus notas explicativas a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="anexo_estado_movimiento_patrimonio_y_notas"
                  label="32. ¿El Acta de entrega tiene como anexo: Estado de Movimientos de las Cuentas de Patrimonio y sus notas explicativas a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="anexo_relacion_cuentas_por_cobrar"
                  label="33. ¿El Acta de entrega tiene como anexo: Una Relación de Cuentas por Cobrar a la fecha del Acta de Entrega?"
                />
                <SiNoQuestion
                  name="anexo_relacion_cuentas_por_pagar"
                  label="34. ¿El Acta de entrega tiene como anexo: Una Relación de Cuentas por Pagar a la fecha del Acta de Entrega?"
                />
                <SiNoQuestion
                  name="anexo_relacion_fondos_terceros"
                  label="35. ¿El Acta de entrega tiene como anexo: Una Relación de las Cuentas de los Fondos de Terceros?"
                />
                <SiNoQuestion
                  name="anexo_situacion_fondos_anticipo"
                  label="36. ¿El Acta de entrega tiene como anexo: La Situación de los Fondos en Anticipo?"
                />
                <SiNoQuestion
                  name="anexo_situacion_caja_chica"
                  label="37. ¿El Acta de entrega tiene como anexo: La Situación de la Caja Chica?"
                />
                <SiNoQuestion
                  name="anexo_acta_arqueo_caja_chica"
                  label="38. ¿El Acta de entrega tiene como anexo: Acta de arqueo de las Cajas Chicas a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="anexo_listado_registro_proveedores"
                  label="39. ¿El Acta de entrega tiene como anexo: Listado del Registro Auxiliar de Proveedores?"
                />
              </div>
            )}

            {/* PASO 7 (Índice 6) */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_reporte_libros_contables"
                  label="40. ¿El Acta de entrega tiene como anexo: Reportes de Libros Contables (Diario y mayores analíticos) a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="anexo_reporte_cuentas_bancarias"
                  label="41. ¿El Acta de entrega tiene como anexo: Reportes de las Cuentas Bancarias  (Movimientos a la fecha del cese de funciones)?"
                />
                <SiNoQuestion
                  name="anexo_reporte_conciliaciones_bancarias"
                  label="42. ¿El Acta de entrega tiene como anexo: Reportes de las Conciliaciones Bancarias a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="anexo_reporte_retenciones_pendientes"
                  label="43. ¿El Acta de entrega tiene como anexo: Reportes de Retenciones de pagos pendientes por enterar correspondientes a ISLR, IVA  y Retenciones por Contratos (obras, bienes y servicios)  a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="anexo_reporte_contrataciones_publicas"
                  label="44. ¿El Acta de entrega tiene como anexo: Reporte de los Procesos de Contrataciones Públicas  a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="anexo_reporte_fideicomiso_prestaciones"
                  label="45. ¿El Acta de entrega tiene como anexo: Reporte del Fideicomiso de Prestaciones Sociales a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="anexo_reporte_bonos_vacacionales"
                  label="46. ¿El Acta de entrega tiene como anexo: Reporte de Bonos Vacacionales  a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="anexo_mencion_numero_cargos_rrhh"
                  label="47. ¿El Acta de entrega tiene como anexo: Mención del número de cargos existentes, con señalamiento de sí son empleados u obreros, fijos o contratados, así como el número de jubilados y pensionados, de ser el caso a la fecha del cese de funciones?"
                />
                <SiNoQuestion
                  name="incluye_cuadro_resumen_cargos"
                  label="48. ¿Se Incluye un cuadro resumen indicando el número de cargos existentes, clasificados en empleados, obreros, fijos o contratados?"
                />
                <SiNoQuestion
                  name="cuadro_resumen_cargos_validado_rrhh"
                  label="49. ¿El cuadro resumen está validado por la Oficina de Recursos Humanos?"
                />
                <SiNoQuestion
                  name="anexo_reporte_nominas"
                  label="50. ¿El Acta de entrega tiene como anexo: Reporte de Nóminas a la fecha del cese de funciones?"
                />
              </div>
            )}

            {/* PASO 8 (Índice 7) */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_inventario_bienes"
                  label="51. ¿El Acta de entrega tiene como anexo: Inventario de los Bienes Muebles o Inmuebles?"
                />
                <SiNoQuestion
                  name="inventario_bienes_fecha_entrega"
                  label="52. ¿El inventario de Bienes e Inmuebles está elaborado a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="inventario_bienes_comprobado_fisicamente"
                  label="53. ¿El inventario de Bienes se comprobó físicamente?"
                />
                <SiNoQuestion
                  name="verificada_existencia_bienes_inventario"
                  label="54. ¿Se verificó la existencia de los bienes descritos en el inventario?"
                />
                <SiNoQuestion
                  name="verificada_condicion_bienes_inventario"
                  label="55. ¿Se verificó la condición de los bienes descritos en el inventario?"
                />
                <SiNoQuestion
                  name="inventario_indica_responsable_patrimonial"
                  label="56. ¿Indica quién es el responsable patrimonial?"
                />
                <SiNoQuestion
                  name="inventario_indica_responsable_uso"
                  label="57. ¿Indica quién es el responsable patrimonial por uso?"
                />
              </div>
            )}

            {/* PASO 9 (Índice 8) */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="inventario_indica_fecha_verificacion"
                  label="58. ¿Indica la fecha de la verificación del inventario?"
                />
                <SiNoQuestion
                  name="inventario_indica_numero_acta_verificacion"
                  label="59. ¿Indica el número del acta de verificación?"
                />
                <SiNoQuestion
                  name="inventario_indica_numero_registro_bien"
                  label="60. ¿Indica el número de registro del bien?"
                />
                <SiNoQuestion
                  name="inventario_indica_codigo_bien"
                  label="61. ¿Indica el código del bien?"
                />
                <SiNoQuestion
                  name="inventario_indica_descripcion_bien"
                  label="62. ¿Indica la descripción del bien?"
                />
                <SiNoQuestion
                  name="inventario_indica_marca_bien"
                  label="63. ¿Se indica la marca del bien?"
                />
                <SiNoQuestion
                  name="inventario_indica_modelo_bien"
                  label="64. ¿Se indica el modelo del bien?"
                />
                <SiNoQuestion
                  name="inventario_indica_serial_bien"
                  label="65. ¿Se indica el número de serial del bien?"
                />
                <SiNoQuestion
                  name="inventario_indica_estado_conservacion_bien"
                  label="66. ¿Se indica el estado de conservación del bien para cada caso?"
                />
                <SiNoQuestion
                  name="inventario_indica_ubicacion_bien"
                  label="67. ¿Se indica la ubicación del bien (Administrativa y/o geográficamente)?"
                />
                <SiNoQuestion
                  name="inventario_indica_valor_mercado_bien"
                  label="68. ¿Se indica el valor de mercado actualizado del bien?"
                />
              </div>
            )}

            {/* PASO 10 (Índice 9) */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_ejecucion_poa"
                  label="69. ¿El Acta de entrega tiene como anexo: La ejecución del Plan Operativo Anual de conformidad con los objetivos propuestos y las metas fijadas en el presupuesto?"
                />
                <SiNoQuestion
                  name="incluye_ejecucion_poa_fecha_entrega"
                  label="70. ¿Se incluye la ejecución del Plan Operativo a la fecha de entrega?"
                />
                <SiNoQuestion
                  name="incluye_causas_incumplimiento_metas_poa"
                  label="71. ¿Se incluyen detalles de las causas que originaron el incumplimiento de algunas metas?"
                />
                <SiNoQuestion
                  name="incluye_plan_operativo_anual"
                  label="72. ¿Se incluye el Plan Operativo Anual?"
                />
              </div>
            )}

            {/* PASO 11 (Índice 10) */}
            {currentStep === 10 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_indice_general_archivo"
                  label="73. ¿El Acta de entrega tiene como anexo: El Índice general del archivo?"
                />
                <SiNoQuestion
                  name="archivo_indica_clasificacion"
                  label="74. ¿Se indicó la clasificación del archivo?"
                />
                <SiNoQuestion
                  name="archivo_indica_ubicacion_fisica"
                  label="75. ¿Se indica ubicación física?"
                />
              </div>
            )}

            {/* PASO 12 (Índice 11) - DINÁMICO */}
            {currentStep === 11 && (
              <div className="space-y-6">
                {/* Dropdown Anexo_VI */}
                <FormField
                  control={form.control}
                  name="Anexo_VI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Anexos adicionales (Según Tipo de Entidad)
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value} // o value={field.value} si quieres control total
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Seleccione un anexo a detallar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-black bg-white z-50 max-h-60 overflow-y-auto">
                          {/* Iterar sobre las opciones */}
                          {anexosAdicionalesTitulosCompliance.map((anexo) => (
                            <SelectItem
                              key={anexo.longTitle}
                              value={anexo.longTitle}
                              // Deshabilitar NO APLICA si ya hay una selección válida? (Opcional)
                              // disabled={anexo.longTitle === 'NO APLICA' && !!field.value && field.value !== 'NO APLICA'}
                              className="whitespace-normal h-auto" // Para textos largos
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
                  dynamicStepContentCompliance[selectedAnexo] && (
                    <div className="mt-6 space-y-4 border-t pt-6">
                      <h3 className="font-semibold text-lg">
                        {dynamicStepContentCompliance[selectedAnexo].title}
                      </h3>
                      <p className="text-sm italic text-g5 whitespace-pre-line">
                        {dynamicStepContentCompliance[selectedAnexo].subtitle}
                      </p>
                      {dynamicStepContentCompliance[
                        selectedAnexo
                      ].questions.map((q) => (
                        <SiNoQuestion
                          key={q.name}
                          name={q.name}
                          label={q.label}
                          options={q.options}
                        />
                      ))}
                    </div>
                  )}
              </div>
            )}

            {/* PASO 13 (Índice 12) - Final */}
            {currentStep === 12 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="interesProducto"
                  label="Su proceso de autoevaluación ha concluido exitosamente.¿Le gustaría recibir información sobre nuestra asesoría personalizada con nuestro equipo de expertos para interpretar sus resultados?"
                  options={['SI', 'NO']}
                />
                {/* Mensaje de finalización condicional */}
                {form.watch('interesProducto') && ( // Mostrar si ya se respondió
                  <div className="text-center p-6 mt-8 bg-gray-50 rounded-lg border border-dashed transition-opacity duration-500">
                    <CiCircleCheck className="mx-auto h-12 w-12 text-green5" />
                    <h3 className="mt-4 text-xl font-semibold text-g8">
                      ¡Registro Exitoso de la Autoevaluación!
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Para garantizar la exactitud de su información, le
                      solicitamos <b>revisar</b> los datos registrados en las
                      secciones previas. Puede navegar y verificar la
                      información utilizando la <b>paginación</b> o el botón{' '}
                      <b>Anterior</b>.
                      <br />
                      Una vez confirmada la veracidad de la información, proceda
                      a hacer clic en el botón
                      <b>Finalizar autoevaluación</b>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botón submit oculto */}
          <button
            type="submit"
            className="hidden"
            id="compliance-submit-button"
            onClick={form.handleSubmit(onSubmit)}
          ></button>
        </form>
      </Form>
      {/* Footer fijo con navegación */}
      <CardFooter className="border-t sticky bottom-0 bg-white z-10 ">
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
                currentStep === 0 && 'pointer-events-none opacity-50' // Deshabilitar si es el primer paso
              )}
            >
              Anterior {/* Texto personalizado */}
            </PaginationPrevious>
          </div>

          {/* Columna Central (Paginación) */}
          <div className="flex w-1/2 justify-center">
            {' '}
            {/* Ajustado a w-1/2 */}
            <Pagination>
              <PaginationContent>{renderPaginationItems()}</PaginationContent>
            </Pagination>
          </div>

          {/* Columna Derecha (Siguiente/Finalizar - Ahora usa PaginationNext o Button) */}
          <div className="w-1/4 flex justify-end">
            {' '}
            {/* Ajustado a w-1/4 */}
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
                Siguiente {/* Texto personalizado */}
              </PaginationNext>
            ) : (
              // Botón Finalizar (cuando estás en el último paso)
              <Button
                onClick={() =>
                  document.getElementById('compliance-submit-button')?.click()
                }
                disabled={isLoading}
                variant="default"
                className="text-white cursor-pointer shadow-lg shadow-blue-500/50 active:shadow-inner transition-all bg-chillon hover:bg-chillon/80 hover:text-white"
              >
                {isLoading ? 'Enviando...' : 'Finalizar autoevaluación'}
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
      {/* Diálogo de éxito (reutilizado) */}
      <SuccessAlertDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title={dialogContent.title}
        description={dialogContent.description}
        onConfirm={() => {
          // ACTIVAR LOADER ANTES DE REDIRIGIR
          showLoader();
          //setShowSuccessDialog(false);
          router.push('/dashboard/panel-de-actas/compliance');
        }}
      />
    </Card>
  );
}
