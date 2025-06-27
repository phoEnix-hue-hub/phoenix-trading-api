import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // Import Types for ObjectId

export type UserDocument = User & Document; // Extend Document for _id

@Schema()
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: 0 })
  balance!: number;

  @Prop({ type: Date, default: Date.now })
  lastLogin!: Date;

  // _id is automatically added by Mongoose as Types.ObjectId
}

export const UserSchema = SchemaFactory.createForClass(User);
