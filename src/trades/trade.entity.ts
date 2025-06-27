import { Schema, Document } from 'mongoose';

export const TradeSchema = new Schema({
  userId: { type: String },
  date: { type: Date },
  action: { type: String, required: true },
  amount: { type: Number, required: true },
});

export interface Trade extends Document {
  userId?: string;
  date?: Date;
  action: string;
  amount: number;
}

export type TradeDocument = Trade; // Export TradeDocument as a type alias
