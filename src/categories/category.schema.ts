import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  color: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId; // Null for global/default categories
}

export const CategorySchema = SchemaFactory.createForClass(Category);
