export interface AppConfig {
  port: number;
}

/** Lee variables de entorno del servidor. Aquí NO se exponen secretos al cliente. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return { port: Number(env.API_PORT ?? 3000) };
}
