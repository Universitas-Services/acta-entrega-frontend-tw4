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
  CardFooter, // Import CardFooter
} from '@/components/ui/card';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/HeaderContext';
import { SuccessAlertDialog } from '../SuccessAlertDialog';
import { complianceSchema, ComplianceFormData } from '@/lib/compliance-schema'; // Schema nuevo
import { LuTriangleAlert } from 'react-icons/lu';
import {
  steps,
  anexosAdicionalesTitulosCompliance, // Importar títulos para el dropdown
  dynamicStepContentCompliance, // Importar contenido dinámico
  ComplianceDynamicContent, // Importar tipo
} from '@/lib/compliance-constants';
import { useFormDirtyStore } from '@/stores/useFormDirtyStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { FiSave } from 'react-icons/fi'; // Ícono para Guardar
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'; // <-- Importa los componentes de paginación
import { cn } from '@/lib/utils'; // <-- Importa la función cn
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

export function ComplianceForm() {
  const router = useRouter();
  const { setTitle } = useHeader();
  const [currentStep, setCurrentStep] = useState(0); // Inicia en el paso 0 (índice)
  // const [finalStepAnswered, setFinalStepAnswered] = useState(false); // Para el último paso
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { setIsDirty } = useFormDirtyStore();

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

  const { watch } = form; // Necesitamos watch para reaccionar al cambio del dropdown

  const { isDirty } = useFormState({ control: form.control });

  // Observar el valor seleccionado en el dropdown Anexo_VI
  const selectedAnexo = watch('Anexo_VI') as
    | keyof ComplianceDynamicContent
    | undefined
    | ''; // Tipado más preciso

  // Efecto para estado dirty (copiado de Form-MA)
  useEffect(() => {
    setIsDirty(isDirty);
    return () => setIsDirty(false);
  }, [isDirty, setIsDirty]);

  // Función onSubmit (placeholder por ahora)
  const onSubmit = async (data: ComplianceFormData) => {
    console.log('DATOS FINALES A ENVIAR (Compliance):', data);
    setIsLoading(true);
    setApiError(null);
    try {
      // const response = await createComplianceActa(data); // Llamada al servicio (a crear)
      console.log('Simulando envío exitoso...');
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simular espera
      setDialogContent({
        title: `¡Autoevaluación Guardada!`,
        description: 'Su progreso ha sido guardado exitosamente (simulado).',
      });
      setShowSuccessDialog(true);
    } catch (error) {
      if (error instanceof Error) setApiError(error.message);
      else setApiError('Ocurrió un error inesperado.');
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
        // Scroll to error logic (sin cambios)
        const element = document.getElementById(firstErrorField);
        const formItem = element?.closest<HTMLElement>(
          '.space-y-3, .space-y-6 > .space-y-2'
        ); // Ajustar selector si es necesario

        if (contentScrollRef.current && formItem) {
          const containerRect =
            contentScrollRef.current.getBoundingClientRect();
          const itemRect = formItem.getBoundingClientRect();
          const itemTopInContainer =
            itemRect.top -
            containerRect.top +
            contentScrollRef.current.scrollTop;
          contentScrollRef.current.scrollTo({
            top:
              itemTopInContainer -
              contentScrollRef.current.clientHeight / 2 +
              formItem.clientHeight / 2 -
              50,
            behavior: 'smooth',
          });
        }
        toast.warning(
          'Por favor, completa todos los campos requeridos en este paso.'
        );
      } else {
        toast.warning('Hay errores en el formulario, por favor revisa.');
      }
      return;
    }

    // Navegar si es válido
    if (currentStep < steps.length - 1) {
      // AÑADIR LÓGICA DE SALTO
      if (currentStep === 11 && form.getValues('Anexo_VI') === 'NO APLICA') {
        setCurrentStep(12); // Saltar directamente al último paso (índice 12)
      } else {
        setCurrentStep((prev) => prev + 1);
      }
      scrollToTop();
    }
  };

  const prevStep = () => {
    // AÑADIR LÓGICA DE SALTO al retroceder
    if (currentStep === 12 && form.getValues('Anexo_VI') === 'NO APLICA') {
      setCurrentStep(10); // Volver al paso ANTERIOR al dropdown (índice 10)
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      scrollToTop();
    }
  };

  // Función para ir a un paso específico (para paginación futura)
  const goToStep = (stepIndex: number) => {
    // Validar si el índice está dentro de los límites
    if (stepIndex >= 0 && stepIndex < steps.length) {
      // Podríamos añadir lógica aquí para validar pasos intermedios si fuera necesario
      scrollToTop();
      setCurrentStep(stepIndex);
    }
  };

  // Placeholder para la función Guardar
  const handleSaveProgress = () => {
    console.log('Guardando progreso...', form.getValues());
    toast.info("Funcionalidad 'Guardar' pendiente de implementación.");
    // Aquí iría la lógica para guardar en backend o localStorage
  };

  // --- Lógica para renderizar los números de página ---
  const totalSteps = steps.length;
  const currentPage = currentStep + 1; // Página actual (1-based index)

  // Función para generar los items de paginación (simplificada por ahora)
  // Muestra: 1 ... (actual-1) (actual) (actual+1) ... Total
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 1; // Cuántas páginas mostrar alrededor de la actual

    // Botón Primera Página (siempre visible)
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goToStep(0);
          }}
          isActive={currentPage === 1}
          className={cn('cursor-pointer', currentPage === 1 && 'font-bold')}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Ellipsis inicial si es necesario
    if (currentPage > maxVisiblePages + 2) {
      items.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    // Páginas alrededor de la actual
    const startPage = Math.max(2, currentPage - maxVisiblePages);
    const endPage = Math.min(totalSteps - 1, currentPage + maxVisiblePages);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToStep(i - 1);
            }}
            isActive={currentPage === i}
            className={cn('cursor-pointer', currentPage === i && 'font-bold')}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis final si es necesario
    if (currentPage < totalSteps - maxVisiblePages - 1) {
      items.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    // Botón Última Página (siempre visible, si hay más de 1 página)
    if (totalSteps > 1) {
      items.push(
        <PaginationItem key={totalSteps}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToStep(totalSteps - 1);
            }}
            isActive={currentPage === totalSteps}
            className={cn(
              'cursor-pointer',
              currentPage === totalSteps && 'font-bold'
            )}
          >
            {totalSteps}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Obteniendo información del paso actual
  const currentStepData = steps[currentStep];

  return (
    // Card principal con flex y altura completa para layout fijo
    <Card className="w-full bg-white flex flex-col h-[calc(100vh-10rem)]">
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
            <ShadcnCardDescription className="text-sm text-gray-500 italic">
              {currentStepData?.subtitle || 'Complete la autoevaluación.'}
            </ShadcnCardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveProgress}
            disabled={isLoading}
          >
            <FiSave className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
        {/* Subtítulos fijos para Pasos 5 y 6 (Índices 4 y 5) */}
        {currentStep === 4 && ( // PASO 5
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
            <p>
              <strong>Situación presupuestaria</strong>
            </p>
            <p className="italic text-xs">{steps[4].subtitle}</p>
          </div>
        )}
        {currentStep === 5 && ( // PASO 6
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
            <p>
              <strong>Situación financiera y patrimonial</strong>
            </p>
            <p className="italic text-xs">{steps[5].subtitle}</p>
          </div>
        )}
      </CardHeader>
      {/* Contenedor del contenido desplazable */}
      <div ref={contentScrollRef} className="flex-1 overflow-y-auto p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="space-y-6">
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
                  validationType="textOnly"
                />
                <FormFieldWithExtras
                  name="denominacionCargo"
                  label="Denominación del Cargo Institucional"
                  subtitle="Ej: Presidencia, Dirección, Coordinación"
                />
                <FormFieldWithExtras
                  name="nombreOrgano"
                  label="Nombre del órgano, entidad, oficina o dependencia"
                />
                <FormFieldWithExtras
                  name="nombreUnidad"
                  label="Nombre de la unidad u oficina que revisa"
                />
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      {' '}
                      <FormLabel>Fecha</FormLabel>{' '}
                      <ShadcnDatePicker
                        value={
                          field.value
                            ? new Date(field.value + 'T00:00:00')
                            : undefined
                        }
                        onChange={(date) =>
                          field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                        }
                      />{' '}
                      <FormMessage />{' '}
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
                  label="8. ¿El acta contiene una relación completa de los anexos que la acompañan y que se mencionan en los artículos 11 al 17 de las Normas...?"
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
                  options={['SI', 'NO', 'NO APLICA']}
                />
              </div>
            )}

            {/* PASO 4 (Índice 3) */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexos_con_fecha_corte_al_cese"
                  label="13. ¿Los documentos anexos... presentan la información con fecha de corte al momento del cese...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="acta_deja_constancia_inexistencia_info"
                  label="14. ¿En el acta de entrega se deja constancia de la inexistencia de información o documentos requeridos...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="acta_especifica_errores_omisiones"
                  label="15. ¿El acta de entrega específica errores, deficiencias u omisiones en el levantamiento de la misma?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="acta_elaborada_original_y_3_copias"
                  label="16. ¿El acta de entrega y sus anexos fue elaborada en original y tres (03) copias certificadas?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="incluye_autorizacion_certificar_copias"
                  label="17. ¿Se incluye el documento que debidamente autoriza al Servidor Público a certificar las copias...?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="original_archivado_despacho_autoridad"
                  label="18.¿El original del acta... fue archivada en el despacho de la máxima autoridad...?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="copia_certificada_entregada_a_servidor_recibe"
                  label="19. ¿Una copia certificada... fue entregada al servidor público que recibe?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="copia_certificada_entregada_a_servidor_entrega"
                  label="20. ¿Una copia certificada... fue entregada al servidor público que entrega?"
                  options={['SI', 'NO']}
                />
                <SiNoQuestion
                  name="copia_entregada_auditoria_interna_en_plazo"
                  label="21. ¿Se entregó una copia certificada... a la unidad de auditoría interna... dentro de los cinco (05) días hábiles...?"
                  options={['SI', 'NO']}
                />
              </div>
            )}

            {/* PASO 5 (Índice 4) */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_estado_cuentas_general"
                  label="22. ¿El Acta de entrega tiene como anexo: Estado de las cuentas que reflejen la situación presupuestaria, financiera y patrimonial...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_situacion_presupuestaria_detallada"
                  label="23. ¿El Estado de Situación Presupuestaria muestra todos los momentos presupuestarios y sus detalles...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_gastos_comprometidos_no_causados"
                  label="24. ¿El Acta de entrega tiene como anexo: Relación de Gastos Comprometidos, no causados...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_gastos_causados_no_pagados"
                  label="25. ¿El Acta de entrega tiene como anexo: Relación de Gastos Comprometidos, causados y no pagados...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_estado_presupuestario_por_partidas"
                  label="26. ¿El Acta de entrega tiene como anexo: El Estado Presupuestario del Ejercicio vigente por partidas?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_estado_presupuestario_por_cuentas"
                  label="27. ¿El Acta de entrega tiene como anexo: El Estado Presupuestario del Ejercicio con los detalles de sus cuentas?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
              </div>
            )}

            {/* PASO 6 (Índice 5) */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_estados_financieros"
                  label="28. ¿El Acta de entrega tiene como anexo: Estados Financieros a la fecha de entrega?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_balance_comprobacion_y_notas"
                  label="29. ¿El Acta de entrega tiene como anexo: El Balance de Comprobación... y sus notas explicativas...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_estado_situacion_financiera_y_notas"
                  label="30. ¿El Acta de entrega tiene como anexo: Estado de Situación Financiera / Balance General y sus notas explicativas...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_estado_rendimiento_financiero_y_notas"
                  label="31. ¿El Acta de entrega tiene como anexo: Estado de Rendimiento Financiero / Estado de Ganancia y Pérdidas y sus notas explicativas...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_estado_movimiento_patrimonio_y_notas"
                  label="32. ¿El Acta de entrega tiene como anexo: Estado de Movimientos de las Cuentas de Patrimonio y sus notas explicativas...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_relacion_cuentas_por_cobrar"
                  label="33. ¿El Acta de entrega tiene como anexo: Una Relación de Cuentas por Cobrar...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_relacion_cuentas_por_pagar"
                  label="34. ¿El Acta de entrega tiene como anexo: Una Relación de Cuentas por Pagar...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_relacion_fondos_terceros"
                  label="35. ¿El Acta de entrega tiene como anexo: Una Relación de las Cuentas de los Fondos de Terceros?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_situacion_fondos_anticipo"
                  label="36. ¿El Acta de entrega tiene como anexo: La Situación de los Fondos en Anticipo?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_situacion_caja_chica"
                  label="37. ¿El Acta de entrega tiene como anexo: La Situación de la Caja Chica?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_acta_arqueo_caja_chica"
                  label="38. ¿El Acta de entrega tiene como anexo: Acta de arqueo de las Cajas Chicas...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_listado_registro_proveedores"
                  label="39. ¿El Acta de entrega tiene como anexo: Listado del Registro Auxiliar de Proveedores?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
              </div>
            )}

            {/* PASO 7 (Índice 6) */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_reporte_libros_contables"
                  label="40. ¿El Acta de entrega tiene como anexo: Reportes de Libros Contables (Diario y mayores analíticos)...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_reporte_cuentas_bancarias"
                  label="41. ¿El Acta de entrega tiene como anexo: Reportes de las Cuentas Bancarias (Movimientos...)? "
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_reporte_conciliaciones_bancarias"
                  label="42. ¿El Acta de entrega tiene como anexo: Reportes de las Conciliaciones Bancarias...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_reporte_retenciones_pendientes"
                  label="43. ¿El Acta de entrega tiene como anexo: Reportes de Retenciones de pagos pendientes por enterar...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_reporte_contrataciones_publicas"
                  label="44. ¿El Acta de entrega tiene como anexo: Reporte de los Procesos de Contrataciones Públicas...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_reporte_fideicomiso_prestaciones"
                  label="45. ¿El Acta de entrega tiene como anexo: Reporte del Fideicomiso de Prestaciones Sociales...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_reporte_bonos_vacacionales"
                  label="46. ¿El Acta de entrega tiene como anexo: Reporte de Bonos Vacacionales...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_mencion_numero_cargos_rrhh"
                  label="47. ¿El Acta de entrega tiene como anexo: Mención del número de cargos existentes...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="incluye_cuadro_resumen_cargos"
                  label="48. ¿Se Incluye un cuadro resumen indicando el número de cargos existentes...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="cuadro_resumen_cargos_validado_rrhh"
                  label="49. ¿El cuadro resumen está validado por la Oficina de Recursos Humanos?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="anexo_reporte_nominas"
                  label="50. ¿El Acta de entrega tiene como anexo: Reporte de Nóminas...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
              </div>
            )}

            {/* PASO 8 (Índice 7) */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_inventario_bienes"
                  label="51. ¿El Acta de entrega tiene como anexo: Inventario de los Bienes Muebles o Inmuebles?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_bienes_fecha_entrega"
                  label="52. ¿El inventario de Bienes e Inmuebles está elaborado a la fecha de entrega?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_bienes_comprobado_fisicamente"
                  label="53. ¿El inventario de Bienes se comprobó físicamente?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="verificada_existencia_bienes_inventario"
                  label="54. ¿Se verificó la existencia de los bienes descritos en el inventario?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="verificada_condicion_bienes_inventario"
                  label="55. ¿Se verificó la condición de los bienes descritos en el inventario?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_responsable_patrimonial"
                  label="56. ¿Indica quién es el responsable patrimonial?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_responsable_uso"
                  label="57. ¿Indica quién es el responsable patrimonial por uso?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
              </div>
            )}

            {/* PASO 9 (Índice 8) */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="inventario_indica_fecha_verificacion"
                  label="58. ¿Indica la fecha de la verificación del inventario?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_numero_acta_verificacion"
                  label="59. ¿Indica el número del acta de verificación?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_numero_registro_bien"
                  label="60. ¿Indica el número de registro del bien?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_codigo_bien"
                  label="61. ¿Indica el código del bien?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_descripcion_bien"
                  label="62. ¿Indica la descripción del bien?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_marca_bien"
                  label="63. ¿Se indica la marca del bien?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_modelo_bien"
                  label="64. ¿Se indica el modelo del bien?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_serial_bien"
                  label="65. ¿Se indica el número de serial del bien?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_estado_conservacion_bien"
                  label="66. ¿Se indica el estado de conservación del bien para cada caso?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_ubicacion_bien"
                  label="67. ¿Se indica la ubicación del bien (Administrativa y/o geográficamente)? "
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="inventario_indica_valor_mercado_bien"
                  label="68. ¿Se indica el valor de mercado actualizado del bien?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
              </div>
            )}

            {/* PASO 10 (Índice 9) */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_ejecucion_poa"
                  label="69. ¿El Acta de entrega tiene como anexo: La ejecución del Plan Operativo Anual...?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="incluye_ejecucion_poa_fecha_entrega"
                  label="70. ¿Se incluye la ejecución del Plan Operativo a la fecha de entrega?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="incluye_causas_incumplimiento_metas_poa"
                  label="71. ¿Se incluyen detalles de las causas que originaron el incumplimiento de algunas metas?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="incluye_plan_operativo_anual"
                  label="72. ¿Se incluye el Plan Operativo Anual?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
              </div>
            )}

            {/* PASO 11 (Índice 10) */}
            {currentStep === 10 && (
              <div className="space-y-4">
                <SiNoQuestion
                  name="anexo_indice_general_archivo"
                  label="73. ¿El Acta de entrega tiene como anexo: El Índice general del archivo?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="archivo_indica_clasificacion"
                  label="74. ¿Se indicó la clasificación del archivo?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
                <SiNoQuestion
                  name="archivo_indica_ubicacion_fisica"
                  label="75. ¿Se indica ubicación física?"
                  options={['SI', 'NO', 'NO APLICA']}
                />
              </div>
            )}

            {/* PASO 12 (Índice 11) - DINÁMICO */}
            {currentStep === 11 && (
              <div className="space-y-6">
                {/* Dropdown Anexo_VI */}
                <FormField
                  control={form.control}
                  name="Anexo_VI" // Corregido de Anexo_VII
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Anexos Adicionales (Según Tipo de Entidad)
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
                      <p className="text-sm italic text-gray-500">
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
                  label="Nos complace que haya completado su autoevaluación. ¿Le gustaría recibir información para obtener la versión Pro con acceso a funcionalidades avanzadas?"
                  options={['SI', 'NO']}
                />
                {/* Mensaje de finalización condicional */}
                {form.watch('interesProducto') && ( // Mostrar si ya se respondió
                  <div className="text-center p-6 mt-8 bg-gray-50 rounded-lg border border-dashed transition-opacity duration-500">
                    <CiCircleCheck className="mx-auto h-12 w-12 text-green5" />
                    <h3 className="mt-4 text-xl font-semibold text-g8">
                      ¡Ha completado la Autoevaluación!
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Ha llenado exitosamente el formulario. Por favor, revise
                      los datos en los pasos anteriores usando la paginación o
                      el botón Anterior.
                      <br />
                      Una vez que esté seguro, presione el botón{' '}
                      <b>Finalizar Autoevaluación</b>.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Botón submit oculto */}
            <button
              type="submit"
              className="hidden"
              id="compliance-submit-button"
              onClick={form.handleSubmit(onSubmit)}
            ></button>
          </form>
        </Form>
      </div>
      {/* Footer fijo con navegación */}
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
                  'cursor-pointer',
                  // Podríamos añadir lógica de deshabilitación si isLoading
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
                className="cursor-pointer shadow-sm active:bg-primary/80 active:translate-y-px transition-all"
              >
                {isLoading ? 'Enviando...' : 'Finalizar Autoevaluación'}
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
          setShowSuccessDialog(false);
          router.push('/dashboard'); // O a donde corresponda
        }}
      />
    </Card>
  );
}
