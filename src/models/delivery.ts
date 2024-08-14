import { Schema, model, Document } from 'mongoose';

export interface IDelivery extends Document {
  deliveryId: string;
  source: string;
  destination: string;
  currentLocation: string;
}

const deliverySchema = new Schema({
  deliveryId: { type: String, required: true, unique: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  currentLocation: { type: String, required: true },
});

const DeliveryModel = model<IDelivery>('Delivery', deliverySchema);

export default DeliveryModel