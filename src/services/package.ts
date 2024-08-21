import PackageModel, { IPackage } from "../models/package";
import DeliveryModel, { IDelivery } from "../models/delivery";
import { generatePackageId } from '../utils/idGenerator';

const getAllPackages = async (): Promise<{ package: IPackage; delivery?: IDelivery }[]> => {
  const packages = await PackageModel.find();
  const packagesWithDelivery = await Promise.all(
    packages.map(async (pkg) => {
      let delivery = null;
      if (pkg.activeDeliveryId) {
        delivery = await DeliveryModel.findOne({ deliveryId: pkg.activeDeliveryId });
      }
      return { package: pkg, delivery };
    })
  );
  return packagesWithDelivery;
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

const createPackage = async (packageData: Partial<IPackage>): Promise<IPackage> => {
  const packageId = await generatePackageId();
  const newPackage = new PackageModel({ ...packageData, packageId });
  return await newPackage.save();
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
  updatePackage,
  deletePackage,
};
