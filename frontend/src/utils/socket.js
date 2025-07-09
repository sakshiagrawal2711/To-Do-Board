// src/utils/socket.js
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'https://todo-backend-kehy.onrender.com', {
  transports: ['websocket'],
});

export default socket;
