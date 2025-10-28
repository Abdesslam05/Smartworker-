'use client';

import { useEffect } from 'react';
import { hydrateSession } from '../store/useSession';

export const SessionHydrator = () => {
  useEffect(() => {
    hydrateSession();
  }, []);
  return null;
};
