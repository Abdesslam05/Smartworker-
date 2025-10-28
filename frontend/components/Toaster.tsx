'use client';

import { useToasts } from '../store/useToast';
import clsx from 'classnames';

export const Toaster = () => {
  const { toasts, removeToast } = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx('card border-l-4 p-4 shadow-lg transition', {
            'border-l-green-500': toast.type === 'success',
            'border-l-red-500': toast.type === 'error',
            'border-l-brand-accent': toast.type === 'info' || !toast.type,
          })}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-800">{toast.title}</p>
              {toast.description && <p className="text-sm text-slate-600">{toast.description}</p>}
            </div>
            <button className="text-sm text-slate-400 hover:text-slate-600" onClick={() => removeToast(toast.id)}>
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
