// src/events/index.ts
import { Server } from 'socket.io';

export const registerSocketEvents = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('track-package', (packageId: string) => {
      socket.join(packageId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export const sendDeliveryUpdate = (io: Server, deliveryId: string, data: any) => {
  io.to(deliveryId).emit('delivery-update', data);
};