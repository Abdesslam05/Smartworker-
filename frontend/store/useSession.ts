import { create } from 'zustand';

type Role = 'client' | 'worker' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

interface SessionState {
  user: User | null;
  accessToken: string | null;
  setSession: (payload: { user: User; accessToken: string }) => void;
  clearSession: () => void;
}

export const useSession = create<SessionState>((set) => ({
  user: null,
  accessToken: null,
  setSession: ({ user, accessToken }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, accessToken });
  },
  clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    set({ user: null, accessToken: null });
  },
}));

export const hydrateSession = () => {
  if (typeof window === 'undefined') return;
  const token = localStorage.getItem('accessToken');
  const userRaw = localStorage.getItem('user');
  if (token && userRaw) {
    try {
      const user = JSON.parse(userRaw) as User;
      useSession.setState({ user, accessToken: token });
    } catch (error) {
      console.error('Failed to hydrate session', error);
    }
  }
};
