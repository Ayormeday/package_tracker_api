// src/events/index.ts
import { Server } from 'socket.io';
import DeliveryModel, {IDelivery} from '../models/delivery';
import * as DeliveryService from "../services/delivery"

export const registerSocketEvents = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join room to track a specific package/delivery
    socket.on('track-delivery', (deliveryId: string) => {
      socket.join(deliveryId);
    });

    // Handle location changes
    socket.on('location_changed', async (data: { deliveryId: string; location: { lat: number; lng: number } }) => {
      const { deliveryId, location } = data;
      
      // Update the delivery's location in the database
      const delivery = await DeliveryModel.findOneAndUpdate(
        { deliveryId },
        { location },
        { new: true }
      );

      if (delivery) {
        // Broadcast the updated delivery details
        sendDeliveryUpdate(io, deliveryId, delivery);
      }
    });

    // Handle status changes
    socket.on('status_changed', async (data: { deliveryId: string; status: string }) => {
      const { deliveryId, status } = data;

      const delivery: any = await DeliveryService.getDeliveryById(deliveryId);
      
      delivery.status = status;
      if (delivery) {
        // Update the status and set the appropriate timestamps
        delivery.status = status;
        switch (status) {
          case 'picked-up':
            delivery.pickupTime = new Date();
            break;
          case 'in-transit':
            delivery.startTime = new Date();
            break;
          case 'delivered':
          case 'failed':
            delivery.endTime = new Date();
            break;
        }
        
        // Save the updated delivery
        const updatedDelivery = await delivery.save();

        // Broadcast the updated delivery details
        sendDeliveryUpdate(io, deliveryId, updatedDelivery);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export const sendDeliveryUpdate = (io: Server, deliveryId: string, delivery: any) => {
  io.to(deliveryId).emit('delivery_updated', { event: 'delivery_updated', delivery });
};