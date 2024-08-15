import { Schema, model, Document } from 'mongoose';

export interface IPackage extends Document {
  packageId: string;
  activeDeliveryId?: string;
  description: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  fromName: string;
  fromAddress: string;
  fromLocation: {
    lat: number;
    lng: number;
  };
  toName: string;
  toAddress: string;
  toLocation: {
    lat: number;
    lng: number;
  };
}

const packageSchema = new Schema({
  packageId: { type: String, required: true, unique: true },
  activeDeliveryId: { type: String, unique: true },
  description: { type: String, required: true },
  weight: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  depth: { type: Number, required: true },
  fromName: { type: String, required: true },
  fromAddress: { type: String, required: true },
  fromLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  toName: { type: String, required: true },
  toAddress: { type: String, required: true },
  toLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

const PackageModel = model<IPackage>('Package', packageSchema);

export default PackageModel;