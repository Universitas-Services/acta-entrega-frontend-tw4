// src/services/authService.ts
import apiClient from '@/lib/axios';
import axios, { AxiosError } from 'axios';
import * as z from 'zod';

// Definimos el tipo de los datos que esperamos del backend al hacer login
interface LoginResponse {
  message: string;
  token: string;
  user: {
    email: string;
    name: string;
    role: string;
  };
}

/**
 * Llama al endpoint de login del backend.
 * @param data - Objeto con email y password.
 * @returns La respuesta del servidor con el token y los datos del usuario.
 */
export const loginUser = async (
  data: z.infer<z.ZodObject<{ email: z.ZodString; password: z.ZodString }>>
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      // Si hay un error en la respuesta del servidor, lo relanzamos para que el formulario lo capture
      throw new Error(
        error.response.data.message || 'Error al iniciar sesión.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Llama al endpoint POST /auth/logout que creamos.
    // apiClient ya incluye el token de autorización automáticamente.
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Si la llamada falla (ej. por falta de internet), no queremos que el usuario
    // se quede "atrapado". Simplemente registramos el error en la consola
    // y el cierre de sesión en el frontend continuará.
    console.error('No se pudo notificar el logout al servidor:', error);
  }
};

// --- REGISTRO (NUEVO CÓDIGO) ---
interface RegisterResponse {
  message: string;
}

/**
 * Llama al endpoint de registro del backend.
 * @param data - Objeto con los datos del nuevo usuario.
 * @returns La respuesta del servidor.
 */
export const registerUser = async (
  data: z.infer<
    z.ZodObject<{
      email: z.ZodString;
      password: z.ZodString;
      name: z.ZodString;
      apellido: z.ZodOptional<z.ZodString>;
      telefono: z.ZodOptional<z.ZodString>;
      institucion: z.ZodOptional<z.ZodString>;
      cargo: z.ZodOptional<z.ZodString>;
    }>
  >
): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register',
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      // El backend puede enviar un array de errores, los unimos
      if (Array.isArray(error.response.data.errors)) {
        const messages = error.response.data.errors
          .map((e: { msg: string }) => e.msg)
          .join(', ');
        throw new Error(messages);
      }
      throw new Error(
        error.response.data.message || 'Error al registrar el usuario.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

// --- RECUPERACIÓN DE CONTRASEÑA ---

/**
 * Llama al endpoint para solicitar el envío del código OTP.
 */
export const forgotPassword = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      throw new Error(
        error.response.data.message || 'Error al solicitar el código.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

/**
 * Llama al endpoint para verificar el código OTP.
 * @returns La respuesta del servidor, que incluye un token temporal para el reseteo.
 */
export const verifyOtp = async (
  email: string,
  otp: string
): Promise<{ message: string; resetToken: string }> => {
  try {
    const response = await apiClient.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      throw new Error(
        error.response.data.message || 'Error al verificar el código.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

/**
 * Llama al endpoint para establecer la nueva contraseña.
 * @param data Objeto con la nueva contraseña y su confirmación.
 * @param resetToken El token temporal obtenido en el paso de verificación.
 */
// ▼▼▼ CORRECCIÓN ▼▼▼
// La función ahora acepta un objeto 'data' para enviar el cuerpo completo de la petición.
export const resetPassword = async (
  data: { newPassword: string; confirmPassword: string },
  resetToken: string
): Promise<{ message: string }> => {
  try {
    // Este endpoint está protegido, por lo que enviamos el token temporal como un Bearer token.
    const response = await apiClient.post('/auth/reset-password', data, {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      throw new Error(
        error.response.data.message || 'Error al actualizar la contraseña.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};

// ▼▼▼ 2. FUNCIÓN deleteAccount CORREGIDA ▼▼▼
/**
 * Llama al endpoint del backend para eliminar la cuenta del usuario.
 * @param password - La contraseña actual del usuario para confirmación.
 */
export const deleteAccount = async (
  password: string
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete('/user/delete-account', {
      data: { password }, // Para peticiones DELETE, los datos van en un objeto 'data'
    });
    return response.data;
  } catch (error) {
    // Ahora 'axios' está definido y la función funciona correctamente
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || 'Error al eliminar la cuenta.'
      );
    }
    throw new Error('No se pudo conectar con el servidor.');
  }
};
