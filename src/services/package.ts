import PackageModel, { IPackage } from "../models/package";
import DeliveryModel, { IDelivery } from "../models/delivery"


const getPackageDetails = async (packageId: string) => {
  const packageData = await PackageModel.findOne({ packageId });

  if (!packageData) {
    throw new Error('Package not found');
  }

  let deliveryData = null;
  if (packageData.deliveryId) {
    deliveryData = await DeliveryModel.findOne({ deliveryId: packageData.deliveryId });
  }

  return { package: packageData, delivery: deliveryData };
};

export {
  getPackageDetails,
};
