import PackageModel, { IPackage } from "../models/package";
import DeliveryModel, { IDelivery } from "../models/delivery";

// Get all packages
const getAllPackages = async (): Promise<IPackage[]> => {
  return await PackageModel.find();
};

// Get package by ID
const getPackageById = async (packageId: string): Promise<IPackage | null> => {
  return await PackageModel.findOne({ packageId });
};

// Create a new package
const createPackage = async (packageData: IPackage): Promise<IPackage> => {
  const newPackage = new PackageModel(packageData);
  return await newPackage.save();
};

// Update a package by ID
const updatePackage = async (
  packageId: string,
  updateData: Partial<IPackage>
): Promise<IPackage | null> => {
  return await PackageModel.findOneAndUpdate({ packageId }, updateData, {
    new: true,
  });
};

// Delete a package by ID
const deletePackage = async (packageId: string): Promise<IPackage | null> => {
  return await PackageModel.findOneAndDelete({ packageId });
};

export {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
