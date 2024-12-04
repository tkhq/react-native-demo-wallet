import { useContext } from 'react';

import { SessionContext, SessionContextType } from '~/providers/session';

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within an SessionProvider');
  }
  return context;
};
