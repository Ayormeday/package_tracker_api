// utils/idGenerator.ts
import PackageModel from "../models/package";
import DeliveryModel from "../models/delivery";

import { Model } from "mongoose";

const generateId = async (
  prefix: string,
  model: Model<any>
): Promise<string> => {
  // Use an object with an explicit type
  const lock: { active: boolean } = { active: false };

  // Function to generate the next sequential ID
  const getNextId = async (): Promise<string> => {
    // Find the last item based on createdAt or _id, depending on your schema
    const lastItem = await model.findOne({}).sort({ createdAt: -1 });

    let lastId = 0;
    if (lastItem && lastItem.packageId.startsWith(prefix)) {
      lastId = parseInt(lastItem.packageId.replace(prefix, "")) || 0;
    }

    const newId = lastId + 1;
    return `${prefix}${newId.toString().padStart(5, "0")}`;
  };

  if (!lock.active) {
    lock.active = true;
    try {
      const newId = await getNextId();
      lock.active = false;
      return newId;
    } catch (error) {
      lock.active = false;
      throw new Error("Error generating ID");
    }
  } else {
    // Wait until the lock is released
    await new Promise((resolve) => setTimeout(resolve, 50));
    return generateId(prefix, model);
  }
};
const generatePackageId = async (): Promise<string> => {
  return generateId("PKG", PackageModel);
};

const generateDeliveryId = async (): Promise<string> => {
  return generateId("DEL", DeliveryModel);
};

export { generatePackageId, generateDeliveryId };
