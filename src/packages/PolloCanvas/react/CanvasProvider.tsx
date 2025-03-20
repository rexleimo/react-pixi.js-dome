import { createContext, useContext } from "react";
import Konva from "konva";

type CanvasContextProps = {
  canvas?: Konva.Stage;
};

type CanvasProviderProps = {
  children: React.ReactNode;
  canvas?: Konva.Stage;
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
