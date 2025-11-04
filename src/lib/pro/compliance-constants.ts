import { ComplianceFormData } from './compliance-schema'; // Importar el tipo

// Tipo actualizado para incluir subtitle y fields
export type ComplianceStepInfo = {
  id: number;
  title: string;
  subtitle?: string; // Subtítulo opcional
  fields: (keyof ComplianceFormData)[]; // Campos a validar en este paso
};

// Estructura inicial de los pasos basada en el documento
export const steps: ComplianceStepInfo[] = [
  {
    id: 1, // PASO 1
    title: 'Datos generales del Acta',
    fields: [
      'email',
      'rifOrgano',
      'nombreevaluador',
      'denominacionCargo',
      'nombreOrgano',
      'nombreUnidad',
      'fecha',
      'nomenclaturaActa',
    ],
  },
  {
    id: 2, // PASO 2
    title: 'Identificación general del acta',
    subtitle:
      'Artículo 10, numerales 1, 2 y 3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    fields: [
      'acta_contiene_lugar_suscripcion',
      'acta_contiene_fecha_suscripcion',
      'acta_identifica_organo_entregado',
      'acta_identifica_servidor_entrega',
      'acta_identifica_servidor_recibe',
    ],
  },
  {
    id: 3, // PASO 3
    title: 'Contenido y suscripción del acta',
    subtitle:
      'Artículo 10 numerales 4, 5 y 6 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    fields: [
      'acta_describe_motivo_entrega',
      'acta_describe_fundamento_legal',
      'acta_contiene_relacion_anexos_normas',
      'acta_expresa_integracion_anexos',
      'acta_suscrita_por_quien_entrega',
      'acta_suscrita_por_quien_recibe',
      'anexa_informacion_adicional',
    ],
  },
  {
    id: 4, // PASO 4
    title: 'Anexos, declaraciones y distribución final',
    subtitle:
      'Artículos 18, 19, 20 y 21 de la Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    fields: [
      'anexos_con_fecha_corte_al_cese',
      'acta_deja_constancia_inexistencia_info',
      'acta_especifica_errores_omisiones',
      'acta_elaborada_original_y_3_copias',
      'incluye_autorizacion_certificar_copias',
      'original_archivado_despacho_autoridad',
      'copia_certificada_entregada_a_servidor_recibe',
      'copia_certificada_entregada_a_servidor_entrega',
      'copia_entregada_auditoria_interna_en_plazo',
    ],
  },
  {
    id: 5, // PASO 5
    title:
      'Anexo I: Estado de las cuentas que reflejen la SITUACIÓN PRESUPUESTARIA, cuando sea aplicable.',
    fields: [
      'anexo_estado_cuentas_general',
      'anexo_situacion_presupuestaria_detallada',
      'anexo_gastos_comprometidos_no_causados',
      'anexo_gastos_causados_no_pagados',
      'anexo_estado_presupuestario_por_partidas',
      'anexo_estado_presupuestario_por_cuentas',
    ],
  },
  {
    id: 6, // PASO 6
    title:
      'Anexo I: Estado de las cuentas que reflejen la SITUACIÓN PRESUPUESTARIA, cuando sea aplicable.',
    fields: [
      'anexo_estados_financieros',
      'anexo_balance_comprobacion_y_notas',
      'anexo_estado_situacion_financiera_y_notas',
      'anexo_estado_rendimiento_financiero_y_notas',
      'anexo_estado_movimiento_patrimonio_y_notas',
      'anexo_relacion_cuentas_por_cobrar',
      'anexo_relacion_cuentas_por_pagar',
      'anexo_relacion_fondos_terceros',
      'anexo_situacion_fondos_anticipo',
      'anexo_situacion_caja_chica',
      'anexo_acta_arqueo_caja_chica',
      'anexo_listado_registro_proveedores',
    ],
  },
  {
    id: 7, // PASO 7
    title: 'Anexo II: Reportes y procesos administrativos clave',
    subtitle:
      'Artículo 14 de las Normas para la Formación, Participación, Rendición, Examen y Calificación de las Cuentas de los Órganos del Poder Público.',
    fields: [
      'anexo_reporte_libros_contables',
      'anexo_reporte_cuentas_bancarias',
      'anexo_reporte_conciliaciones_bancarias',
      'anexo_reporte_retenciones_pendientes',
      'anexo_reporte_contrataciones_publicas',
      'anexo_reporte_fideicomiso_prestaciones',
      'anexo_reporte_bonos_vacacionales',
      'anexo_mencion_numero_cargos_rrhh',
      'incluye_cuadro_resumen_cargos',
      'cuadro_resumen_cargos_validado_rrhh',
      'anexo_reporte_nominas',
    ],
  },
  {
    id: 8, // PASO 8
    title: 'Anexo III: Inventario de Bienes - Verificación y Responsabilidad',
    subtitle:
      'Artículo 11, numeral 3 de la Resolución CGR N° 01-00-000162. \nArtículos 1 y 6 de la Providencia Administrativa N° 044 (Normativas sobre el Responsable Patrimonial).',
    fields: [
      'anexo_inventario_bienes',
      'inventario_bienes_fecha_entrega',
      'inventario_bienes_comprobado_fisicamente',
      'verificada_existencia_bienes_inventario',
      'verificada_condicion_bienes_inventario',
      'inventario_indica_responsable_patrimonial',
      'inventario_indica_responsable_uso',
    ],
  },
  {
    id: 9, // PASO 9
    title: 'Anexo III: Inventario de Bienes - Atributos y Detalles',
    subtitle:
      'Artículo 11, numeral 3 de la Resolución CGR N° 01-00-000162. \nArtículos 3, 10, 11 y 12 de la Providencia Administrativa N° 041 (Instructivo del Sistema de Información del Registro de Bienes Públicos).',
    fields: [
      'inventario_indica_fecha_verificacion',
      'inventario_indica_numero_acta_verificacion',
      'inventario_indica_numero_registro_bien',
      'inventario_indica_codigo_bien',
      'inventario_indica_descripcion_bien',
      'inventario_indica_marca_bien',
      'inventario_indica_modelo_bien',
      'inventario_indica_serial_bien',
      'inventario_indica_estado_conservacion_bien',
      'inventario_indica_ubicacion_bien',
      'inventario_indica_valor_mercado_bien',
    ],
  },
  {
    id: 10, // PASO 10
    title: 'Anexo IV: Plan Operativo Anual y Ejecución',
    subtitle: 'Artículo 11, numeral 4 de la Resolución CGR N° 01-00-000162.',
    fields: [
      'anexo_ejecucion_poa',
      'incluye_ejecucion_poa_fecha_entrega',
      'incluye_causas_incumplimiento_metas_poa',
      'incluye_plan_operativo_anual',
    ],
  },
  {
    id: 11, // PASO 11
    title: 'Anexo V: Índice General del Archivo',
    subtitle: 'Artículo 11, numeral 5 de la Resolución CGR N° 01-00-000162.',
    fields: [
      'anexo_indice_general_archivo',
      'archivo_indica_clasificacion',
      'archivo_indica_ubicacion_fisica',
    ],
  },
  {
    id: 12, // PASO 12 (Dinámico)
    title: 'Anexos Adicionales',
    fields: ['Anexo_VI'], // Solo el dropdown se valida inicialmente
  },
  {
    id: 13, // PASO 13 (Final)
    title: 'Finalización y Envío',
    subtitle: 'Último paso antes de generar su autoevaluación.',
    fields: ['interesProducto'],
  },
];

