import { z } from 'zod';
import { actaEntranteSchema } from './schemas'; // Importamos el schema para inferir el tipo

// Definimos el tipo FormData aquí para poder usarlo en nuestros tipos de constantes.
// Nota: Esto crea una dependencia circular de tipos, que TypeScript maneja bien.
// Si prefieres evitarla, puedes definir los fieldName como literales de string:
// fieldName: 'accionesAuditoria' | 'deficienciasActa';
type FormData = z.infer<typeof actaEntranteSchema>;

// --- TIPOS COMPARTIDOS ---

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

export type DynamicContent = {
  [key: string]: DynamicStep;
};

// --- ESTRUCTURA DE LOS PASOS ---

export const steps = [
  {
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
    id: 3,
    title:
      'Anexo I: Estado de las cuentas que reflejen la SITUACIÓN PRESUPUESTARIA, cuando sea aplicable.',
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
    id: 4,
    title:
      'Anexo I: Estado de las cuentas que reflejen la SITUACIÓN FINANCIERA Y PATRIMONIAL, cuando sea aplicable.',
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
    id: 5,
    title:
      'Anexo II.  Mención del número de cargos existentes, con señalamiento de si son empleados u obreros, fijos o contratados, así como el número de jubilados y pensionados, de ser el caso.',
    subtitle:
      '(Artículo 11.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: [
      'disponeCuadroResumenCargos',
      'disponeCuadroResumenValidadoRRHH',
      'disponeReporteNominas',
    ],
  },
  {
    id: 6,
    title: 'Anexo III.  Inventario de bienes muebles e inmuebles.',
    subtitle:
      '(Artículo 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: ['disponeInventarioBienes'],
  },
  {
    id: 7,
    title:
      'Anexo IV. Situación de la ejecución del plan operativo de conformidad con los objetivos propuestos y las metas fijadas en el presupuesto correspondiente.',
    subtitle:
      '(Artículo 11.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: [
      'disponeEjecucionPlanOperativo',
      'incluyeCausasIncumplimientoMetas',
      'disponePlanOperativoAnual',
    ],
  },
  {
    id: 8,
    title: 'Anexo V. Índice general del archivo.',
    subtitle:
      '(Artículo 11.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: ['disponeClasificacionArchivo', 'incluyeUbicacionFisicaArchivo'],
  },
  {
    id: 9,
    title: 'Anexo VI.',
    subtitle:
      '(Artículo 11.6 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    fields: ['Anexo_VI', 'Anexo_VII'],
  },
  {
    id: 10,
    title: 'Anexos Específicos',
    subtitle: 'Seleccione una opción en el paso anterior',
    fields: [],
  },
  {
    id: 11,
    title: 'Finalización y Envío',
    subtitle: 'Último paso antes de generar su acta.',
    fields: ['interesProducto'],
  },
];

// --- DATOS PARA EL SELECT DEL PASO 9 ---

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
    shortTitle: 'Gobernaciones, Oficinas o Dependencias de Hacienda Estadal',
    longTitle: 'GOBERNACIONES, OFICINAS O DEPENDENCIAS DE HACIENDA ESTADAL',
  },
  {
    shortTitle: 'Alcaldías, Dirección de Hacienda Distrital o Municipal',
    longTitle: 'ALCALDÍAS, DIRECCIÓN DE HACIENDA DISTRITAL O MUNICIPAL',
  },
  {
    shortTitle: 'Relación deInformes de Auditorías',
    longTitle: 'RELACIÓN DE INFORMES DE AUDITORÍAS',
  },
  {
    shortTitle: 'Deficiencias y Errores del Acta',
    longTitle:
      'DEFICIENCIAS, ERRORES U OMISIONES DEL ACTA DE ENTREGA QUE SE ADVIRTIERON, ASÍ COMO CUALESQUIERA OTRAS SITUACIONES ESPECIALES QUE CONVENGA SEÑALAR EN EL MOMENTO DEL ACTO DE ENTREGA Y RECEPCIÓN',
  },
];

// --- CONTENIDO DINÁMICO DEL PASO 10 ---

