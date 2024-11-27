import { useContext } from 'react';
import { TurnkeyContext } from 'providers/turnkey';

export const useTurnkey = () => {
  const context = useContext(TurnkeyContext);
  if (!context) {
    throw new Error('useTurnkey must be used within a TurnkeyProvider');
  }
  return context;
};
