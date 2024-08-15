import DeliveryModel, { IDelivery } from "../models/delivery";

// Get all deliveries
const getAllDeliveries = async (): Promise<IDelivery[]> => {
  return await DeliveryModel.find();
};

// Get delivery by ID
const getDeliveryById = async (
  deliveryId: string
): Promise<IDelivery | null> => {
  return await DeliveryModel.findOne({ deliveryId });
};

// Create a new delivery
const createDelivery = async (deliveryData: IDelivery): Promise<IDelivery> => {
  const newDelivery = new DeliveryModel(deliveryData);
  return await newDelivery.save();
};

// Update a delivery by ID
const updateDelivery = async (
  deliveryId: string,
  updateData: Partial<IDelivery>
): Promise<IDelivery | null> => {
  return await DeliveryModel.findOneAndUpdate({ deliveryId }, updateData, {
    new: true,
  });
};

// Delete a delivery by ID
const deleteDelivery = async (
  deliveryId: string
): Promise<IDelivery | null> => {
  return await DeliveryModel.findOneAndDelete({ deliveryId });
};

export {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery,
};