export const dynamicStepContentEntrante: DynamicContent = {
  'UNIDADES ADMINISTRADORAS': {
    type: 'questions',
    title: 'Anexo VII. UNIDADES ADMINISTRADORAS',
    subtitle:
      '(Artículo 53 Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público Sobre el Sistema Presupuestario.)',
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
          '¿Dispone usted del documento Caución del funcionario encargado de la Administración de los recursos financieros a la fecha del cese de funciones?',
      },
    ],
  },
  'ÓRGANOS O ENTIDADES QUE MANEJAN RAMOS ESPECÍFICOS': {
    type: 'questions',
    title: 'Anexo VIII. ÓRGANOS O ENTIDADES QUE MANEJAN RAMOS ESPECÍFICOS',
    subtitle: '(Artículo 13 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    questions: [
      {
        name: 'disponeCuadroDemostrativoRecaudado',
        label:
          '¿Dispone usted del documento cuadro demostrativo del detalle de lo liquidado y recaudado por los rubros respectivos, y de los derechos pendientes de recaudación de años anteriores?',
      },
    ],
  },
  'ÓRGANOS DE CONTROL FISCAL': {
    type: 'questions',
    title: 'Anexo IX. ÓRGANOS DE CONTROL FISCAL',
    subtitle:
      '(Artículo 14 Resolución CGR N.º 01-000162 de fecha 27-07-2009 y el Título III Artículos 53 y 54 de la Ley Orgánica de la Contraloría General de la República y del Sistema Nacional de Control Fiscal, con indicación del estado en que se encuentran.)',
    questions: [
      {
        name: 'disponeRelacionExpedientesAbiertos',
        label:
          '¿Dispone usted del documento relación de los expedientes abiertos con ocasión del ejercicio de la potestad de investigación, así como de los procedimientos administrativos para la determinación de responsabilidades?',
      },
    ],
  },
  'MINISTERIO DE FINANZAS': {
    type: 'questions',
    title: 'Anexo X. MINISTERIO DE FINANZAS',
    subtitle: 'Base: Artículo 14 Resolución CGR N.º 01-000162',
    questions: [
      {
        name: 'disponeSituacionTesoroNacional',
        label: '¿Dispone usted del documento Situación del Tesoro Nacional?',
      },
      {
        name: 'disponeInfoEjecucionPresupuestoNacional',
        label:
          '¿Dispone usted del documento información de la ejecución del presupuesto nacional de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores?',
      },
      {
        name: 'disponeMontoDeudaPublicaNacional',
        label:
          '¿Dispone usted del documento Monto de la deuda pública nacional interna y externa?',
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
    title:
      'Anexo XI. GOBERNACIONES, OFICINAS O DEPENDENCIAS DE HACIENDA ESTADAL',
    subtitle: '(Artículo 16 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    questions: [
      {
        name: 'disponeSituacionTesoroEstadal',
        label: '¿Dispone usted del documento Situación del Tesoro Estadal?',
      },
      {
        name: 'disponeInfoEjecucionPresupuestoEstadal',
        label:
          '¿Dispone usted del documento Información de la ejecución del presupuesto estadal de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores?',
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
    title: 'Anexo XII. ALCALDÍAS, DIRECCIÓN DE HACIENDA DISTRITAL O MUNICIPAL',
    subtitle: '(Artículo 17 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
    questions: [
      {
        name: 'disponeSituacionTesoroDistritalMunicipal',
        label:
          '¿Dispone usted del documento Situación del tesoro distrital o municipal?',
      },
      {
        name: 'disponeInfoEjecucionPresupuestoDistritalMunicipal',
        label:
          '¿Dispone usted del documento Información de la ejecución del presupuesto distrital o municipal de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores?',
      },
      {
        name: 'disponeSituacionCuentasDistritalesMunicipales',
        label:
          '¿Dispone usted del documento Situación de las cuentas distritales o municipales?',
      },
      {
        name: 'disponeInventarioTerrenosEjidos',
        label:
          '¿Dispone usted del documento Inventario detallado de los terrenos ejidos y de los terrenos propios distritales o municipales?',
      },
      {
        name: 'disponeRelacionIngresosVentaTerrenos',
        label:
          '¿Dispone usted del documento Relación de Ingresos producto de las ventas de terrenos ejidos o terrenos propios distritales o municipales?',
      },
    ],
  },
  'RELACIÓN DE INFORMES DE AUDITORÍAS': {
    type: 'textarea',
    title: 'Anexo XIII. RELACIÓN DE INFORMES DE AUDITORÍAS',
    subtitle:
      'DE LAS ACCIONES EMPRENDIDAS POR EL SERVIDOR SALIENTE COMO CONSECUENCIA DE LAS OBSERVACIONES FORMULADAS POR LA UNIDAD DE AUTIRORÍA INTERNA DE LA UNIDAD ORGANIZATIVA QUE ENTREGA, PRODUCTO DE LAS ÚLTIMAS ACTUACIONES DE ESTAS.',
    fieldName: 'accionesAuditoria',
  },

  'DEFICIENCIAS, ERRORES U OMISIONES DEL ACTA DE ENTREGA QUE SE ADVIRTIERON, ASÍ COMO CUALESQUIERA OTRAS SITUACIONES ESPECIALES QUE CONVENGA SEÑALAR EN EL MOMENTO DEL ACTO DE ENTREGA Y RECEPCIÓN':
    {
      type: 'textarea',
      title:
        'Anexo XIV. INDICAR LAS DEFICIENCIAS, ERRORES U OMISIONES  DEL ACTA DE ENTREGA QUE SE ADVIRTIERON, ASÍ COMO CUALESQUIERA OTRAS SITUACIONES ESPECIALES QUE CONVENGA SEÑALAR EN EL MOMENTO DEL ACTO DE ENTREGA Y RECEPCIÓN DE LA ÓRGANO, ENTIDAD, DIRECCIÓN, COORDINACIÓN EN RESGUARDO DE LA DEBIDA DELIMITACIÓN DE RESPONSABILIDADES.',
      subtitle:
        '(Artículo 20 Resolución CGR N.º 01-000162 de fecha 27-07-2009)',
      fieldName: 'deficienciasActa',
    },
};
