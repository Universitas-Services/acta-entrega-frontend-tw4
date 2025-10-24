// src/lib/acta-ma-pro-constants.ts
import { z } from 'zod';
// Asegúrate de importar el schema correcto si lo defines por separado
// import { ActaMaximaAutoridadFormData } from './ruta/a/tu/schema';
// Por ahora, usaremos el schema importado en Form-MA-pro.tsx
import { actaMaximaAutoridadSchema } from './schemas'; // Asumiendo que está en schemas.ts

type FormData = z.infer<typeof actaMaximaAutoridadSchema>;

// --- TIPOS COMPARTIDOS (Igual que acta-ma-constants) ---
type QuestionsStep = {
  type: 'questions';
  title: string;
  subtitle: string;
  questions: { name: keyof FormData; label: string }[];
};
type TextareaStep = {
  type: 'textarea';
  title: string;
  subtitle: string;
  fieldName: keyof FormData;
};
export type DynamicStep = QuestionsStep | TextareaStep;
export type DynamicContent = { [key: string]: DynamicStep };

// Tipo para la información de cada paso
export type StepInfo = {
  id: number;
  title: string;
  subtitle?: string;
  fields: (keyof FormData)[];
};

// --- ESTRUCTURA DE LOS PASOS (MODIFICADA) ---
// Total 10 pasos
export const steps: StepInfo[] = [
  {
    // PASO 1 (Índice 0)
    id: 1,
    title: 'Datos generales del Acta',
    fields: [
      'email',
      'rifOrgano',
      'denominacionCargo',
      'nombreOrgano',
      'ciudadSuscripcion',
      'estadoSuscripcion',
      'horaSuscripcion',
      'fechaSuscripcion',
      'direccionOrgano',
      'motivoEntrega',
    ],
  },
  {
    // PASO 2 (Índice 1)
    id: 2,
    title: 'Intervinientes en el Acta',
    subtitle: 'Artículo 10.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    fields: [
      'nombreServidorEntrante',
      'cedulaServidorEntrante',
      'profesionServidorEntrante',
      'designacionServidorEntrante',
      'nombreAuditor',
      'cedulaAuditor',
      'profesionAuditor',
      'nombreTestigo1',
      'cedulaTestigo1',
      'profesionTestigo1',
      'nombreTestigo2',
      'cedulaTestigo2',
      'profesionTestigo2',
      'nombreServidorSaliente',
      'cedulaServidorSaliente',
      'designacionServidorSaliente',
    ],
  },
  {
    // PASO 3 (Índice 2)
    id: 3,
    title: 'Anexo I: Situación Presupuestaria', // Título simplificado
    subtitle:
      '(Artículo 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: [
      'disponeEstadoSituacionPresupuestaria',
      'disponeRelacionGastosComprometidosNoCausados',
      'disponeRelacionGastosComprometidosCausadosNoPagados',
      'disponeEstadoPresupuestarioPorPartidas',
      'disponeEstadoPresupuestarioDetalleCuentas',
    ],
  },
  {
    // PASO 4 (Índice 3)
    id: 4,
    title: 'Anexo I: Situación Financiera y Patrimonial', // Título simplificado
    subtitle:
      '(Artículo 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: [
      'disponeEstadosFinancieros',
      'disponeBalanceComprobacion',
      'disponeEstadoSituacionFinanciera',
      'disponeEstadoRendimientoFinanciero',
      'disponeEstadoMovimientosPatrimonio',
      'disponeRelacionCuentasPorCobrar',
      'disponeRelacionCuentasPorPagar',
      'disponeRelacionCuentasFondosTerceros',
      'disponeSituacionFondosAnticipo',
      'disponeSituacionCajaChica',
      'disponeActaArqueoCajasChicas',
      'disponeListadoRegistroAuxiliarProveedores',
      'disponeReportesLibrosContables',
      'disponeReportesCuentasBancarias',
      'disponeReportesConciliacionesBancarias',
      'disponeReportesRetenciones',
      'disponeReporteProcesosContrataciones',
      'disponeReporteFideicomisoPrestaciones',
      'disponeReporteBonosVacacionales',
    ],
  },
  {
    // PASO 5 (Índice 4)
    id: 5,
    title: 'Anexo II: Cargos Existentes', // Título simplificado
    subtitle:
      '(Artículo 11.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: [
      'disponeCuadroResumenCargos',
      'disponeCuadroResumenValidadoRRHH',
      'disponeReporteNominas',
    ],
  },
  {
    // PASO 6 (Índice 5)
    id: 6,
    title: 'Anexo III: Inventario de Bienes', // Título simplificado
    subtitle:
      '(Artículo 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: ['disponeInventarioBienes'],
  },
  {
    // PASO 7 (Índice 6)
    id: 7,
    title: 'Anexo IV: Ejecución Plan Operativo', // Título simplificado
    subtitle:
      '(Artículo 11.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: [
      'disponeEjecucionPlanOperativo',
      'incluyeCausasIncumplimientoMetas',
      'disponePlanOperativoAnual',
    ],
  },
  {
    // PASO 8 (Índice 7)
    id: 8,
    title: 'Anexo V: Índice General del Archivo', // Título simplificado
    subtitle:
      '(Artículo 11.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: ['disponeClasificacionArchivo', 'incluyeUbicacionFisicaArchivo'],
  },
  {
    // PASO 9 (Índice 8) - ANEXOS ADICIONALES (DINÁMICO)
    id: 9,
    title: 'Anexos Adicionales',
    subtitle:
      '(Artículo 11.6 y Artículos 12 al 17 y 20 Resolución CGR N.º 01-000162)', // Combinando subtítulos
    fields: ['Anexo_VI', 'Anexo_VII'], // Campos originales, el VII es el dropdown
  },
  {
    // PASO 10 (Índice 9) - FINALIZACIÓN
    id: 10, // Re-numerado
    title: 'Finalización y Envío',
    subtitle: 'Último paso antes de generar su acta.',
    fields: ['interesProducto'],
  },
];

