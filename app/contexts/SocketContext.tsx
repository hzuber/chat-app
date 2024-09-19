import { createContext, useContext, ReactNode } from "react";
import { Socket, io } from "socket.io-client";

interface SocketContext {
  socket: Socket | null;
}

interface Props {
  children: ReactNode;
}

const SocketContext = createContext<SocketContext | undefined>(undefined);

const socket = io("http://localhost:" + 3002, {
  transports: ["websocket"],
});

export const SocketProvider = ({ children }: Props) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return { socket: context.socket };
}
