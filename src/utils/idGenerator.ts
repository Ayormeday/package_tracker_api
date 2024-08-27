import { Model } from 'mongoose';
import PackageModel from "../models/package";
import DeliveryModel from "../models/delivery";

let lock = { active: false };

const generateId = async (prefix: string, model: Model<any>, idField: string): Promise<string> => {
  const getNextId = async (): Promise<string> => {
    if (!lock.active) {
      lock.active = true;
      try {
        const lastItem = await model.findOne().sort({ [idField]: -1 });
        let lastId = lastItem ? parseInt(lastItem[idField].replace(prefix, "")) : 0;
        const newId = lastId + 1;
        lock.active = false;
        return `${prefix}${newId.toString().padStart(5, "0")}`;
      } catch (error: any) {
        lock.active = false;
        throw new Error("Error generating ID: " + error.message);
      }
    } else {
      // Wait and retry to get the next ID
      await new Promise(resolve => setTimeout(resolve, 10));
      return getNextId();
    }
  };

  return getNextId();
};

export const generatePackageId = async (): Promise<string> => {
  return generateId("PKG", PackageModel, "packageId");
};

export const generateDeliveryId = async (): Promise<string> => {
  return generateId("DEL", DeliveryModel, "deliveryId");
};