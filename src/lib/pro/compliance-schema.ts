import * as z from 'zod';
import { dynamicStepContentCompliance } from './compliance-constants';

// Expresión regular para RIF (ej: G-20000000-0)
const rifRegex = /^[GJE]-\d{8}-\d{1}$/;
// Helper para validación SI/NO/NO APLICA
const requiredOption = z.string().min(1, 'Debe seleccionar una opción.');

// Esquema base con todos los campos estáticos
export const complianceSchemaBase = z.object({
  // PASO 1
  email: z
    .string()
    .min(1, 'Campo Requerido')
    .email({ message: 'Debe ser un correo válido.' }),
  rifOrgano: z.string().regex(rifRegex, 'El RIF es requerido.'),
  nombreevaluador: z.string().min(1, 'Nombre del evaluador es obligatorio.'),
  denominacionCargo: z
    .string()
    .min(1, 'Denominación del cargo es obligatorio.'),
  nombreOrgano: z.string().min(1, 'Nombre del órgano es obligatorio.'),
  nombreUnidad: z.string().min(1, 'Nombre de la unidad es obligatorio.'),
  fecha: z.string().min(1, 'Fecha es obligatoria.'),
  nomenclaturaActa: z.string().min(1, 'Nomenclatura del acta es obligatoria.'),

  // PASO 2
  acta_contiene_lugar_suscripcion: requiredOption,
  acta_contiene_fecha_suscripcion: requiredOption,
  acta_identifica_organo_entregado: requiredOption,
  acta_identifica_servidor_entrega: requiredOption,
  acta_identifica_servidor_recibe: requiredOption,

  // PASO 3
  acta_describe_motivo_entrega: requiredOption,
  acta_describe_fundamento_legal: requiredOption,
  acta_contiene_relacion_anexos_normas: requiredOption,
  acta_expresa_integracion_anexos: requiredOption,
  acta_suscrita_por_quien_entrega: requiredOption,
  acta_suscrita_por_quien_recibe: requiredOption,
  anexa_informacion_adicional: requiredOption,

  // PASO 4
  anexos_con_fecha_corte_al_cese: requiredOption,
  acta_deja_constancia_inexistencia_info: requiredOption,
  acta_especifica_errores_omisiones: requiredOption,
  acta_elaborada_original_y_3_copias: requiredOption,
  incluye_autorizacion_certificar_copias: requiredOption,
  original_archivado_despacho_autoridad: requiredOption,
  copia_certificada_entregada_a_servidor_recibe: requiredOption,
  copia_certificada_entregada_a_servidor_entrega: requiredOption,
  copia_entregada_auditoria_interna_en_plazo: requiredOption,

  // PASO 5
  anexo_estado_cuentas_general: requiredOption,
  anexo_situacion_presupuestaria_detallada: requiredOption,
  anexo_gastos_comprometidos_no_causados: requiredOption,
  anexo_gastos_causados_no_pagados: requiredOption,
  anexo_estado_presupuestario_por_partidas: requiredOption,
  anexo_estado_presupuestario_por_cuentas: requiredOption,

  // PASO 6
  anexo_estados_financieros: requiredOption,
  anexo_balance_comprobacion_y_notas: requiredOption,
  anexo_estado_situacion_financiera_y_notas: requiredOption,
  anexo_estado_rendimiento_financiero_y_notas: requiredOption,
  anexo_estado_movimiento_patrimonio_y_notas: requiredOption,
  anexo_relacion_cuentas_por_cobrar: requiredOption,
  anexo_relacion_cuentas_por_pagar: requiredOption,
  anexo_relacion_fondos_terceros: requiredOption,
  anexo_situacion_fondos_anticipo: requiredOption,
  anexo_situacion_caja_chica: requiredOption,
  anexo_acta_arqueo_caja_chica: requiredOption,
  anexo_listado_registro_proveedores: requiredOption,

  // PASO 7
  anexo_reporte_libros_contables: requiredOption,
  anexo_reporte_cuentas_bancarias: requiredOption,
  anexo_reporte_conciliaciones_bancarias: requiredOption,
  anexo_reporte_retenciones_pendientes: requiredOption,
  anexo_reporte_contrataciones_publicas: requiredOption,
  anexo_reporte_fideicomiso_prestaciones: requiredOption,
  anexo_reporte_bonos_vacacionales: requiredOption,
  anexo_mencion_numero_cargos_rrhh: requiredOption,
  incluye_cuadro_resumen_cargos: requiredOption,
  cuadro_resumen_cargos_validado_rrhh: requiredOption,
  anexo_reporte_nominas: requiredOption,

  // PASO 8
  anexo_inventario_bienes: requiredOption,
  inventario_bienes_fecha_entrega: requiredOption,
  inventario_bienes_comprobado_fisicamente: requiredOption,
  verificada_existencia_bienes_inventario: requiredOption,
  verificada_condicion_bienes_inventario: requiredOption,
  inventario_indica_responsable_patrimonial: requiredOption,
  inventario_indica_responsable_uso: requiredOption,

  // PASO 9
  inventario_indica_fecha_verificacion: requiredOption,
  inventario_indica_numero_acta_verificacion: requiredOption,
  inventario_indica_numero_registro_bien: requiredOption,
  inventario_indica_codigo_bien: requiredOption,
  inventario_indica_descripcion_bien: requiredOption,
  inventario_indica_marca_bien: requiredOption,
  inventario_indica_modelo_bien: requiredOption,
  inventario_indica_serial_bien: requiredOption,
  inventario_indica_estado_conservacion_bien: requiredOption,
  inventario_indica_ubicacion_bien: requiredOption,
  inventario_indica_valor_mercado_bien: requiredOption,

  // PASO 10
  anexo_ejecucion_poa: requiredOption,
  incluye_ejecucion_poa_fecha_entrega: requiredOption,
  incluye_causas_incumplimiento_metas_poa: requiredOption,
  incluye_plan_operativo_anual: requiredOption,

  // PASO 11
  anexo_indice_general_archivo: requiredOption,
  archivo_indica_clasificacion: requiredOption,
  archivo_indica_ubicacion_fisica: requiredOption,

  // PASO 12 (Dropdown + Campos dinámicos opcionales)
  Anexo_VI: z
    .string()
    .min(1, 'Debe seleccionar una opción para los anexos adicionales.'),
  // Campos dinámicos
  incluye_relacion_montos_fondos_asignados: z.string().optional(),
  incluye_saldo_efectivo_fondos: z.string().optional(),
  incluye_relacion_bienes_asignados: z.string().optional(),
  incluye_relacion_bienes_unidad_bienes: z.string().optional(),
  incluye_estados_bancarios_conciliados: z.string().optional(),
  incluye_lista_comprobantes_gastos: z.string().optional(),
  incluye_cheques_pendientes_cobro: z.string().optional(),
  incluye_reporte_transferencias_bancarias: z.string().optional(),
  anexo_caucion_funcionario_admin: z.string().optional(),
  incluye_cuadro_liquidado_recaudado: z.string().optional(),
  incluye_relacion_expedientes_investigacion: z.string().optional(),
  incluye_situacion_tesoro_nacional: z.string().optional(),
  incluye_ejecucion_presupuesto_nacional: z.string().optional(),
  incluye_monto_deuda_publica_nacional: z.string().optional(),
  incluye_situacion_cuentas_nacion: z.string().optional(),
  incluye_situacion_tesoro_estadal: z.string().optional(),
  incluye_ejecucion_presupuesto_estadal: z.string().optional(),
  incluye_situacion_cuentas_estadal: z.string().optional(),
  incluye_situacion_tesoro_municipal: z.string().optional(),
  incluye_ejecucion_presupuesto_municipal: z.string().optional(),
  incluye_situacion_cuentas_municipal: z.string().optional(),
  incluye_inventario_terrenos_municipales: z.string().optional(),
  incluye_relacion_ingresos_venta_terrenos: z.string().optional(),
});

