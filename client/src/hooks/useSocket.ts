'use client'
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const ENV_SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const getSocketUrl = () => {
  if (ENV_SOCKET_URL) return ENV_SOCKET_URL;
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3004';
  }
  return null;
};

let globalSocket: Socket | null = null;

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(globalSocket);

  useEffect(() => {
    const socketUrl = getSocketUrl();
    if (!socketUrl) {
      console.warn('Socket not initialized: NEXT_PUBLIC_SERVER_URL is not configured for this environment.');
      return;
    }

    if (!globalSocket) {
      console.log('Initializing socket to:', socketUrl);
      globalSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        withCredentials: true,
      });
    }
    
    setSocket(globalSocket);

    const onConnect = () => {
      console.log('Socket connected successfully to:', socketUrl);
      setSocket(globalSocket);
    };

    const onError = (err: any) => {
      console.error('Socket connection error:', err);
    };

    globalSocket.on('connect', onConnect);
    globalSocket.on('connect_error', onError);

    return () => {
      globalSocket?.off('connect', onConnect);
      globalSocket?.off('connect_error', onError);
    };
  }, []);

  return socket;
};
