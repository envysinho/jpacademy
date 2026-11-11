import { z } from 'zod';

/** Contrato de ejemplo: GET /health. El tipo se infiere del esquema (una sola fuente de verdad). */
export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
  timestamp: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
