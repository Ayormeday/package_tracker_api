import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import PackageModel, { IPackage } from "../src/models/package"; 
import DeliveryModel, { IDelivery } from "../src/models/delivery"; 
import * as packageService from "../src/services/package"; 

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("getAllPackages", () => {
  it("should return packages without deliveries when no activeDeliveryId exists", async () => {
    const packageData: IPackage = new PackageModel({
      packageId: "PKG00001",
      description: "Books",
      weight: 1.2,
      width: 10,
      height: 8,
      depth: 2,
      fromName: "Michael Johnson",
      fromAddress: "789 Victoria Island, Lagos",
      toName: "Laura James",
      toAddress: "321 Lekki Phase 1, Lekki",
      fromLocation: { lat: 6.4265, lng: 3.4303 },
      toLocation: { lat: 6.4426, lng: 3.5412 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await packageData.save();

    const result = await packageService.getAllPackages();
    expect(result.length).toBe(1);
    expect(result[0].package.packageId).toEqual("PKG00001");
    expect(result[0].package.description).toEqual("Books");
    expect(result[0].delivery).toBeNull();
  });

  it("should return packages with their associated deliveries", async () => {
    const packageData: IPackage = new PackageModel({
      packageId: "PKG00001",
      description: "Books",
      weight: 1.2,
      width: 10,
      height: 8,
      depth: 2,
      fromName: "Michael Johnson",
      fromAddress: "789 Victoria Island, Lagos",
      toName: "Laura James",
      toAddress: "321 Lekki Phase 1, Lekki",
      fromLocation: { lat: 6.4265, lng: 3.4303 },
      toLocation: { lat: 6.4426, lng: 3.5412 },
      createdAt: new Date(),
      updatedAt: new Date(),
      activeDeliveryId: "DEL00001",
    });
    await packageData.save();

    const deliveryData: IDelivery = new DeliveryModel({
      deliveryId: "DEL00001",
      packageId: "PKG00001",
      pickupTime: new Date("2024-08-20T08:00:00.000Z"),
      startTime: new Date("2024-08-20T09:00:00.000Z"),
      endTime: new Date("2024-08-20T11:00:00.000Z"),
      location: { lat: 6.4281, lng: 3.4208 },
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await deliveryData.save();

    const result = await packageService.getAllPackages();
    expect(result.length).toBe(1);
    expect(result[0].package.packageId).toEqual("PKG00001");
    expect(result[0].package.description).toEqual("Books");
    expect(result[0].delivery).not.toBeNull();

    if (result[0].delivery) {
      expect(result[0].delivery.deliveryId).toEqual("DEL00001");
      expect(result[0].delivery.status).toEqual("open");
      expect(result[0].delivery.location.lat).toEqual(6.4281);
      expect(result[0].delivery.location.lng).toEqual(3.4208);
    } else {
      fail("Delivery was expected but not found");
    }
  });
});
