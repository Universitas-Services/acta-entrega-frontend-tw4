import apiClient from '@/lib/axios';
import axios from 'axios';
import * as z from 'zod';

import {
  actaMaximaAutoridadSchema,
  actaSalienteSchema,
  actaEntranteSchema,
  actaMaximaAutoridadProSchema,
  actaSalienteProSchema,
  actaentranteProSchema,
} from '@/lib/schemas';
import { type ComplianceFormData } from '@/lib/pro/compliance-schema';
import { toast } from 'sonner';

// --- TIPOS Y SCHEMAS ---
type ActaMaximaAutoridadData = z.infer<typeof actaMaximaAutoridadSchema>;
type ActaSalienteData = z.infer<typeof actaSalienteSchema>;
type ActaEntranteData = z.infer<typeof actaEntranteSchema>;

type ActaMaximaAutoridadProData = z.infer<typeof actaMaximaAutoridadProSchema>;
type ActaSalienteProData = z.infer<typeof actaSalienteProSchema>;
type ActaEntranteProData = z.infer<typeof actaentranteProSchema>;

// Definimos un tipo unificado para la metadata
// Esto reemplaza el uso de 'any' con los tipos reales que manejas
export type ActaMetadata =
  | ActaMaximaAutoridadData
  | ActaSalienteData
  | ActaEntranteData
  | ActaMaximaAutoridadProData
  | ActaSalienteProData
  | ActaEntranteProData
  | ComplianceFormData
  | Record<string, unknown>;

// --- RESPUESTAS DE API ---
interface ActaResponse {
  message: string;
  numeroActa: string;
  id: string;
}

interface ComplianceResponse {
  message: string;
  numeroCompliance: string;
  id: string;
}

// --- INTERFACES DE ENTIDADES ---
export interface Acta {
  id: string;
  numeroActa: string | null;
  nombreEntidad: string | null;
  type: string; // 'ENTRANTE_GRATIS', 'MAXIMA_AUTORIDAD_PAGA', etc.
  status: 'GUARDADA' | 'DESCARGADA' | 'ENVIADA';
  metadata: ActaMetadata;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean; // Indica si el acta está completa
}

export interface ComplianceActa {
  id: string;
  numeroCompliance: string | null; // Identificador visible (Ej: COMP-2024-001)
  nombreEntidad: string | null; // Nombre del órgano
  status: 'GUARDADA' | 'DESCARGADA' | 'ENVIADA'; // Estatus del checklist
  puntajeCalculado: number; // Score/Puntuación calculada (0-100)
  metadata?: Record<string, unknown>; // Metadata opcional si se necesita detalle
  createdAt: string;
  updatedAt: string;
}

// --- INTERFACES DE PARÁMETROS DE BÚSQUEDA ---

// Definimos la interfaz para los parámetros de búsqueda (Query Params)
// Coincide con el DTO "GetActasFilterDto" del backend
export interface GetActasParams {
  search?: string;
  page?: number;
  limit?: number;
  type?: string; // 'ENTRANTE_GRATIS', 'SALIENTE_PAGA', etc.
  status?: string; // 'GUARDADA', 'ENVIADA', etc.
  startDate?: string; // Formato YYYY-MM-DD
  endDate?: string; // Formato YYYY-MM-DD
}

// --- INTERFACES DE RESPUESTA PAGINADA ---

export interface GetComplianceParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: string; // Solo filtramos por status en Compliance
}

// Definimos la estructura de respuesta paginada
export interface ActasPaginatedResponse {
  data: Acta[]; // El array de actas ahora vive aquí adentro
  total: number; // Total de registros en BD (para calcular páginas)
  page: number; // Página actual
  limit: number; // Items por página
  totalPages?: number; // Opcional, útil para la UI
  // Agregamos esto para que TS sepa que puede venir un objeto meta
  meta?: {
    total: number;
    lastPage?: number;
    currentPage?: number;
    perPage?: number;
    prev?: number | null;
    next?: number | null;
  };
}

export interface CompliancePaginatedResponse {
  data: ComplianceActa[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
  meta?: {
    total: number;
    lastPage?: number;
    currentPage?: number;
    perPage?: number;
    prev?: number | null;
    next?: number | null;
  };
}

/**
 * Obtiene las actas del usuario con soporte para Paginación, Filtros y Búsqueda.
 * GET /actas?page=1&limit=10&search=...
 */
export const getMyActas = async (
  params: GetActasParams = {} // Por defecto objeto vacío para cargar la pág 1 sin filtros
): Promise<ActasPaginatedResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No token found');