// Tipo inferido para usar en el formulario
export type ComplianceFormData = z.infer<typeof complianceSchemaBase>;

// ESQUEMA FINAL con superRefine para validación dinámica del Paso 12
export const complianceSchema = complianceSchemaBase.superRefine(
  (data, ctx) => {
    const selectedAnexo = data.Anexo_VI;

    // Si no se seleccionó nada o es "NO APLICA" (si existiera), no validamos campos dinámicos
    if (!selectedAnexo || selectedAnexo === 'NO APLICA') {
      // Ajustar si 'NO APLICA' es una opción válida
      return;
    }

    // Buscar la configuración del anexo seleccionado
    const anexoContent =
      dynamicStepContentCompliance[
        selectedAnexo as keyof typeof dynamicStepContentCompliance
      ];

    // Si la selección no corresponde a ningún contenido dinámico definido, no hacemos nada
    if (!anexoContent || anexoContent.type !== 'questions') {
      return;
    }

    // Validar cada pregunta requerida para el anexo seleccionado
    anexoContent.questions.forEach((q) => {
      const fieldName = q.name;
      // Si el campo está vacío (o undefined/null), añadir un error
      if (!data[fieldName]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName], // Ruta del campo que falló
          message: 'Debe seleccionar una opción.',
        });
      }
    });
  }
);
