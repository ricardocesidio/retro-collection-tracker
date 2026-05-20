import { io, Socket } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_API_URL ?? '';

let socket: Socket | null = null;

window.addEventListener('auth:logout', () => disconnectSocket());

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;
  socket = io(`${SERVER_URL}/ws`, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
