import { useEffect, useState } from 'react';

import { APP_NAME } from '@academy/shared';

import { api } from '../../services/api';

type ApiStatus = 'cargando' | 'conectada' | 'sin conexión';

export function DashboardPage() {
  const [status, setStatus] = useState<ApiStatus>('cargando');

  useEffect(() => {
    api
      .getHealth()
      .then(() => setStatus('conectada'))
      .catch(() => setStatus('sin conexión'));
  }, []);

  return (
    <section className="max-w-xl rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">{APP_NAME} — Web</h1>
      <p className="mt-2 text-sm text-slate-500">
        Scaffold listo. Panel de docentes y administradores en fases siguientes.
      </p>
      <p className="mt-4 text-sm">
        API: <span className="font-medium">{status}</span>
      </p>
    </section>
  );
}
