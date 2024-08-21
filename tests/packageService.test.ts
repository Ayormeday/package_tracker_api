import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import PackageModel, { IPackage } from "../src/models/package";
import DeliveryModel, { IDelivery } from "../src/models/delivery";
import * as packageService from "../src/services/package";
import * as utils from "../src/utils/idGenerator";

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

describe("getPackageById", () => {
  it("should return the package with its associated delivery if activeDeliveryId exists", async () => {
    const packageData = new PackageModel({
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

    const deliveryData = new DeliveryModel({
      deliveryId: "DEL00001",
      packageId: "PKG00001",
      location: { lat: 6.4281, lng: 3.4208 },
      status: "open",
    });
    await deliveryData.save();

    const result = await packageService.getPackageById("PKG00001");

    expect(result.package).not.toBeNull();
    expect(result.package?.packageId).toEqual("PKG00001");
    expect(result.delivery).not.toBeNull();
    expect(result.delivery?.deliveryId).toEqual("DEL00001");
  });

  it("should return only the package when there is no activeDeliveryId", async () => {
    const packageData = new PackageModel({
      packageId: "PKG00002",
      description: "Another Test Package",
      fromName: "John Doe",
      fromAddress: "123 Test St",
      toName: "Jane Doe",
      weight: 1.2,
      width: 10,
      height: 8,
      depth: 2,
      toAddress: "456 Test Ave",
      fromLocation: { lat: 34.0522, lng: -118.2437 },
      toLocation: { lat: 40.7128, lng: -74.006 },
    });
    await packageData.save();

    const result = await packageService.getPackageById("PKG00002");

    expect(result.package).not.toBeNull();
    expect(result.package?.packageId).toEqual("PKG00002");
    expect(result.delivery).toBeUndefined();
  });

  it("should return null when the package does not exist", async () => {
    const result = await packageService.getPackageById("NON_EXISTENT_PKG");
    expect(result.package).toBeNull();
  });
});

describe("createPackage", () => {
  it("should create a new package with a generated packageId", async () => {
    jest.spyOn(utils, "generatePackageId").mockResolvedValue("PKG00003");

    const mockSave = jest.fn().mockResolvedValue({
      packageId: "PKG00003",
      description: "New Package",
      weight: 2.0,
      width: 10,
      height: 15,
      depth: 5,
      fromName: "Alice",
      fromAddress: "123 New St",
      toName: "Bob",
      toAddress: "456 Old St",
      fromLocation: { lat: 35.6895, lng: 139.6917 },
      toLocation: { lat: 40.7128, lng: -74.006 },
    });

    jest.spyOn(PackageModel.prototype, "save").mockImplementation(mockSave);

    const packageData = {
      description: "New Package",
      weight: 2.0,
      width: 10,
      height: 15,
      depth: 5,
      fromName: "Alice",
      fromAddress: "123 New St",
      toName: "Bob",
      toAddress: "456 Old St",
      fromLocation: { lat: 35.6895, lng: 139.6917 },
      toLocation: { lat: 40.7128, lng: -74.006 },
    };

    const result = await packageService.createPackage(packageData);

    expect(result.packageId).toEqual("PKG00003");
    expect(result.description).toEqual("New Package");
    expect(result.weight).toEqual(2.0);

    expect(mockSave).toHaveBeenCalled();
  });
});

describe("updatePackage", () => {
  it("should update the package and return the updated data", async () => {
    const mockFindOneAndUpdate = jest
      .spyOn(PackageModel, "findOneAndUpdate")
      .mockResolvedValue({
        packageId: "PKG00004",
        description: "Package to Update",
        weight: 2.5,
        width: 8,
        height: 10,
        depth: 4,
        fromName: "John Doe",
        fromAddress: "123 Test St",
        toName: "Jane Doe",
        toAddress: "456 Test Ave",
        fromLocation: { lat: 34.0522, lng: -118.2437 },
        toLocation: { lat: 40.7128, lng: -74.006 },
      } as any);

    const updateData = { weight: 2.5 };

    const result = await packageService.updatePackage("PKG00004", updateData);

    expect(result).not.toBeNull();
    expect(result?.weight).toEqual(2.5);
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      { packageId: "PKG00004" },
      { $set: updateData },
      { new: true, upsert: true }
    );
  });
});

describe("deletePackage", () => {
  it("should delete the package and any associated delivery", async () => {
    jest.spyOn(PackageModel, "findOne").mockResolvedValue({
      packageId: "PKG00005",
      description: "Package to Delete",
      activeDeliveryId: "DEL00002",
      fromName: "John Doe",
      fromAddress: "123 Test St",
      toName: "Jane Doe",
      toAddress: "456 Test Ave",
      fromLocation: { lat: 34.0522, lng: -118.2437 },
      toLocation: { lat: 40.7128, lng: -74.006 },
    } as any);

    jest.spyOn(DeliveryModel, "findOneAndDelete").mockResolvedValue({
      deliveryId: "DEL00002",
      packageId: "PKG00005",
      location: { lat: 6.4281, lng: 3.4208 },
      status: "open",
    } as any);

    jest.spyOn(PackageModel, "findOneAndDelete").mockResolvedValue({
      packageId: "PKG00005",
      description: "Package to Delete",
      activeDeliveryId: "DEL00002",
      fromName: "John Doe",
      fromAddress: "123 Test St",
      toName: "Jane Doe",
      toAddress: "456 Test Ave",
      fromLocation: { lat: 34.0522, lng: -118.2437 },
      toLocation: { lat: 40.7128, lng: -74.006 },
    } as any);

    const result = await packageService.deletePackage("PKG00005");

    expect(result).not.toBeNull();
    expect(result?.packageId).toEqual("PKG00005");
    expect(PackageModel.findOneAndDelete).toHaveBeenCalledWith({
      packageId: "PKG00005",
    });
    expect(DeliveryModel.findOneAndDelete).toHaveBeenCalledWith({
      deliveryId: "DEL00002",
    });
  });

  it("should throw an error if the package does not exist", async () => {
    jest.spyOn(PackageModel, "findOne").mockResolvedValue(null);

    await expect(
      packageService.deletePackage("NON_EXISTENT_PKG")
    ).rejects.toThrow("Package not found");
  });
});
