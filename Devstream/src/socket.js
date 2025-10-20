// socket.js
import { io } from 'socket.io-client';

export const initSocket = async () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  try {
    // 🟢 Wake up backend first
    await fetch(`${backendURL}/ping`, { method: 'GET' });
    console.log('Backend is awake ✅');
  } catch (err) {
    console.error('Failed to wake backend ❌', err);
  }

  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ['websocket'],
  };

  // 🟢 Connect socket
  return io(backendURL, options);
};
