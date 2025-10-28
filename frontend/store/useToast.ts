import { atom, useAtom } from 'jotai';

export interface Toast {
  id: number;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

const toastsAtom = atom<Toast[]>([]);

export const useToasts = () => {
  const [toasts, setToasts] = useAtom(toastsAtom);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 5000);
  };

  const removeToast = (id: number) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  return { toasts, addToast, removeToast };
};
