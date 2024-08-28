import DeliveryModel, { IDelivery } from "../models/delivery";
import PackageModel from '../models/package';
import { generateDeliveryId } from '../utils/idGenerator';

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

const createDelivery = async (deliveryData: Omit<IDelivery, 'deliveryId'>): Promise<IDelivery> => {
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
  updateData: Partial<IDelivery>
): Promise<IDelivery | null> => {
  if (updateData.status === "picked-up") {
    updateData.pickupTime = new Date();
  }
  return await DeliveryModel.findOneAndUpdate({ deliveryId }, updateData, {
    new: true,
  });
};

const deleteDelivery = async (
  deliveryId: string
): Promise<IDelivery | null> => {
  const delivery = await DeliveryModel.findOne({ deliveryId });

  if (!delivery) {
    throw new Error('Delivery not found');
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
  deleteDelivery,
};
