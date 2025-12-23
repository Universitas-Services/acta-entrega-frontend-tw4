import { z } from 'zod';

// Esquema de validación para una sola acta.
export const actaSchema = z.object({
  id: z.string(),
  numero: z.string(),
  organo: z.string(),
  tipo: z.enum(['Servidor Entrante', 'Servidor Saliente', 'Máxima Autoridad']),
  estatus: z.enum(['Guardada', 'Enviada', 'Generada']),
});

export type Acta = z.infer<typeof actaSchema>;