// --- DATOS PARA EL DROPDOWN DEL PASO 9 ---
// Copiado de acta-ma-constants
export const anexosAdicionalesTitulos = [
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
  { shortTitle: 'Ministerio de Finanzas', longTitle: 'MINISTERIO DE FINANZAS' },
  {
    shortTitle: 'Gobernaciones / Hacienda Estadal',
    longTitle: 'GOBERNACIONES, OFICINAS O DEPENDENCIAS DE HACIENDA ESTADAL',
  },
  {
    shortTitle: 'Alcaldías / Hacienda Municipal',
    longTitle: 'ALCALDÍAS, DIRECCIÓN DE HACIENDA DISTRITAL O MUNICIPAL',
  },
  {
    shortTitle: 'Relación de Informes de Auditorías',
    longTitle: 'RELACIÓN DE INFORMES DE AUDITORÍAS',
  },
  {
    shortTitle: 'Deficiencias y Errores del Acta',
    longTitle:
      'DEFICIENCIAS, ERRORES U OMISIONES DEL ACTA DE ENTREGA QUE SE ADVIRTIERON, ASÍ COMO CUALESQUIERA OTRAS SITUACIONES ESPECIALES QUE CONVENGA SEÑALAR EN EL MOMENTO DEL ACTO DE ENTREGA Y RECEPCIÓN',
  },
  { shortTitle: 'NO APLICA', longTitle: 'NO APLICA' }, // Añadir NO APLICA
];

