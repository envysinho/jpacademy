import { healthResponseSchema, type HealthResponse } from '@academy/shared';

export interface ApiClient {
  getHealth(): Promise<HealthResponse>;
}

/** Cliente HTTP mínimo basado en fetch (válido en web y React Native). */
export function createApiClient(baseUrl: string): ApiClient {
  const root = baseUrl.replace(/\/+$/, '');
  return {
    async getHealth() {
      const res = await fetch(`${root}/health`);
      if (!res.ok) throw new Error(`GET /health respondió ${res.status}`);
      return healthResponseSchema.parse(await res.json());
    },
  };
}
