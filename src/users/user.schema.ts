import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ default: false })
  onboarded: boolean;

  @Prop({ type: [{ name: String, icon: String, color: String }], default: [] })
  customCategories: { name: string; icon: string; color: string }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
