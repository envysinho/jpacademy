import type { ReactNode } from 'react';

import { APP_NAME } from '@academy/shared';

const NAV = ['Dashboard', 'Alumnos', 'Cursos', 'Reportes'];

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-4">
        <p className="mb-6 text-sm font-semibold">{APP_NAME}</p>
        <nav className="space-y-1">
          {NAV.map((item, i) => (
            <div
              key={item}
              className={`rounded-xl px-3 py-2 text-sm ${i === 0 ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-500'}`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
