import PackageModel, { IPackage } from "../models/package";
import DeliveryModel, { IDelivery } from "../models/delivery";

const getAllPackages = async (): Promise<IPackage[]> => {
  return await PackageModel.find();
};

const getPackageById = async (
  packageId: string
): Promise<{ package: IPackage | null; delivery?: any }> => {
  const pkg = await PackageModel.findOne({ packageId });

  if (pkg && pkg.activeDeliveryId) {
    const delivery = await DeliveryModel.findOne({
      deliveryId: pkg.activeDeliveryId,
    });
    return { package: pkg, delivery };
  }

  return { package: pkg };
};

// Create a new package
const createPackage = async (packageData: IPackage): Promise<IPackage> => {
  const newPackage = new PackageModel(packageData);
  return await newPackage.save();
};
// Create many new packages
const createManyPackages = async (
  packagesData: IPackage[]
): Promise<IPackage[]> => {
  const packageIds = packagesData.map((pkg) => pkg.packageId);
  const existingPackages = await PackageModel.find({
    packageId: { $in: packageIds },
  });

  if (existingPackages.length > 0) {
    throw new Error(
      "Some packageIds already exist: " +
        existingPackages.map((pkg) => pkg.packageId).join(", ")
    );
  }
  const createdPackages = await PackageModel.insertMany(packagesData);
  return createdPackages;
};

const updatePackage = async (
  packageId: string,
  updateData: Partial<IPackage>
): Promise<IPackage | null> => {

  const updatedData = await PackageModel.findOneAndUpdate(
    { packageId },
    { $set: updateData },
    { new: true, upsert: true }
  );
  return updatedData;
};

const deletePackage = async (packageId: string): Promise<IPackage | null> => {
  const pkg = await PackageModel.findOne({ packageId });

  if (!pkg) {
    throw new Error("Package not found");
  }
  if (pkg.activeDeliveryId) {
    // Delete the associated delivery
    await DeliveryModel.findOneAndDelete({ deliveryId: pkg.activeDeliveryId });
  }

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
