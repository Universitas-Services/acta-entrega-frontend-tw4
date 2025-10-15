import * as z from 'zod';
import { dynamicStepContent } from './acta-ma-constants';
import { dynamicStepContentEntrante } from './acta-entrante-constants';
import { dynamicStepContentSaliente } from './acta-saliente-constants';

// Expresión regular para RIF (ej: G-20000000-0)
const rifRegex = /^[GJE]-\d{8}-\d{1}$/;
// Expresión regular para Cédula (ej: V-12345678)
const cedulaRegex = /^[VE]-\d{7,8}$/;

export const actaMaximaAutoridadSchemaBase = z.object({
  // --- Datos Generales ---
  email: z
    .string()
    .min(1, 'Campo Requerido')
    .email({ message: 'Debe ser un correo válido.' }),
  rifOrgano: z.string().regex(rifRegex, 'El RIF es requerido.'),
  denominacionCargo: z
    .string()
    .min(1, 'La denominación del cargo es requerida.'),
  nombreOrgano: z.string().min(1, 'El nombre del órgano es requerido.'),
  ciudadSuscripcion: z.string().min(1, 'La ciudad es requerida.'),
  estadoSuscripcion: z.string().min(1, 'El estado es requerido.'),
  horaSuscripcion: z.string().min(1, 'La hora es requerida.'),
  fechaSuscripcion: z.string().min(1, 'La fecha es requerida.'),
  direccionOrgano: z.string().min(1, 'La dirección es requerida.'),
  motivoEntrega: z.string().min(1, 'Debe seleccionar un motivo.'),

  // --- Servidores Públicos y Testigos ---
  nombreServidorEntrante: z.string().min(1, 'Este campo es requerido.'),
  cedulaServidorEntrante: z
    .string()
    .regex(cedulaRegex, 'La cédula es requerida.'),
  profesionServidorEntrante: z.string().min(1, 'Este campo es requerido.'),
  designacionServidorEntrante: z.string().min(1, 'Este campo es requerido.'),
  nombreAuditor: z.string().min(1, 'Este campo es requerido.'),
  cedulaAuditor: z.string().regex(cedulaRegex, 'La cédula es requerida.'),
  profesionAuditor: z.string().min(1, 'Este campo es requerido.'),
  nombreTestigo1: z.string().min(1, 'Este campo es requerido.'),
  cedulaTestigo1: z.string().regex(cedulaRegex, 'La cédula es requerida.'),
  profesionTestigo1: z.string().min(1, 'Este campo es requerido.'),
  nombreTestigo2: z.string().min(1, 'Este campo es requerido.'),
  cedulaTestigo2: z.string().regex(cedulaRegex, 'La cédula es requerida.'),
  profesionTestigo2: z.string().min(1, 'Este campo es requerido.'),
  nombreServidorSaliente: z.string().min(1, 'Este campo es requerido.'),
  cedulaServidorSaliente: z
    .string()
    .regex(cedulaRegex, 'La cédula es requerida.'),
  designacionServidorSaliente: z.string().min(1, 'Este campo es requerido.'),

  // --- Anexos (SI/NO) ---
  disponeEstadoSituacionPresupuestaria: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionGastosComprometidosNoCausados: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionGastosComprometidosCausadosNoPagados: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoPresupuestarioPorPartidas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoPresupuestarioDetalleCuentas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadosFinancieros: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeBalanceComprobacion: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeEstadoSituacionFinanciera: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoRendimientoFinanciero: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoMovimientosPatrimonio: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionCuentasPorCobrar: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionCuentasPorPagar: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionCuentasFondosTerceros: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeSituacionFondosAnticipo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeSituacionCajaChica: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeActaArqueoCajasChicas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeListadoRegistroAuxiliarProveedores: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesLibrosContables: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesCuentasBancarias: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesConciliacionesBancarias: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesRetenciones: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeReporteProcesosContrataciones: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReporteFideicomisoPrestaciones: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReporteBonosVacacionales: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeCuadroResumenCargos: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeCuadroResumenValidadoRRHH: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReporteNominas: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeInventarioBienes: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeEjecucionPlanOperativo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  incluyeCausasIncumplimientoMetas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponePlanOperativoAnual: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeClasificacionArchivo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  incluyeUbicacionFisicaArchivo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  //Paso 10
  disponeRelacionMontosFondosAsignados: z.string().optional(),
  disponeSaldoEfectivoFondos: z.string().optional(),
  disponeRelacionBienesAsignados: z.string().optional(),
  disponeRelacionBienesAsignadosUnidadBienes: z.string().optional(),
  disponeEstadosBancariosConciliados: z.string().optional(),
  disponeListaComprobantesGastos: z.string().optional(),
  disponeChequesEmitidosPendientesCobro: z.string().optional(),
  disponeListadoTransferenciaBancaria: z.string().optional(),
  disponeCaucionFuncionario: z.string().optional(),
  disponeCuadroDemostrativoRecaudado: z.string().optional(),
  disponeRelacionExpedientesAbiertos: z.string().optional(),
  disponeSituacionTesoroNacional: z.string().optional(),
  disponeInfoEjecucionPresupuestoNacional: z.string().optional(),
  disponeMontoDeudaPublicaNacional: z.string().optional(),
  disponeSituacionCuentasNacion: z.string().optional(),
  disponeSituacionTesoroEstadal: z.string().optional(),
  disponeInfoEjecucionPresupuestoEstadal: z.string().optional(),
  disponeSituacionCuentasEstado: z.string().optional(),
  disponeSituacionTesoroDistritalMunicipal: z.string().optional(),
  disponeInfoEjecucionPresupuestoDistritalMunicipal: z.string().optional(),
  disponeSituacionCuentasDistritalesMunicipales: z.string().optional(),
  disponeInventarioTerrenosEjidos: z.string().optional(),
  disponeRelacionIngresosVentaTerrenos: z.string().optional(),

  interesProducto: z.string().min(1, 'Debe seleccionar una opción.'),

  Anexo_VI: z.string().optional(),
  Anexo_VII: z
    .string()
    .min(1, 'Debe seleccionar una opción para los anexos adicionales.'),

  // --- Anexos dinámicos ---
  accionesAuditoria: z.string().optional(),
  deficienciasActa: z.string().optional(),
});

