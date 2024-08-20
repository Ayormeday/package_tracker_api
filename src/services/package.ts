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
// Create many new packages
const createManyPackages = async (packagesData: IPackage[]): Promise<IPackage[]> => {
  const packageIds = packagesData.map(pkg => pkg.packageId);
  const existingPackages = await PackageModel.find({ packageId: { $in: packageIds } });

  if (existingPackages.length > 0) {
    throw new Error('Some packageIds already exist: ' + existingPackages.map(pkg => pkg.packageId).join(', '));
  }
  const createdPackages = await PackageModel.insertMany(packagesData);
  return createdPackages;
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
  createManyPackages,
  updatePackage,
  deletePackage,
};
