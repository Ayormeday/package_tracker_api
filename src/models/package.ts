import { Schema, model, Document } from 'mongoose';

export interface IPackage extends Document {
  packageId: string;
  status: string;
  deliveryId?: string;
}

const packageSchema = new Schema({
  packageId: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  deliveryId: { type: String }
});

const PackageModel = model<IPackage>('Package', packageSchema);

export default PackageModel