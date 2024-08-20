import { Schema, model, Document } from 'mongoose';

export interface IDelivery extends Document {
  deliveryId: string;
  packageId: string;
  pickupTime?: Date;
  startTime?: Date;
  endTime?: Date;
  location: { lat: number; lng: number };
  status: 'open' | 'picked-up' | 'in-transit' | 'delivered' | 'failed';
  createdAt: Date; 
  updatedAt: Date; 
}

const deliverySchema = new Schema({
  deliveryId: { type: String, required: true, unique: true },
  packageId: { type: String, required: true, unique: true },
  pickupTime: { type: Date },
  startTime: { type: Date },
  endTime: { type: Date },
  location: { 
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'],
    required: true
  }
}, {
  timestamps: true 
});

const DeliveryModel = model<IDelivery>('Delivery', deliverySchema);

export default DeliveryModel;