import mongoose, { Document, Schema } from 'mongoose';

export interface IDevice extends Document {
  device: string;
  t: Date;
  w: number;
  h: number;
  p1: number;
  p25: number;
  p10: number;
}

const deviceDataSchema = new Schema<IDevice>({
  device: String,
  t: Date,
  w: Number,
  h: String,
  p1: Number,
  p25: Number,
  p10: Number,
});

export default mongoose.model<IDevice>('Device', deviceDataSchema);
