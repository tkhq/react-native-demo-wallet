import { useContext } from "react";
import { AuthRelayContext } from "~/providers/auth-provider";

export const useAuthRelay = () => {
  const context = useContext(AuthRelayContext);
  if (!context) {
    throw new Error("useAuthRelay must be used within a AuthRelayProvider");
  }
  return context;
};
