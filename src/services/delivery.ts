import DeliveryModel, { IDelivery } from "../models/delivery";
import PackageModel from '../models/package';

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

const createDelivery = async (deliveryData: IDelivery): Promise<IDelivery> => {
  const existingDelivery = await DeliveryModel.findOne({
    deliveryId: deliveryData.deliveryId,
  });
  if (existingDelivery) {
    throw new Error("Delivery with this ID already exists");
  }
  const newDelivery = new DeliveryModel(deliveryData);
  return await newDelivery.save();
};

const updateDelivery = async (
  deliveryId: string,
  updateData: Partial<IDelivery>
): Promise<IDelivery | null> => {
  // Check if the status is being updated to "picked-up"
  if (updateData.status === "picked-up") {
    // Set pickupTime to the current date and time
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

  // Find the package associated with this delivery
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
