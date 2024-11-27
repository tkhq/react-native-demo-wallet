import { TurnkeyProvider } from './turnkey';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <TurnkeyProvider>{children}</TurnkeyProvider>;
};
