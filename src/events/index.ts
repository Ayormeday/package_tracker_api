import { Server } from 'socket.io';
import * as DeliveryService from '../services/delivery';

export const registerSocketEvents = (io: Server) => {
  DeliveryService.setWebSocketServer(io); // Pass the io instance to the DeliveryService

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join room to track a specific delivery
    socket.on('track-delivery', (deliveryId: string) => {
      socket.join(deliveryId);
    });

    // Handle location changes
    socket.on('location_changed', async (data: { deliveryId: string; location: { lat: number; lng: number } }) => {
      const { deliveryId, location } = data;

      // Update the delivery's location in the database
      const delivery = await DeliveryService.updateDeliveryLocation(deliveryId, location);
      
      if (delivery) {
        // Broadcast the updated delivery details
        sendDeliveryUpdate(io, deliveryId, delivery);
      }
    });

    // Handle status changes
    socket.on('status_changed', async (data: {
      deliveryId: string;
      status: "open" | "picked-up" | "in-transit" | "delivered" | "failed"
    }) => {
      const {
        deliveryId, status } = data;

      const updatedDelivery = await DeliveryService.updateDelivery(deliveryId, status);

      if (updatedDelivery) {
        // Broadcast the updated delivery details
        sendDeliveryUpdate(io, deliveryId, updatedDelivery);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

const sendDeliveryUpdate = (io: Server, deliveryId: string, delivery: any) => {
  io.to(deliveryId).emit('delivery_updated', { event: 'delivery_updated', delivery });
};