    // Enviamos 'params' en la configuración de Axios
    const response = await apiClient.get<ActasPaginatedResponse>('/actas', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        // Valor por defecto si no viene en params
        ...params, // Sobrescribimos con los filtros que envíe el componente
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching actas:', error);
    throw error;
  }
};

/**
 * Descarga el acta (GET /actas/:id/descargar-docx)
 */
export const downloadActa = async (id: string, numeroActa: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await apiClient.get(`/actas/${id}/descargar-docx`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob', // Indica que esperamos un archivo binario
    });

    // Crear un link temporal en el navegador para forzar la descarga
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Acta-${numeroActa || 'Borrador'}.docx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // Limpiar memoria

    return true;
  } catch (error) {
    console.error('Error downloading acta:', error);
    throw new Error('No se pudo descargar el archivo.');
  }
};

/**
 * Reenvía el correo (POST /actas/:id/enviar-docx)
 */
export const resendActaEmail = async (id: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    await apiClient.post(
      `/actas/${id}/enviar-docx`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('No se pudo enviar el correo.');
  }
};

/**
 * Elimina un acta (DELETE /actas/:id)
 */
export const deleteActa = async (id: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    await apiClient.delete(`/actas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error('Error deleting acta:', error);
    throw new Error('No se pudo eliminar el acta.');
  }
};

/**
 * Obtiene un acta específica por su ID (GET /actas/:id)
 * Útil para precargar formularios de edición.
 */
export const getActaById = async (id: string): Promise<Acta> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No token found');

    const response = await apiClient.get<Acta>(`/actas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching acta ${id}:`, error);
    throw error;
  }
};

/**
 * Actualiza un acta existente (PATCH /actas/:id)
 * Se usa para guardar borradores o actualizaciones parciales.
 */
export const updateActa = async (
  id: string,
  data:
    | Partial<ActaMaximaAutoridadProData>
    | Partial<ActaSalienteProData>
    | Partial<ActaEntranteProData>
    | Partial<ActaMaximaAutoridadData>
    | Partial<ActaSalienteData>
    | Partial<ActaEntranteData>
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No token found');

    // --- CORRECCIÓN: LIMPIEZA DE DATOS ---
    // Filtramos los valores vacíos para evitar enviar strings vacíos ""
    // que el backend podría interpretar erróneamente como "completados".
    const cleanMetadata: Record<string, unknown> = {};

    Object.keys(data).forEach((key) => {
      // Tipamos la llave para acceder de forma segura
      const typedKey = key as keyof typeof data;
      const value: unknown = data[typedKey];

      // Normalización de "NO APLICA" (Por consistencia con el create)
      /*if (typeof value === 'string' && value === 'NO APLICA') {
        value = 'NO_APLICA';
      }*/

      // Solo guardamos el valor si NO es null, NO es undefined y NO es string vacío
      if (value !== null && value !== undefined && value !== '') {
        cleanMetadata[key] = value;
      }
    });

    // El backend espera que los campos del formulario estén dentro de "metadata".
    // Además, actualizamos "nombreEntidad" si viene "nombreOrgano" en los datos.
    const body = {
      metadata: cleanMetadata,
      // Ojo: data.nombreOrgano podría venir undefined si no se tocó en el form,
      // así que accedemos a cleanMetadata o verificamos antes.
      ...(data.nombreOrgano && { nombreEntidad: data.nombreOrgano }),
    };

    const response = await apiClient.patch<ActaResponse>(`/actas/${id}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Si el error es un array de mensajes (como se ve en tu captura), lo unimos
      const message = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(', ')
        : error.response.data.message || 'Error al actualizar el acta.';
      throw new Error(message);
    }
    throw new Error('No se pudo conectar con el servidor para actualizar.');
  }
};

// --- FUNCIÓN HELPER INTERNA ---

/**
 * Dispara el envío del correo electrónico para un acta recién creada.
 * No lanza un error si falla, solo lo reporta en la consola.
 * @param actaId - El ID del acta recién creada
 * @param token - El token de autenticación
 */