// --- CONTENIDO DINÁMICO DEL PASO 9 ---
// Copiado de acta-ma-constants y adaptado
export const dynamicStepContent: DynamicContent = {
  'UNIDADES ADMINISTRADORAS': {
    type: 'questions',
    title: 'Anexo VII: Unidades Administradoras', // Título de la sección dinámica
    subtitle: '(Artículo 53 Reglamento Nº 1 LOAFSP)', // Base legal
    questions: [
      {
        name: 'disponeRelacionMontosFondosAsignados',
        label:
          '¿Dispone usted del documento Relación de los montos de los fondos asignados?',
      },
      {
        name: 'disponeSaldoEfectivoFondos',
        label:
          '¿Dispone usted del documento Saldo en efectivo de dichos fondos?',
      },
      {
        name: 'disponeRelacionBienesAsignados',
        label: '¿Dispone usted del documento Relación de los bienes asignados?',
      },
      {
        name: 'disponeRelacionBienesAsignadosUnidadBienes',
        label:
          '¿Dispone usted del documento Relación de los bienes asignados emitida por la Unidad de Bienes?',
      },
      {
        name: 'disponeEstadosBancariosConciliados',
        label:
          '¿Dispone usted del documento Estados bancarios actualizados y conciliados a la fecha de entrega?',
      },
      {
        name: 'disponeListaComprobantesGastos',
        label: '¿Dispone usted del documento lista de comprobantes de gastos?',
      },
      {
        name: 'disponeChequesEmitidosPendientesCobro',
        label:
          '¿Dispone usted del documento Cheques emitidos pendientes de cobro?',
      },
      {
        name: 'disponeListadoTransferenciaBancaria',
        label:
          '¿Dispone usted del documento listado o reporte de transferencia bancaria?',
      },
      {
        name: 'disponeCaucionFuncionario',
        label:
          '¿Dispone usted del documento Caución del funcionario encargado...?',
      },
    ],
  },
  'ÓRGANOS O ENTIDADES QUE MANEJAN RAMOS ESPECÍFICOS': {
    type: 'questions',
    title: 'Anexo VIII: Órganos con Ramos Específicos',
    subtitle: '(Artículo 13 Resolución CGR)',
    questions: [
      {
        name: 'disponeCuadroDemostrativoRecaudado',
        label:
          '¿Dispone usted del documento cuadro demostrativo del detalle de lo liquidado y recaudado...?',
      },
    ],
  },
  'ÓRGANOS DE CONTROL FISCAL': {
    type: 'questions',
    title: 'Anexo IX: Órganos de Control Fiscal',
    subtitle: '(Artículo 14 Resolución CGR / Arts. 53-54 LOCGRSNCF)',
    questions: [
      {
        name: 'disponeRelacionExpedientesAbiertos',
        label:
          '¿Dispone usted del documento relación de los expedientes abiertos por potestad de investigación...?',
      },
    ],
  },
  'MINISTERIO DE FINANZAS': {
    type: 'questions',
    title: 'Anexo X: Ministerio de Finanzas',
    subtitle: '(Artículo 15 Resolución CGR)',
    questions: [
      {
        name: 'disponeSituacionTesoroNacional',
        label: '¿Dispone usted del documento Situación del Tesoro Nacional?',
      },
      {
        name: 'disponeInfoEjecucionPresupuestoNacional',
        label:
          '¿Dispone usted del documento información de la ejecución del presupuesto nacional...?',
      },
      {
        name: 'disponeMontoDeudaPublicaNacional',
        label:
          '¿Dispone usted del documento Monto de la deuda pública nacional...?',
      },
      {
        name: 'disponeSituacionCuentasNacion',
        label:
          '¿Dispone usted del documento Situación de las cuentas de la Nación?',
      },
    ],
  },
  'GOBERNACIONES, OFICINAS O DEPENDENCIAS DE HACIENDA ESTADAL': {
    type: 'questions',
    title: 'Anexo XI: Gobernaciones / Hacienda Estadal',
    subtitle: '(Artículo 16 Resolución CGR)',
    questions: [
      {
        name: 'disponeSituacionTesoroEstadal',
        label: '¿Dispone usted del documento Situación del Tesoro Estadal?',
      },
      {
        name: 'disponeInfoEjecucionPresupuestoEstadal',
        label:
          '¿Dispone usted del documento Información de la ejecución del presupuesto estadal...?',
      },
      {
        name: 'disponeSituacionCuentasEstado',
        label:
          '¿Dispone usted del documento Situación de las cuentas del respectivo estado?',
      },
    ],
  },
  'ALCALDÍAS, DIRECCIÓN DE HACIENDA DISTRITAL O MUNICIPAL': {
    type: 'questions',
    title: 'Anexo XII: Alcaldías / Hacienda Municipal',
    subtitle: '(Artículo 17 Resolución CGR)',
    questions: [
      {
        name: 'disponeSituacionTesoroDistritalMunicipal',
        label:
          '¿Dispone usted del documento Situación del tesoro distrital o municipal?',
      },
      {
        name: 'disponeInfoEjecucionPresupuestoDistritalMunicipal',
        label:
          '¿Dispone usted del documento Información de la ejecución del presupuesto distrital o municipal...?',
      },
      {
        name: 'disponeSituacionCuentasDistritalesMunicipales',
        label:
          '¿Dispone usted del documento Situación de las cuentas distritales o municipales?',
      },
      {
        name: 'disponeInventarioTerrenosEjidos',
        label:
          '¿Dispone usted del documento Inventario detallado de los terrenos ejidos y propios...?',
      },
      {
        name: 'disponeRelacionIngresosVentaTerrenos',
        label:
          '¿Dispone usted del documento Relación de Ingresos producto de las ventas de terrenos...?',
      },
    ],
  },
  'RELACIÓN DE INFORMES DE AUDITORÍAS': {
    type: 'textarea',
    title: 'Anexo XIII: Relación de Informes de Auditorías',
    subtitle:
      'Acciones emprendidas por el servidor saliente sobre observaciones de Auditoría Interna.',
    fieldName: 'accionesAuditoria',
  },
  'DEFICIENCIAS, ERRORES U OMISIONES DEL ACTA DE ENTREGA QUE SE ADVIRTIERON, ASÍ COMO CUALESQUIERA OTRAS SITUACIONES ESPECIALES QUE CONVENGA SEÑALAR EN EL MOMENTO DEL ACTO DE ENTREGA Y RECEPCIÓN':
    {
      type: 'textarea',
      title: 'Anexo XIV: Deficiencias, Errores u Omisiones del Acta',
      subtitle: '(Artículo 20 Resolución CGR)',
      fieldName: 'deficienciasActa',
    },
  // 'NO APLICA' no tiene contenido dinámico asociado
};
