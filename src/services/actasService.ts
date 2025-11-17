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
import {
  complianceSchema,
  type ComplianceFormData,
} from '@/lib/pro/compliance-schema';
import { toast } from 'sonner';

// --- ACTAS ---
type ActaMaximaAutoridadData = z.infer<typeof actaMaximaAutoridadSchema>;
type ActaSalienteData = z.infer<typeof actaSalienteSchema>;
type ActaEntranteData = z.infer<typeof actaEntranteSchema>;

type ActaMaximaAutoridadProData = z.infer<typeof actaMaximaAutoridadProSchema>;
type ActaSalienteProData = z.infer<typeof actaSalienteProSchema>;
type ActaEntranteProData = z.infer<typeof actaentranteProSchema>;
//type ActaComplianceData = ComplianceFormData;
//type ComplianceFormData = z.infer<typeof complianceSchema>;

interface ActaResponse {
  message: string;
  numeroActa: string;
  id: string;
}

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
    // Importante: No lanzamos un error aquí.
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

    // AÑADIMOS EL TIPO AL CUERPO
    const body = {
      type: 'MAXIMA_AUTORIDAD_GRATIS',
      nombreEntidad: data.nombreOrgano, // Extraemos nombreOrgano
      metadata: data,
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

    // AÑADIMOS EL TIPO AL CUERPO
    const body = {
      type: 'SALIENTE_GRATIS',
      nombreEntidad: data.nombreOrgano, // Extraemos nombreOrgano
      metadata: data,
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

    // AÑADIMOS EL TIPO AL CUERPO
    const body = {
      type: 'ENTRANTE_GRATIS',
      nombreEntidad: data.nombreOrgano, // Extraemos nombreOrgano
      metadata: data,
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

    const body = {
      type: 'MAXIMA_AUTORIDAD_PAGA',
      nombreEntidad: data.nombreOrgano,
      metadata: data,
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

    const body = {
      type: 'SALIENTE_PAGA',
      nombreEntidad: data.nombreOrgano,
      metadata: data,
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

    const body = {
      type: 'ENTRANTE_PAGA',
      nombreEntidad: data.nombreOrgano,
      metadata: data,
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
 * Llama al endpoint /actas para GUARDAR un formulario de Compliance.
 */
export const createActaCompliance = async (
  data: ComplianceFormData
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const response = await apiClient.post<ActaResponse>(
      '/acta-compliance',
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // No se llama a sendActaByEmail
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || 'Error al guardar el compliance.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};