const sendActaByEmail = async (actaId: string, token: string) => {
  if (!actaId) return; // No hacer nada si no hay ID

  try {
    //Llamar al endpoint de envío de correo
    await apiClient.post(
      `/actas/${actaId}/enviar-docx`, // Endpoint de envío
      {}, // No requiere body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`Solicitud de envío para Acta ${actaId} exitosa.`);
  } catch (sendError) {
    // No lanzamos un error aquí.
    // El acta se creó con éxito, no queremos que la UI muestre un error
    // solo porque falló el envío del correo.
    console.error(
      `Acta ${actaId} creada, pero falló el envío de correo:`,
      toast.error(
        'El acta se creó, pero no se pudo enviar el correo electrónico.'
      ),
      sendError
    );
  }
};

/**
 * Llama al endpoint unificado /actas para crear un Acta de Máxima Autoridad (EXPRESS).
 */
export const createActaMaximaAutoridad = async (
  data: ActaMaximaAutoridadData
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    // Creamos un nuevo objeto solo con los valores válidos
    const cleanMetadata: Record<string, unknown> = {};

    Object.keys(data).forEach((key) => {
      // Tipamos la llave para acceder a data con seguridad
      const typedKey = key as keyof typeof data;
      const value: unknown = data[typedKey];

      // Normalización de "NO APLICA"
      /*if (typeof value === 'string' && value === 'NO APLICA') {
        value = 'NO_APLICA';
      }*/

      // Solo guardamos el valor si NO es null, NO es undefined y NO es string vacío
      if (value !== null && value !== undefined && value !== '') {
        cleanMetadata[key] = value;
      }
    });

    // AÑADIMOS EL TIPO AL CUERPO
    const body = {
      type: 'MAXIMA_AUTORIDAD_GRATIS',
      nombreEntidad: data.nombreOrgano, // Extraemos nombreOrgano
      metadata: cleanMetadata,
    };

    // Crear el acta
    const createResponse = await apiClient.post<ActaResponse>(
      '/actas',
      body, // Enviamos el cuerpo con el tipo
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Enviar el correo (lo hacemos en segundo plano)
    // Usamos "await" para asegurar que se intente antes de devolver la respuesta
    await sendActaByEmail(createResponse.data.id, token);

    // Devolvemos la respuesta de la creación
    return createResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al crear el acta.');
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

/**
 * Llama al endpoint unificado /actas para crear un Acta de Entrega Saliente (EXPRESS).
 */
export const createActaSalientePaga = async (
  data: ActaSalienteData
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    // Creamos un nuevo objeto solo con los valores válidos
    const cleanMetadata: Record<string, unknown> = {};

    Object.keys(data).forEach((key) => {
      // Tipamos la llave para acceder a data con seguridad
      const typedKey = key as keyof typeof data;
      const value: unknown = data[typedKey];

      // Normalización de "NO APLICA"
      /*if (typeof value === 'string' && value === 'NO APLICA') {
        value = 'NO_APLICA';
      }*/

      // Solo guardamos el valor si NO es null, NO es undefined y NO es string vacío
      if (value !== null && value !== undefined && value !== '') {
        cleanMetadata[key] = value;
      }
    });

    // AÑADIMOS EL TIPO AL CUERPO
    const body = {
      type: 'SALIENTE_GRATIS',
      nombreEntidad: data.nombreOrgano,
      metadata: cleanMetadata,
    };

    // Crear el acta
    const createResponse = await apiClient.post<ActaResponse>(
      '/actas',
      body, // Enviamos el cuerpo con el tipo
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Enviar el correo (lo hacemos en segundo plano)
    // Usamos "await" para asegurar que se intente antes de devolver la respuesta
    await sendActaByEmail(createResponse.data.id, token);

    // Devolvemos la respuesta de la creación
    return createResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || 'Error al crear el acta saliente.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

/**
 * Llama al endpoint unificado /actas para crear un Acta de Entrega Entrante (PAGA).
 */
export const createActaEntrante = async (
  data: ActaEntranteData
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    // Creamos un nuevo objeto solo con los valores válidos
    const cleanMetadata: Record<string, unknown> = {};

    Object.keys(data).forEach((key) => {
      // Tipamos la llave para acceder a data con seguridad
      const typedKey = key as keyof typeof data;
      const value: unknown = data[typedKey];

      // Normalización de "NO APLICA"
      /*if (typeof value === 'string' && value === 'NO APLICA') {
        value = 'NO_APLICA';
      }*/

      // Solo guardamos el valor si NO es null, NO es undefined y NO es string vacío
      if (value !== null && value !== undefined && value !== '') {
        cleanMetadata[key] = value;
      }
    });

    // AÑADIMOS EL TIPO AL CUERPO
    const body = {
      type: 'ENTRANTE_GRATIS',
      nombreEntidad: data.nombreOrgano, // Extraemos nombreOrgano
      metadata: cleanMetadata,
    };

    // Crear el acta
    const createResponse = await apiClient.post<ActaResponse>(
      '/actas',
      body, // Enviamos el cuerpo con el tipo
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Enviar el correo (lo hacemos en segundo plano)
    // Usamos "await" para asegurar que se intente antes de devolver la respuesta
    await sendActaByEmail(createResponse.data.id, token);

    // Devolvemos la respuesta de la creación
    return createResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al crear el acta.');
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

/**
 * Llama al endpoint /actas para GUARDAR un Acta de Máxima Autoridad (PRO).
 */
export const createActaMaximaAutoridadPro = async (
  data: ActaMaximaAutoridadProData
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    // Creamos un nuevo objeto solo con los valores válidos
    const cleanMetadata: Record<string, unknown> = {};

    Object.keys(data).forEach((key) => {
      // Excluir tiempoRealizacion del metadata (se envía como campo separado)
      if (key === 'tiempoRealizacion') return;
      // Tipamos la llave para acceder a data con seguridad
      const typedKey = key as keyof typeof data;
      const value: unknown = data[typedKey];

      // Normalización de "NO APLICA"
      /*if (typeof value === 'string' && value === 'NO APLICA') {
        value = 'NO_APLICA';
      }*/

      // Solo guardamos el valor si NO es null, NO es undefined y NO es string vacío
      if (value !== null && value !== undefined && value !== '') {
        cleanMetadata[key] = value;
      }
    });

    // AÑADIMOS EL TIPO AL CUERPO
    const body = {
      type: 'MAXIMA_AUTORIDAD_PAGA',
      nombreEntidad: data.nombreOrgano,
      metadata: cleanMetadata,
      tiempoRealizacion: data.tiempoRealizacion,
    };

    const response = await apiClient.post<ActaResponse>('/actas', body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // No se llama a sendActaByEmail
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || 'Error al guardar el acta PRO.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

/**
 * Llama al endpoint /actas para GUARDAR un Acta Saliente (PRO).
 */
export const createActaSalientePro = async (
  data: ActaSalienteProData
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    // Creamos un nuevo objeto solo con los valores válidos
    const cleanMetadata: Record<string, unknown> = {};

    Object.keys(data).forEach((key) => {
      // Excluir tiempoRealizacion del metadata (se envía como campo separado)
      if (key === 'tiempoRealizacion') return;

      // Tipamos la llave para acceder a data con seguridad
      const typedKey = key as keyof typeof data;
      const value: unknown = data[typedKey];

      // Normalización de "NO APLICA"
      /*if (typeof value === 'string' && value === 'NO APLICA') {
        value = 'NO_APLICA';
      }*/

      // Solo guardamos el valor si NO es null, NO es undefined y NO es string vacío
      if (value !== null && value !== undefined && value !== '') {
        cleanMetadata[key] = value;
      }
    });

    // AÑADIMOS EL TIPO AL CUERPO
    const body = {
      type: 'SALIENTE_PAGA',
      nombreEntidad: data.nombreOrgano,
      metadata: cleanMetadata,
      tiempoRealizacion: data.tiempoRealizacion,
    };

    const response = await apiClient.post<ActaResponse>('/actas', body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // No se llama a sendActaByEmail
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || 'Error al guardar el acta saliente PRO.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

/**
 * Llama al endpoint /actas para GUARDAR un Acta Entrante (PRO).
 */
export const createActaEntrantePro = async (
  data: ActaEntranteProData
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    // Creamos un nuevo objeto solo con los valores válidos
    const cleanMetadata: Record<string, unknown> = {};

    Object.keys(data).forEach((key) => {
      // Excluir tiempoRealizacion del metadata (se envía como campo separado)
      if (key === 'tiempoRealizacion') return;
      // Tipamos la llave para acceder a data con seguridad
      const typedKey = key as keyof typeof data;
      const value: unknown = data[typedKey];

      // Normalización de "NO APLICA"
      /*if (typeof value === 'string' && value === 'NO APLICA') {
        value = 'NO_APLICA';
      }*/

      // Solo guardamos el valor si NO es null, NO es undefined y NO es string vacío
      if (value !== null && value !== undefined && value !== '') {
        cleanMetadata[key] = value;
      }
    });

    // AÑADIMOS EL TIPO AL CUERPO
    const body = {
      type: 'ENTRANTE_PAGA',
      nombreEntidad: data.nombreOrgano,
      metadata: cleanMetadata,
      tiempoRealizacion: data.tiempoRealizacion,
    };

    const response = await apiClient.post<ActaResponse>('/actas', body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // No se llama a sendActaByEmail
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || 'Error al guardar el acta entrante PRO.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

/**
 * Obtiene los checklists de compliance del usuario (GET /acta-compliance/my-checklists)
 */
export const getMyComplianceChecklists = async (
  params: GetComplianceParams = {}
): Promise<CompliancePaginatedResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No token found');

    const response = await apiClient.get<CompliancePaginatedResponse>(
      '/acta-compliance/my-checklists',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...params }, // Pasa search, page, limit, status
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching compliance checklists:', error);
    throw error;
  }
};

/**
 * Descarga un acta de compliance (GET /acta-compliance/{id}/download)
 */
export const downloadCompliance = async (
  id: string,
  numeroCompliance: string
) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await apiClient.get(`/acta-compliance/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob', // Importante para descarga
    });

    // Crear link de descarga
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    // Nombre sugerido: Compliance-Numero.pdf o similar
    link.setAttribute(
      'download',
      `Compliance-${numeroCompliance || 'Borrador'}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error: unknown) {
    // --- MANEJO DE ERRORES TIPADO CORRECTAMENTE ---
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.data instanceof Blob
    ) {
      const errorText = await error.response.data.text();
      try {
        const errorJson = JSON.parse(errorText) as { message?: string };
        // Lanzamos el mensaje que viene del backend
        throw new Error(
          errorJson.message ||
            'Error interno del servidor al generar el archivo.'
        );
      } catch (e) {
        throw new Error(
          'Error crítico en el servidor: ' + errorText.substring(0, 100)
        );
      }
    }

    console.error('Error downloading compliance:', error);
    throw error;
  }
};

/**
 * Envía el reporte de compliance por correo (POST /acta-compliance/{id}/email)
 */
export const sendComplianceEmail = async (id: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    await apiClient.post(
      `/acta-compliance/${id}/email`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return true;
  } catch (error: unknown) {
    console.error('Error sending compliance email:', error);

    if (axios.isAxiosError(error) && error.response) {
      // Extraer mensaje del backend de forma segura
      const data = error.response.data as { message?: string } | string;
      let msg = error.message;

      if (typeof data === 'object' && data !== null && 'message' in data) {
        msg = data.message || msg;
      } else if (typeof data === 'string') {
        msg = data;
      }

      console.error('🔥 DETALLE ERROR EMAIL:', data);
      throw new Error(msg);
    }
    throw new Error('No se pudo enviar el correo de compliance.');
  }
};

/**
 * 1. TRIGGER: Dispara el análisis de IA.
 * Se llama internamente después de crear el acta.
 */
export const triggerComplianceAnalysis = async (id: number | string) => {
  try {
    // Asumimos que este endpoint inicia el proceso en background
    await apiClient.post(`/acta-compliance/${id}/analisis-ia`);
    console.log(`Análisis IA disparado para el acta ${id}`);
  } catch (error) {
    // No lanzamos error para no interrumpir el flujo del usuario,
    // pero logueamos que el análisis automático falló al iniciarse.
    console.error('Error al disparar el análisis de IA:', error);
  }
};

/**
 * 2. GET: Obtiene las observaciones ya generadas.
 * Se usa en el Panel de Actas al abrir el Sheet.
 */
export const getObservacionesCompliance = async (id: number | string) => {
  try {
    const response = await apiClient.get(`/acta-compliance/${id}/analisis-ia`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener observaciones:', error);
    // Si da 404 es posible que aún no existan, devolvemos null o array vacío
    return null;
  }
};

/**
 * Llama al endpoint /acta-compliance para GUARDAR un formulario de Compliance.
 * Mapea los datos y FILTRA los campos vacíos para no romper la validación del backend.
 */
export const createActaCompliance = async (
  data: ComplianceFormData
): Promise<ComplianceResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const rawPayload = {
      // --- Datos Generales ---
      correo_electronico: data.email,
      rif_organo_entidad: data.rifOrgano,
      nombre_completo_revisor: data.nombreevaluador,
      denominacion_cargo: data.denominacionCargo,
      nombre_organo_entidad: data.nombreOrgano,
      nombre_unidad_revisora: data.nombreUnidad,
      fecha_revision: data.fecha,
      codigo_documento_revisado: data.nomenclaturaActa,

      // --- Preguntas Q1 a Q21 ---
      q1_acta_contiene_lugar_suscripcion: data.acta_contiene_lugar_suscripcion,
      q2_acta_contiene_fecha_suscripcion: data.acta_contiene_fecha_suscripcion,
      q3_acta_identifica_organo_entregado:
        data.acta_identifica_organo_entregado,
      q4_acta_identifica_servidor_entrega:
        data.acta_identifica_servidor_entrega,
      q5_acta_identifica_servidor_recibe: data.acta_identifica_servidor_recibe,
      q6_acta_describe_motivo_entrega: data.acta_describe_motivo_entrega,
      q7_acta_describe_fundamento_legal: data.acta_describe_fundamento_legal,
      q8_acta_contiene_relacion_anexos_normas:
        data.acta_contiene_relacion_anexos_normas,
      q9_acta_expresa_integracion_anexos: data.acta_expresa_integracion_anexos,
      q10_acta_suscrita_por_quien_entrega: data.acta_suscrita_por_quien_entrega,
      q11_acta_suscrita_por_quien_recibe: data.acta_suscrita_por_quien_recibe,
      q12_anexa_informacion_adicional: data.anexa_informacion_adicional,
      q13_anexos_con_fecha_corte_al_cese: data.anexos_con_fecha_corte_al_cese,
      q14_acta_deja_constancia_inexistencia_info:
        data.acta_deja_constancia_inexistencia_info,
      q15_acta_especifica_errores_omisiones:
        data.acta_especifica_errores_omisiones,
      q16_acta_elaborada_original_y_3_copias:
        data.acta_elaborada_original_y_3_copias,
      q17_incluye_autorizacion_certificar_copias:
        data.incluye_autorizacion_certificar_copias,
      q18_original_archivado_despacho_autoridad:
        data.original_archivado_despacho_autoridad,
      q19_copia_certificada_entregada_a_servidor_recibe:
        data.copia_certificada_entregada_a_servidor_recibe,
      q20_copia_certificada_entregada_a_servidor_entrega:
        data.copia_certificada_entregada_a_servidor_entrega,
      q21_copia_entregada_auditoria_interna_en_plazo:
        data.copia_entregada_auditoria_interna_en_plazo,

      // --- Preguntas Q22 en adelante (Estáticas y Dinámicas) ---
      q22_anexo_estado_cuentas_general: data.anexo_estado_cuentas_general,
      q23_anexo_situacion_presupuestaria_detallada:
        data.anexo_situacion_presupuestaria_detallada,
      q24_anexo_gastos_comprometidos_no_causados:
        data.anexo_gastos_comprometidos_no_causados,
      q25_anexo_gastos_causados_no_pagados:
        data.anexo_gastos_causados_no_pagados,
      q26_anexo_estado_presupuestario_por_partidas:
        data.anexo_estado_presupuestario_por_partidas,
      q27_anexo_estado_presupuestario_por_cuentas:
        data.anexo_estado_presupuestario_por_cuentas,
      q28_anexo_estados_financieros: data.anexo_estados_financieros,
      q29_anexo_balance_comprobacion_y_notas:
        data.anexo_balance_comprobacion_y_notas,
      q30_anexo_estado_situacion_financiera_y_notas:
        data.anexo_estado_situacion_financiera_y_notas,
      q31_anexo_estado_rendimiento_financiero_y_notas:
        data.anexo_estado_rendimiento_financiero_y_notas,
      q32_anexo_estado_movimiento_patrimonio_y_notas:
        data.anexo_estado_movimiento_patrimonio_y_notas,
      q33_anexo_relacion_cuentas_por_cobrar:
        data.anexo_relacion_cuentas_por_cobrar,
      q34_anexo_relacion_cuentas_por_pagar:
        data.anexo_relacion_cuentas_por_pagar,
      q35_anexo_relacion_fondos_terceros: data.anexo_relacion_fondos_terceros,
      q36_anexo_situacion_fondos_anticipo: data.anexo_situacion_fondos_anticipo,
      q37_anexo_situacion_caja_chica: data.anexo_situacion_caja_chica,
      q38_anexo_acta_arqueo_caja_chica: data.anexo_acta_arqueo_caja_chica,
      q39_anexo_listado_registro_proveedores:
        data.anexo_listado_registro_proveedores,
      q40_anexo_reporte_libros_contables: data.anexo_reporte_libros_contables,
      q41_anexo_reporte_cuentas_bancarias: data.anexo_reporte_cuentas_bancarias,
      q42_anexo_reporte_conciliaciones_bancarias:
        data.anexo_reporte_conciliaciones_bancarias,
      q43_anexo_reporte_retenciones_pendientes:
        data.anexo_reporte_retenciones_pendientes,
      q44_anexo_reporte_contrataciones_publicas:
        data.anexo_reporte_contrataciones_publicas,
      q45_anexo_reporte_fideicomiso_prestaciones:
        data.anexo_reporte_fideicomiso_prestaciones,
      q46_anexo_reporte_bonos_vacacionales:
        data.anexo_reporte_bonos_vacacionales,
      q47_anexo_mencion_numero_cargos_rrhh:
        data.anexo_mencion_numero_cargos_rrhh,
      q48_incluye_cuadro_resumen_cargos: data.incluye_cuadro_resumen_cargos,
      q49_cuadro_resumen_cargos_validado_rrhh:
        data.cuadro_resumen_cargos_validado_rrhh,
      q50_anexo_reporte_nominas: data.anexo_reporte_nominas,
      q51_anexo_inventario_bienes: data.anexo_inventario_bienes,
      q52_inventario_bienes_fecha_entrega: data.inventario_bienes_fecha_entrega,
      q53_inventario_bienes_comprobado_fisicamente:
        data.inventario_bienes_comprobado_fisicamente,
      q54_verificada_existencia_bienes_inventario:
        data.verificada_existencia_bienes_inventario,
      q55_verificada_condicion_bienes_inventario:
        data.verificada_condicion_bienes_inventario,
      q56_inventario_indica_responsable_patrimonial:
        data.inventario_indica_responsable_patrimonial,
      q57_inventario_indica_responsable_uso:
        data.inventario_indica_responsable_uso,
      q58_inventario_indica_fecha_verificacion:
        data.inventario_indica_fecha_verificacion,
      q59_inventario_indica_numero_acta_verificacion:
        data.inventario_indica_numero_acta_verificacion,
      q60_inventario_indica_numero_registro_bien:
        data.inventario_indica_numero_registro_bien,
      q61_inventario_indica_codigo_bien: data.inventario_indica_codigo_bien,
      q62_inventario_indica_descripcion_bien:
        data.inventario_indica_descripcion_bien,
      q63_inventario_indica_marca_bien: data.inventario_indica_marca_bien,
      q64_inventario_indica_modelo_bien: data.inventario_indica_modelo_bien,
      q65_inventario_indica_serial_bien: data.inventario_indica_serial_bien,
      q66_inventario_indica_estado_conservacion_bien:
        data.inventario_indica_estado_conservacion_bien,
      q67_inventario_indica_ubicacion_bien:
        data.inventario_indica_ubicacion_bien,
      q68_inventario_indica_valor_mercado_bien:
        data.inventario_indica_valor_mercado_bien,
      q69_anexo_ejecucion_poa: data.anexo_ejecucion_poa,
      q70_incluye_ejecucion_poa_fecha_entrega:
        data.incluye_ejecucion_poa_fecha_entrega,
      q71_incluye_causas_incumplimiento_metas_poa:
        data.incluye_causas_incumplimiento_metas_poa,
      q72_incluye_plan_operativo_anual: data.incluye_plan_operativo_anual,
      q73_anexo_indice_general_archivo: data.anexo_indice_general_archivo,
      q74_archivo_indica_clasificacion: data.archivo_indica_clasificacion,
      q75_archivo_indica_ubicacion_fisica: data.archivo_indica_ubicacion_fisica,

      // Estos son los que suelen estar vacíos si no se selecciona el Anexo correspondiente
      q76_incluye_relacion_montos_fondos_asignados:
        data.incluye_relacion_montos_fondos_asignados,
      q77_incluye_saldo_efectivo_fondos: data.incluye_saldo_efectivo_fondos,
      q78_incluye_relacion_bienes_asignados:
        data.incluye_relacion_bienes_asignados,
      q79_incluye_relacion_bienes_unidad_bienes:
        data.incluye_relacion_bienes_unidad_bienes,
      q80_incluye_estados_bancarios_conciliados:
        data.incluye_estados_bancarios_conciliados,
      q81_incluye_lista_comprobantes_gastos:
        data.incluye_lista_comprobantes_gastos,
      q82_incluye_cheques_pendientes_cobro:
        data.incluye_cheques_pendientes_cobro,
      q83_incluye_reporte_transferencias_bancarias:
        data.incluye_reporte_transferencias_bancarias,
      q84_anexo_caucion_funcionario_admin: data.anexo_caucion_funcionario_admin,
      q85_incluye_cuadro_liquidado_recaudado:
        data.incluye_cuadro_liquidado_recaudado,
      q86_incluye_relacion_expedientes_investigacion:
        data.incluye_relacion_expedientes_investigacion,
      q87_incluye_situacion_tesoro_nacional:
        data.incluye_situacion_tesoro_nacional,
      q88_incluye_ejecucion_presupuesto_nacional:
        data.incluye_ejecucion_presupuesto_nacional,
      q89_incluye_monto_deuda_publica_nacional:
        data.incluye_monto_deuda_publica_nacional,
      q90_incluye_situacion_cuentas_nacion:
        data.incluye_situacion_cuentas_nacion,
      q91_incluye_situacion_tesoro_estadal:
        data.incluye_situacion_tesoro_estadal,
      q92_incluye_ejecucion_presupuesto_estadal:
        data.incluye_ejecucion_presupuesto_estadal,
      q93_incluye_situacion_cuentas_estadal:
        data.incluye_situacion_cuentas_estadal,
      q94_incluye_situacion_tesoro_municipal:
        data.incluye_situacion_tesoro_municipal,
      q95_incluye_ejecucion_presupuesto_municipal:
        data.incluye_ejecucion_presupuesto_municipal,
      q96_incluye_situacion_cuentas_municipal:
        data.incluye_situacion_cuentas_municipal,
      q97_incluye_inventario_terrenos_municipales:
        data.incluye_inventario_terrenos_municipales,
      q98_incluye_relacion_ingresos_venta_terrenos:
        data.incluye_relacion_ingresos_venta_terrenos,
    };

    // LIMPIEZA DE DATOS (FILTRO)
    // Recorremos el objeto y creamos uno nuevo SOLO con las claves que tengan valor real.
    // Eliminamos: null, undefined y strings vacíos "".

    const cleanPayload: Record<string, unknown> = {};

    Object.keys(rawPayload).forEach((key) => {
      const typedKey = key as keyof typeof rawPayload;
      let value: unknown = rawPayload[typedKey];

      // Conversión de Fecha para Prisma (ISO 8601)
      if (typedKey === 'fecha_revision' && value) {
        // Caso 1: Ya es un objeto Date válido
        if (value instanceof Date && !isNaN(value.getTime())) {
          value = value.toISOString();
        }
        // Caso 2: Es un string
        else if (typeof value === 'string') {
          // Intento directo (funciona para YYYY-MM-DD)
          const d = new Date(value);

          if (!isNaN(d.getTime())) {
            value = d.toISOString();
          } else {
            // Fallback para formato DD/MM/YYYY (común en inputs de texto fecha)
            // Si tu fecha viene como "21/11/2025"
            const parts = value.split('/');
            if (parts.length === 3) {
              // Reordenamos a YYYY-MM-DD (Mes es índice 1)
              const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
              const d2 = new Date(isoDate);
              if (!isNaN(d2.getTime())) {
                value = d2.toISOString();
              } else {
                console.warn('Fecha inválida ignorada:', value);
                value = undefined; // Evitamos enviar basura
              }
            }
          }
        }
      }

      // Normalización de respuestas "NO APLICA" a "NO_APLICA"
      if (typeof value === 'string' && value === 'NO APLICA') {
        value = 'NO_APLICA';
      }

      // Filtro: Solo guardamos valores reales (No null, undefined, ni strings vacíos)
      if (value !== null && value !== undefined && value !== '') {
        cleanPayload[key] = value;
      }
    });

    // Verificación de Token
    // El token ya fue leído y verificado al inicio de la función desde localStorage.
    // No usamos authStorage aquí.
    if (!token)
      throw new Error('No estás autenticado. Por favor, inicia sesión.');

    // ENVÍO
    const response = await apiClient.post<ComplianceResponse>(
      '/acta-compliance',
      cleanPayload, // Enviamos el objeto limpio
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Si se guardó con éxito, DISPARAR EL ANÁLISIS IA (Fire and forget)
    // No usamos 'await' bloqueante estricto si tarda mucho,
    // pero aquí lo llamamos para asegurar que el backend reciba la orden.
    if (response.data && response.data.id) {
      // Ejecutamos la petición sin detener el retorno de la respuesta principal
      triggerComplianceAnalysis(response.data.id);
    }

    return response.data;
  } catch (error) {
    console.error('🔴 ERROR REAL EN CREATE COMPLIANCE:', error);

    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(', ')
        : error.response.data.message || 'Error al guardar el compliance.';

      throw new Error(errorMessage);
    }
    // Si el error NO es de Axios (ej. TypeError, RangeError), cae aquí:
    throw new Error('No se pudo conectar con el servidor (Error Local).');
  }
};
