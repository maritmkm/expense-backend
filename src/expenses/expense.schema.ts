import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  note: string;

  @Prop({ required: true, enum: ['income', 'expense'] })
  type: string;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop()
  attachment: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
