import * as deliveryService from '../src/services/delivery';
import * as utils from "../src/utils/idGenerator";
import DeliveryModel from '../src/models/delivery';
import PackageModel from '../src/models/package';

jest.mock('../src/models/delivery');
jest.mock('../src/models/package');

describe('getAllDeliveries', () => {
  it('should return all deliveries with their associated package information', async () => {
    const mockDeliveries = [
      {
        deliveryId: 'DEL00001',
        packageId: 'PKG00001',
        location: { lat: 6.4281, lng: 3.4208 },
        status: 'open',
        toObject: jest.fn().mockReturnValue({
          deliveryId: 'DEL00001',
          packageId: 'PKG00001',
          location: { lat: 6.4281, lng: 3.4208 },
          status: 'open',
        }),
      },
      {
        deliveryId: 'DEL00002',
        packageId: 'PKG00002',
        location: { lat: 6.4282, lng: 3.4210 },
        status: 'in-transit',
        toObject: jest.fn().mockReturnValue({
          deliveryId: 'DEL00002',
          packageId: 'PKG00002',
          location: { lat: 6.4282, lng: 3.4210 },
          status: 'in-transit',
        }),
      },
    ];

    const mockPackage1 = {
      packageId: 'PKG00001',
      description: 'Package 1',
    };

    const mockPackage2 = {
      packageId: 'PKG00002',
      description: 'Package 2',
    };

    jest.spyOn(DeliveryModel, 'find').mockResolvedValue(mockDeliveries as any);
    jest.spyOn(PackageModel, 'findOne')
      .mockResolvedValueOnce(mockPackage1 as any)
      .mockResolvedValueOnce(mockPackage2 as any);

    const result = await deliveryService.getAllDeliveries();

    expect(result.length).toBe(2);
    expect(result[0].package.packageId).toEqual('PKG00001');
    expect(result[1].package.packageId).toEqual('PKG00002');
  });
});

describe('getDeliveryById', () => {
    it('should return the delivery with its associated package information', async () => {
      const mockDelivery = {
        deliveryId: 'DEL00001',
        packageId: 'PKG00001',
        location: { lat: 6.4281, lng: 3.4208 },
        status: 'open',
        toObject: jest.fn().mockReturnValue({
          deliveryId: 'DEL00001',
          packageId: 'PKG00001',
          location: { lat: 6.4281, lng: 3.4208 },
          status: 'open',
        }),
      };
  
      const mockPackage = {
        packageId: 'PKG00001',
        description: 'Package 1',
      };
  
      jest.spyOn(DeliveryModel, 'findOne').mockResolvedValue(mockDelivery as any);
      jest.spyOn(PackageModel, 'findOne').mockResolvedValue(mockPackage as any);
  
      const result = await deliveryService.getDeliveryById('DEL00001');
  
      expect(result).not.toBeNull();
      expect(result.deliveryId).toEqual('DEL00001');
      expect(result.package.packageId).toEqual('PKG00001');
    });
  
    it('should return null if the delivery is not found', async () => {
      jest.spyOn(DeliveryModel, 'findOne').mockResolvedValue(null);
  
      const result = await deliveryService.getDeliveryById('NON_EXISTENT_DEL');
  
      expect(result).toBeNull();
    });
  });
  