// ESQUEMA FINAL: Aplicamos la validación inteligente con superRefine
export const actaMaximaAutoridadSchema =
  actaMaximaAutoridadSchemaBase.superRefine((data, ctx) => {
    const selectedAnexo = data.Anexo_VII;

    if (!selectedAnexo || selectedAnexo === 'NO APLICA') {
      return; // Si no hay anexo seleccionado o es "NO APLICA", la validación para esta parte es exitosa.
    }

    const anexoContent =
      dynamicStepContent[selectedAnexo as keyof typeof dynamicStepContent];

    if (!anexoContent) return; // Si por alguna razón la selección no coincide, no validamos.

    if (anexoContent.type === 'questions') {
      anexoContent.questions.forEach((q) => {
        const fieldName = q.name as keyof typeof data;
        if (!data[fieldName]) {
          // Si la respuesta es vacía, null, o undefined
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [fieldName],
            message: 'Debe seleccionar una opción.',
          });
        }
      });
    } else if (anexoContent.type === 'textarea') {
      const fieldName = anexoContent.fieldName;
      if (!data[fieldName] || (data[fieldName] as string).trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: 'Este campo es requerido según su selección.',
        });
      }
    }
  });

// --- Esquema para Acta Saliente ---

export const actaSalienteSchemaBase = z.object({
  // --- Datos Generales ---
  email: z
    .string()
    .min(1, 'Campo Requerido')
    .email({ message: 'Debe ser un correo válido.' }),
  rifOrgano: z.string().regex(rifRegex, 'El RIF es requerido.'),
  denominacionCargo: z
    .string()
    .min(1, 'La denominación del cargo es requerida.'),
  nombreOrgano: z.string().min(1, 'El nombre del órgano es requerido.'),
  ciudadSuscripcion: z.string().min(1, 'La ciudad es requerida.'),
  estadoSuscripcion: z.string().min(1, 'El estado es requerido.'),
  horaSuscripcion: z.string().min(1, 'La hora es requerida.'),
  fechaSuscripcion: z.string().min(1, 'La fecha es requerida.'),
  direccionOrgano: z.string().min(1, 'La dirección es requerida.'),
  motivoEntrega: z.string().min(1, 'Debe seleccionar un motivo.'),

  // --- Servidores Públicos y Testigos ---
  nombreServidorSaliente: z.string().min(1, 'Este campo es requerido.'),
  cedulaServidorSaliente: z
    .string()
    .regex(cedulaRegex, 'La cédula es requerida.'),
  designacionServidorSaliente: z.string().min(1, 'Este campo es requerido.'),

  nombreServidorRecibe: z.string().min(1, 'Este campo es requerido.'),
  cedulaServidorRecibe: z
    .string()
    .regex(cedulaRegex, 'La cédula es requerida.'),
  designacionServidorRecibe: z.string().min(1, 'Este campo es requerido.'),

  // --- Anexos (SI/NO) ---
  disponeEstadoSituacionPresupuestaria: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionGastosComprometidosNoCausados: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionGastosComprometidosCausadosNoPagados: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoPresupuestarioPorPartidas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoPresupuestarioDetalleCuentas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadosFinancieros: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeBalanceComprobacion: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeEstadoSituacionFinanciera: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoRendimientoFinanciero: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoMovimientosPatrimonio: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionCuentasPorCobrar: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionCuentasPorPagar: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionCuentasFondosTerceros: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeSituacionFondosAnticipo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeSituacionCajaChica: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeActaArqueoCajasChicas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeListadoRegistroAuxiliarProveedores: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesLibrosContables: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesCuentasBancarias: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesConciliacionesBancarias: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesRetenciones: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeReporteProcesosContrataciones: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReporteFideicomisoPrestaciones: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReporteBonosVacacionales: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeCuadroResumenCargos: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeCuadroResumenValidadoRRHH: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReporteNominas: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeInventarioBienes: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeEjecucionPlanOperativo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  incluyeCausasIncumplimientoMetas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponePlanOperativoAnual: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeClasificacionArchivo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  incluyeUbicacionFisicaArchivo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  //Paso 10
  disponeRelacionMontosFondosAsignados: z.string().optional(),
  disponeSaldoEfectivoFondos: z.string().optional(),
  disponeRelacionBienesAsignados: z.string().optional(),
  disponeRelacionBienesAsignadosUnidadBienes: z.string().optional(),
  disponeEstadosBancariosConciliados: z.string().optional(),
  disponeListaComprobantesGastos: z.string().optional(),
  disponeChequesEmitidosPendientesCobro: z.string().optional(),
  disponeListadoTransferenciaBancaria: z.string().optional(),
  disponeCaucionFuncionario: z.string().optional(),
  disponeCuadroDemostrativoRecaudado: z.string().optional(),
  disponeRelacionExpedientesAbiertos: z.string().optional(),
  disponeSituacionTesoroNacional: z.string().optional(),
  disponeInfoEjecucionPresupuestoNacional: z.string().optional(),
  disponeMontoDeudaPublicaNacional: z.string().optional(),
  disponeSituacionCuentasNacion: z.string().optional(),
  disponeSituacionTesoroEstadal: z.string().optional(),
  disponeInfoEjecucionPresupuestoEstadal: z.string().optional(),
  disponeSituacionCuentasEstado: z.string().optional(),
  disponeSituacionTesoroDistritalMunicipal: z.string().optional(),
  disponeInfoEjecucionPresupuestoDistritalMunicipal: z.string().optional(),
  disponeSituacionCuentasDistritalesMunicipales: z.string().optional(),
  disponeInventarioTerrenosEjidos: z.string().optional(),
  disponeRelacionIngresosVentaTerrenos: z.string().optional(),

  interesProducto: z.string().min(1, 'Debe seleccionar una opción.'),

  Anexo_VI: z.string().optional(),
  Anexo_VII: z
    .string()
    .min(1, 'Debe seleccionar una opción para los anexos adicionales.'),

  // --- Anexos dinámicos ---
  accionesAuditoria: z.string().optional(),
  deficienciasActa: z.string().optional(),
});

