import DeliveryModel, { IDelivery } from "../models/delivery";
import PackageModel from "../models/package";
import { generateDeliveryId } from "../utils/idGenerator";
import { Server } from "socket.io";
import { rateLimiter } from '../utils/rateLimiter';


let io: Server;
const deliveryRateLimiter = rateLimiter(5, 10000);

export const setWebSocketServer = (socketServer: Server) => {
  io = socketServer;
};

const getAllDeliveries = async (): Promise<any[]> => {
  const deliveries = await DeliveryModel.find();

  const deliveriesWithPackageInfo = await Promise.all(
    deliveries.map(async (delivery) => {
      const pkg = await PackageModel.findOne({ packageId: delivery.packageId });
      return { ...delivery.toObject(), package: pkg };
    })
  );

  return deliveriesWithPackageInfo;
};

const getDeliveryById = async (deliveryId: string): Promise<any | null> => {
  const delivery = await DeliveryModel.findOne({ deliveryId });

  if (!delivery) return null;

  const pkg = await PackageModel.findOne({ packageId: delivery.packageId });

  return { ...delivery.toObject(), package: pkg };
};

const createDelivery = async (
  deliveryData: Omit<IDelivery, "deliveryId">
): Promise<IDelivery> => {
  const deliveryId = await generateDeliveryId();
  const newDelivery = new DeliveryModel({
    ...deliveryData,
    deliveryId,
  });

  const savedDelivery = await newDelivery.save();

  await PackageModel.findOneAndUpdate(
    { packageId: deliveryData.packageId },
    { activeDeliveryId: deliveryId }
  );

  return savedDelivery;
};

const updateDelivery = async (
  deliveryId: string,
  status: "open" | "picked-up" | "in-transit" | "delivered" | "failed"
): Promise<IDelivery | null> => {

  if (!deliveryRateLimiter(deliveryId)) {
    throw new Error("Too many requests. Please try again later.");
  } 
  const updateData: Partial<IDelivery> = { status };

  if (status === "picked-up") {
    updateData.pickupTime = new Date();
  } else if (status === "in-transit") {
    updateData.startTime = new Date();
  } else if (status === "delivered" || status === "failed") {
    updateData.endTime = new Date();
  }

  const updatedDelivery = await DeliveryModel.findOneAndUpdate(
    { deliveryId },
    updateData,
    {
      new: true,
    }
  );

  if (updatedDelivery && io) {
    io.to(deliveryId).emit("deliveryStatusUpdate", {
      deliveryId: updatedDelivery.deliveryId,
      status: updatedDelivery.status,
    });
  }

  return updatedDelivery;
};

const updateDeliveryLocation = async (
  deliveryId: string,
  location: { lat: number; lng: number }
): Promise<IDelivery | null> => {

  if (!deliveryRateLimiter(deliveryId)) {
    throw new Error("Too many requests. Please try again later.");
  }
  const updatedDelivery = await DeliveryModel.findOneAndUpdate(
    { deliveryId },
    { location },
    { new: true }
  );

  return updatedDelivery;
};

const deleteDelivery = async (
  deliveryId: string
): Promise<IDelivery | null> => {
  const delivery = await DeliveryModel.findOne({ deliveryId });

  if (!delivery) {
    throw new Error("Delivery not found");
  }
  const packageId = delivery.packageId;
  const pkg = await PackageModel.findOne({ packageId });

  if (pkg && pkg.activeDeliveryId === deliveryId) {
    await PackageModel.findOneAndUpdate(
      { packageId },
      { $unset: { activeDeliveryId: "" } }
    );
  }
  return await DeliveryModel.findOneAndDelete({ deliveryId });
};

export {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  updateDeliveryLocation,
  deleteDelivery,
};