describe('createDelivery', () => {
    it('should create a new delivery and update the package with the delivery ID', async () => {
      jest.spyOn(utils, 'generateDeliveryId').mockResolvedValue('DEL00003');
  
      const mockPackage = {
        packageId: 'PKG00003',
        description: 'New Package',
      };
  
      const mockSave = jest.fn().mockResolvedValue({
        deliveryId: 'DEL00003',
        packageId: 'PKG00003',
        location: { lat: 6.4281, lng: 3.4208 },
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      jest.spyOn(DeliveryModel.prototype, 'save').mockImplementation(mockSave);
      jest.spyOn(PackageModel, 'findOneAndUpdate').mockResolvedValue(mockPackage as any);
  
      const deliveryData: any = {
        packageId: 'PKG00003',
        location: { lat: 6.4281, lng: 3.4208 },
        status: 'open',
        pickupTime: "2024-08-20T08:00:00Z",
        startTime: "2024-08-20T09:00:00Z",
        endTime: "2024-08-21T11:00:00Z",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      const result = await deliveryService.createDelivery(deliveryData);
  
      expect(result.deliveryId).toEqual('DEL00003');
      expect(result.packageId).toEqual('PKG00003');
      expect(PackageModel.findOneAndUpdate).toHaveBeenCalledWith(
        { packageId: 'PKG00003' },
        { activeDeliveryId: 'DEL00003' }
      );
    });
  });

  describe('updateDelivery', () => {
    it('should update the delivery and return the updated data', async () => {
      const mockDelivery = {
        deliveryId: 'DEL00004',
        packageId: 'PKG00004',
        location: { lat: 6.4281, lng: 3.4208 },
        status: 'open',
      };
  
      const updatedDelivery = {
        ...mockDelivery,
        status: 'picked-up',
        pickupTime: new Date(),
      };
  
      jest.spyOn(DeliveryModel, 'findOneAndUpdate').mockResolvedValue(updatedDelivery as any);
  
      const result = await deliveryService.updateDelivery('DEL00004', 'picked-up');
  
      expect(result).not.toBeNull();
      expect(result?.status).toEqual('picked-up');
      expect(result?.pickupTime).toBeDefined();
      expect(DeliveryModel.findOneAndUpdate).toHaveBeenCalledWith(
        { deliveryId: 'DEL00004' },
        expect.objectContaining({ status: 'picked-up', pickupTime: expect.any(Date) }),
        { new: true }
      );
    });
  });
  
  describe('updateDeliveryLocation', () => {
    it('should update the delivery location and return the updated delivery', async () => {
      const mockDelivery = {
        deliveryId: 'DEL00006',
        packageId: 'PKG00006',
        location: { lat: 6.4281, lng: 3.4208 },
        status: 'open',
      };
  
      const updatedLocation = { lat: 6.5000, lng: 3.4500 };
      const updatedDelivery = {
        ...mockDelivery,
        location: updatedLocation,
      };
  
      jest.spyOn(DeliveryModel, 'findOneAndUpdate').mockResolvedValue(updatedDelivery as any);
  
      const result = await deliveryService.updateDeliveryLocation('DEL00006', updatedLocation);
  
      expect(result).not.toBeNull();
      expect(result?.location).toEqual(updatedLocation);
      expect(DeliveryModel.findOneAndUpdate).toHaveBeenCalledWith(
        { deliveryId: 'DEL00006' },
        { location: updatedLocation },
        { new: true }
      );
    });
  });
  
  
describe('deleteDelivery', () => {
    it('should delete the delivery and unset the activeDeliveryId in the package', async () => {
      const mockDelivery = {
        deliveryId: 'DEL00005',
        packageId: 'PKG00005',
      };
  
      const mockPackage = {
        packageId: 'PKG00005',
        activeDeliveryId: 'DEL00005',
      };
  
      jest.spyOn(DeliveryModel, 'findOne').mockResolvedValue(mockDelivery as any);
      jest.spyOn(PackageModel, 'findOne').mockResolvedValue(mockPackage as any);
      jest.spyOn(DeliveryModel, 'findOneAndDelete').mockResolvedValue(mockDelivery as any);
      jest.spyOn(PackageModel, 'findOneAndUpdate').mockResolvedValue(mockPackage as any);
  
      const result = await deliveryService.deleteDelivery('DEL00005');
  
      expect(result).not.toBeNull();
      expect(result?.deliveryId).toEqual('DEL00005');
      expect(DeliveryModel.findOneAndDelete).toHaveBeenCalledWith({ deliveryId: 'DEL00005' });
      expect(PackageModel.findOneAndUpdate).toHaveBeenCalledWith(
        { packageId: 'PKG00005' },
        { $unset: { activeDeliveryId: '' } }
      );
    });
  
    it('should throw an error if the delivery does not exist', async () => {
      jest.spyOn(DeliveryModel, 'findOne').mockResolvedValue(null);
  
      await expect(deliveryService.deleteDelivery('NON_EXISTENT_DEL')).rejects.toThrow('Delivery not found');
    });
  });