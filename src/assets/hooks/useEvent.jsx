import { useContext } from "react";
import { EventContext } from "../context/EventContext";

export const useEvent = () => {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error("useEvent debe usarse dentro de EventProvider");
  }

  return context;
};