export const anexosAdicionalesTitulosCompliance = [
  {
    shortTitle: 'Unidades Administradoras',
    longTitle: 'UNIDADES ADMINISTRADORAS',
  },
  {
    shortTitle: 'Órganos o Entidades que manejan Ramos Específicos',
    longTitle: 'ÓRGANOS O ENTIDADES QUE MANEJAN RAMOS ESPECÍFICOS',
  },
  {
    shortTitle: 'Órganos de Control Fiscal',
    longTitle: 'ÓRGANOS DE CONTROL FISCAL',
  },
  {
    shortTitle: 'Ministerio de Finanzas',
    longTitle: 'MINISTERIO DE FINANZAS',
  },
  {
    shortTitle: 'Gobernaciones, Oficinas o Dependencias de Hacienda Estadal',
    longTitle: 'GOBERNACIONES, OFICINAS O DEPENDENCIAS DE HACIENDA ESTADAL',
  },
  {
    shortTitle: 'Alcaldías, Dirección de Hacienda Distrital o Municipal',
    longTitle: 'ALCALDÍAS, DIRECCIÓN DE HACIENDA DISTRITAL O MUNICIPAL',
  },
];

// Tipos para el contenido dinámico
type ComplianceQuestionDetail = {
  name: keyof ComplianceFormData;
  label: string;
  options: ('SI' | 'NO' | 'NO APLICA')[];
};
type ComplianceQuestionsStep = {
  type: 'questions';
  title: string; // Título de la sección dinámica
  subtitle: string; // Subtítulo (base legal)
  questions: ComplianceQuestionDetail[];
};

export type ComplianceDynamicStep = ComplianceQuestionsStep;
export type ComplianceDynamicContent = { [key: string]: ComplianceDynamicStep };

