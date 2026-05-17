import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

window.addEventListener('auth:logout', () => disconnectSocket());

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;
  socket = io('/ws', {
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
