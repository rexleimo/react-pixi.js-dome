import { createContext, useContext } from "react";
import { ICanvas } from "../types/ICanvas";

type CanvasContextProps = {
  canvas?: ICanvas;
};

type CanvasProviderProps = {
  children: React.ReactNode;
  canvas?: ICanvas;
};

const CanvasContext = createContext<CanvasContextProps | null>(null);

export const CanvasProvider = ({ children, canvas }: CanvasProviderProps) => {
  return (
    <CanvasContext.Provider value={{ canvas }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
