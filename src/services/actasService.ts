import apiClient from '@/lib/axios';
import axios from 'axios';
import * as z from 'zod';

// Importamos los esquemas desde nuestro archivo central
import {
  actaMaximaAutoridadSchema,
  actaSalienteSchema,
  actaEntranteSchema,
} from '@/lib/schemas';

// --- ACTA MÁXIMA AUTORIDAD (YA EXISTENTE) ---
type ActaMaximaAutoridadData = z.infer<typeof actaMaximaAutoridadSchema>;
type ActaSalienteData = z.infer<typeof actaSalienteSchema>;
type ActaEntranteData = z.infer<typeof actaEntranteSchema>; // Nuevo tipo

interface ActaResponse {
  message: string;
  numeroActa: string;
  id: string;
}
export const createActaMaximaAutoridad = async (
  data: ActaMaximaAutoridadData
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }
    const response = await apiClient.post<ActaResponse>(
      '/actas/maxima-autoridad-paga',
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al crear el acta.');
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

// --- NUEVA FUNCIÓN PARA ACTA SALIENTE ---

/**
 * Llama al endpoint del backend para crear un Acta de Entrega Saliente (Gratis).
 */
// src/services/actasService.ts

// ... (el resto de tu código)

/**
 * Llama al endpoint del backend para crear un Acta de Entrega Saliente (PAGA).
 */
export const createActaSalientePaga = async (
  data: ActaSalienteData
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    // ¡CORRECCIÓN! Apuntamos al endpoint correcto del backend
    const response = await apiClient.post<ActaResponse>(
      '/actas/saliente-paga',
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || 'Error al crear el acta saliente.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

// --- NUEVO SERVICIO PARA ACTA ENTRANTE (PAGA) ---
// --- ACTA MÁXIMA AUTORIDAD (YA EXISTENTE) ---

export const createActaEntrante = async (
  data: ActaEntranteData
): Promise<ActaResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }
    const response = await apiClient.post<ActaResponse>(
      '/actas/entrante-paga',
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al crear el acta.');
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};