// Contenido dinámico del Paso 12
export const dynamicStepContentCompliance: ComplianceDynamicContent = {
  'UNIDADES ADMINISTRADORAS': {
    type: 'questions',
    title: 'Unidades Administradoras',
    subtitle:
      'Artículo 12 de la Resolución CGR N° 01-00-000162. \nArtículo 53 del Reglamento N° 1 de la Ley Orgánica de la Administración Financiera del Sector Público.',
    questions: [
      {
        name: 'incluye_relacion_montos_fondos_asignados',
        label:
          '76. ¿Se incluye Relación de los montos de los fondos asignados?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_saldo_efectivo_fondos',
        label: '77. ¿Se incluye Saldo en efectivo de dichos fondos?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_relacion_bienes_asignados',
        label: '78. ¿Se incluye Relación de los bienes asignados?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_relacion_bienes_unidad_bienes',
        label:
          '79. ¿Se incluye Relación de los Bienes asignados emitida por la Unidad de Bienes?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_estados_bancarios_conciliados',
        label:
          '80. ¿Se incluye Estados bancarios actualizados y conciliados a la fecha de entrega?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_lista_comprobantes_gastos',
        label: '81. ¿Se incluye lista de comprobantes de gastos?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_cheques_pendientes_cobro',
        label: '82. ¿Se incluyen Cheques emitidos pendientes de cobro?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_reporte_transferencias_bancarias',
        label: '83. ¿Se incluyen listado o reporte de Transferencia Bancaria?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'anexo_caucion_funcionario_admin',
        label:
          '84. ¿El Acta de entrega tiene como anexo: Caución del funcionario encargado de la Administración de los Recursos Financieros a la fecha del cese de funciones?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
    ],
  },
  'ÓRGANOS O ENTIDADES QUE MANEJAN RAMOS ESPECÍFICOS': {
    type: 'questions',
    title: 'Órganos o Entidades con Ramos Específicos',
    subtitle: 'Artículo 13 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    questions: [
      {
        name: 'incluye_cuadro_liquidado_recaudado',
        label:
          '85. ¿Se incluye cuadro demostrativo del detalle de lo liquidado y recaudado por los rubros respectivos, y de los derechos pendientes de recaudación de años anteriores?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
    ],
  },
  'ÓRGANOS DE CONTROL FISCAL': {
    type: 'questions',
    title: 'Órganos de Control Fiscal',
    subtitle:
      'Artículo 14 de la Resolución CGR N° 01-00-000162. \nTítulo III (Artículos 53 y 54) de la Ley Orgánica de la Contraloría General de la República y del Sistema Nacional de Control Fiscal.',
    questions: [
      {
        name: 'incluye_relacion_expedientes_investigacion',
        label:
          '86. ¿Se incluye relación de los expedientes abiertos con ocasión del ejercicio de la potestad de investigación, así como de los procedimientos administrativos para la determinación de responsabilidades?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
    ],
  },
  'MINISTERIO DE FINANZAS': {
    type: 'questions',
    title: 'Ministerio de Finanzas',
    subtitle: 'Artículo 15 de la Resolución CGR N° 01-00-000162.',
    questions: [
      {
        name: 'incluye_situacion_tesoro_nacional',
        label: '87. ¿Se incluye Situación del Tesoro Nacional?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_ejecucion_presupuesto_nacional',
        label:
          '88. ¿Se incluye información de la ejecución del presupuesto nacional de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_monto_deuda_publica_nacional',
        label:
          '89. ¿Se incluye Monto de la deuda pública nacional interna y externa?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_situacion_cuentas_nacion',
        label: '90. ¿Se incluye la Situación de las cuentas de la Nación?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
    ],
  },
  'GOBERNACIONES, OFICINAS O DEPENDENCIAS DE HACIENDA ESTADAL': {
    type: 'questions',
    title: 'Gobernaciones, Oficinas o Dependencias de Hacienda Estadal',
    subtitle: 'Artículo 16 de la Resolución CGR N° 01-00-000162.',
    questions: [
      {
        name: 'incluye_situacion_tesoro_estadal',
        label: '91. ¿Se incluye Situación del Tesoro Estadal?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_ejecucion_presupuesto_estadal',
        label:
          '92. ¿Se incluye Información de la ejecución del presupuesto estadal de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_situacion_cuentas_estadal',
        label:
          '93. ¿Se incluye Situación de las cuentas del respectivo estado?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
    ],
  },
  'ALCALDÍAS, DIRECCIÓN DE HACIENDA DISTRITAL O MUNICIPAL': {
    type: 'questions',
    title: 'Alcaldías, Dirección de Hacienda Distrital o Municipal',
    subtitle: 'Artículo 17 de la Resolución CGR N° 01-00-000162.',
    questions: [
      {
        name: 'incluye_situacion_tesoro_municipal',
        label: '94. ¿Se incluye Situación del Tesoro Distrital o Municipal?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_ejecucion_presupuesto_municipal',
        label:
          '95. ¿Se incluye Información de la ejecución del presupuesto distrital o municipal de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_situacion_cuentas_municipal',
        label:
          '96. ¿Se incluye Situación de las cuentas distritales o municipales?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_inventario_terrenos_municipales',
        label:
          '97. ¿Se incluye Inventario detallado de los terrenos ejidos y de los terrenos propios distritales o municipales?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
      {
        name: 'incluye_relacion_ingresos_venta_terrenos',
        label:
          '98. ¿Se incluye Relación de Ingresos producto de las ventas de terrenos ejidos o terrenos propios distritales o municipales?',
        options: ['SI', 'NO', 'NO APLICA'],
      },
    ],
  },
};