// ESQUEMA FINAL: Aplicamos la validación inteligente con superRefine
export const actaSalienteSchema = actaSalienteSchemaBase.superRefine(
  (data, ctx) => {
    const selectedAnexo = data.Anexo_VII;

    if (!selectedAnexo || selectedAnexo === 'NO APLICA') {
      return; // Si no hay anexo seleccionado o es "NO APLICA", la validación para esta parte es exitosa.
    }

    const anexoContent =
      dynamicStepContentSaliente[
        selectedAnexo as keyof typeof dynamicStepContentSaliente
      ];

    if (!anexoContent) return; // Si por alguna razón la selección no coincide, no validamos.

    if (anexoContent.type === 'questions') {
      anexoContent.questions.forEach((q) => {
        const fieldName = q.name as keyof typeof data;
        if (!data[fieldName]) {
          // Si la respuesta es vacía, null, o undefined
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [fieldName],
            message: 'Debe seleccionar una opción.',
          });
        }
      });
    } else if (anexoContent.type === 'textarea') {
      const fieldName = anexoContent.fieldName;
      if (!data[fieldName] || (data[fieldName] as string).trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: 'Este campo es requerido según su selección.',
        });
      }
    }
  }
);

// ACTA ENTRANTE SCHEMA

export const actaEntranteSchemaBase = z.object({
  // --- Datos Generales ---
  email: z
    .string()
    .min(1, 'Campo Requerido')
    .email({ message: 'Debe ser un correo válido.' }),
  rifOrgano: z.string().regex(rifRegex, 'El RIF es requerido.'),
  denominacionCargo: z
    .string()
    .min(1, 'La denominación del cargo es requerida.'),
  nombreOrgano: z.string().min(1, 'El nombre del órgano es requerido.'),
  ciudadSuscripcion: z.string().min(1, 'La ciudad es requerida.'),
  estadoSuscripcion: z.string().min(1, 'El estado es requerido.'),
  horaSuscripcion: z.string().min(1, 'La hora es requerida.'),
  fechaSuscripcion: z.string().min(1, 'La fecha es requerida.'),
  direccionOrgano: z.string().min(1, 'La dirección es requerida.'),
  motivoEntrega: z.string().min(1, 'Debe seleccionar un motivo.'),

  // --- Servidores Públicos y Testigos ---
  nombreServidorEntrante: z.string().min(1, 'Este campo es requerido.'),
  cedulaServidorEntrante: z
    .string()
    .regex(cedulaRegex, 'La cédula es requerida.'),
  profesionServidorEntrante: z.string().min(1, 'Este campo es requerido.'),
  designacionServidorEntrante: z.string().min(1, 'Este campo es requerido.'),
  nombreAuditor: z.string().min(1, 'Este campo es requerido.'),
  cedulaAuditor: z.string().regex(cedulaRegex, 'La cédula es requerida.'),
  profesionAuditor: z.string().min(1, 'Este campo es requerido.'),
  nombreTestigo1: z.string().min(1, 'Este campo es requerido.'),
  cedulaTestigo1: z.string().regex(cedulaRegex, 'La cédula es requerida.'),
  profesionTestigo1: z.string().min(1, 'Este campo es requerido.'),
  nombreTestigo2: z.string().min(1, 'Este campo es requerido.'),
  cedulaTestigo2: z.string().regex(cedulaRegex, 'La cédula es requerida.'),
  profesionTestigo2: z.string().min(1, 'Este campo es requerido.'),
  nombreServidorSaliente: z.string().min(1, 'Este campo es requerido.'),
  cedulaServidorSaliente: z
    .string()
    .regex(cedulaRegex, 'La cédula es requerida.'),
  designacionServidorSaliente: z.string().min(1, 'Este campo es requerido.'),

  // --- Anexos (SI/NO) ---
  disponeEstadoSituacionPresupuestaria: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionGastosComprometidosNoCausados: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionGastosComprometidosCausadosNoPagados: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoPresupuestarioPorPartidas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoPresupuestarioDetalleCuentas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadosFinancieros: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeBalanceComprobacion: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeEstadoSituacionFinanciera: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoRendimientoFinanciero: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeEstadoMovimientosPatrimonio: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionCuentasPorCobrar: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionCuentasPorPagar: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeRelacionCuentasFondosTerceros: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeSituacionFondosAnticipo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeSituacionCajaChica: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeActaArqueoCajasChicas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeListadoRegistroAuxiliarProveedores: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesLibrosContables: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesCuentasBancarias: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesConciliacionesBancarias: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReportesRetenciones: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeReporteProcesosContrataciones: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReporteFideicomisoPrestaciones: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReporteBonosVacacionales: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeCuadroResumenCargos: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeCuadroResumenValidadoRRHH: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponeReporteNominas: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeInventarioBienes: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeEjecucionPlanOperativo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  incluyeCausasIncumplimientoMetas: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  disponePlanOperativoAnual: z.string().min(1, 'Debe seleccionar una opción.'),
  disponeClasificacionArchivo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  incluyeUbicacionFisicaArchivo: z
    .string()
    .min(1, 'Debe seleccionar una opción.'),
  //Paso 10
  disponeRelacionMontosFondosAsignados: z.string().optional(),
  disponeSaldoEfectivoFondos: z.string().optional(),
  disponeRelacionBienesAsignados: z.string().optional(),
  disponeRelacionBienesAsignadosUnidadBienes: z.string().optional(),
  disponeEstadosBancariosConciliados: z.string().optional(),
  disponeListaComprobantesGastos: z.string().optional(),
  disponeChequesEmitidosPendientesCobro: z.string().optional(),
  disponeListadoTransferenciaBancaria: z.string().optional(),
  disponeCaucionFuncionario: z.string().optional(),
  disponeCuadroDemostrativoRecaudado: z.string().optional(),
  disponeRelacionExpedientesAbiertos: z.string().optional(),
  disponeSituacionTesoroNacional: z.string().optional(),
  disponeInfoEjecucionPresupuestoNacional: z.string().optional(),
  disponeMontoDeudaPublicaNacional: z.string().optional(),
  disponeSituacionCuentasNacion: z.string().optional(),
  disponeSituacionTesoroEstadal: z.string().optional(),
  disponeInfoEjecucionPresupuestoEstadal: z.string().optional(),
  disponeSituacionCuentasEstado: z.string().optional(),
  disponeSituacionTesoroDistritalMunicipal: z.string().optional(),
  disponeInfoEjecucionPresupuestoDistritalMunicipal: z.string().optional(),
  disponeSituacionCuentasDistritalesMunicipales: z.string().optional(),
  disponeInventarioTerrenosEjidos: z.string().optional(),
  disponeRelacionIngresosVentaTerrenos: z.string().optional(),

  interesProducto: z.string().min(1, 'Debe seleccionar una opción.'),

  Anexo_VI: z.string().optional(),
  Anexo_VII: z
    .string()
    .min(1, 'Debe seleccionar una opción para los anexos adicionales.'),

  // --- Anexos dinámicos ---
  accionesAuditoria: z.string().optional(),
  deficienciasActa: z.string().optional(),
});

// ESQUEMA FINAL: Aplicamos la validación inteligente con superRefine
export const actaEntranteSchema = actaEntranteSchemaBase.superRefine(
  (data, ctx) => {
    const selectedAnexo = data.Anexo_VII;

    if (!selectedAnexo || selectedAnexo === 'NO APLICA') {
      return; // Si no hay anexo seleccionado o es "NO APLICA", la validación para esta parte es exitosa.
    }

    const anexoContent =
      dynamicStepContentEntrante[
        selectedAnexo as keyof typeof dynamicStepContentEntrante
      ];

    if (!anexoContent) return; // Si por alguna razón la selección no coincide, no validamos.

    if (anexoContent.type === 'questions') {
      anexoContent.questions.forEach((q) => {
        const fieldName = q.name as keyof typeof data;
        if (!data[fieldName]) {
          // Si la respuesta es vacía, null, o undefined
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [fieldName],
            message: 'Debe seleccionar una opción.',
          });
        }
      });
    } else if (anexoContent.type === 'textarea') {
      const fieldName = anexoContent.fieldName;
      if (!data[fieldName] || (data[fieldName] as string).trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: 'Este campo es requerido según su selección.',
        });
      }
    }
  }
);
