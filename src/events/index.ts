import { Server } from "socket.io";
import * as DeliveryService from "../services/delivery";

export const registerSocketEvents = (io: Server) => {
  DeliveryService.setWebSocketServer(io); // Pass the io instance to the DeliveryService

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("track-delivery", (deliveryId: string) => {
      socket.join(deliveryId);
    });

    socket.on(
      "location_changed",
      async (data: {
        deliveryId: string;
        location: { lat: number; lng: number };
      }) => {
        const { deliveryId, location } = data;

        const delivery = await DeliveryService.updateDeliveryLocation(
          deliveryId,
          location
        );

        if (delivery) {
          sendDeliveryUpdate(io, deliveryId, delivery);
        }
      }
    );

    socket.on(
      "status_changed",
      async (data: {
        deliveryId: string;
        status: "open" | "picked-up" | "in-transit" | "delivered" | "failed";
      }) => {
        const { deliveryId, status } = data;

        const updatedDelivery = await DeliveryService.updateDelivery(
          deliveryId,
          status
        );

        if (updatedDelivery) {
          sendDeliveryUpdate(io, deliveryId, updatedDelivery);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

const sendDeliveryUpdate = (io: Server, deliveryId: string, delivery: any) => {
  io.to(deliveryId).emit("delivery_updated", {
    event: "delivery_updated",
    delivery,
  });
};
