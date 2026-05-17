import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Budget } from './budget.schema';

@Injectable()
export class BudgetsService {
  constructor(@InjectModel(Budget.name) private budgetModel: Model<Budget>) {}

  async create(createDto: any, userId: string): Promise<Budget> {
    const budget = new this.budgetModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
    });
    return budget.save();
  }

  async findAll(userId: string): Promise<Budget[]> {
    return this.budgetModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findOne(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetModel.findOne({ 
      _id: new Types.ObjectId(id), 
      userId: new Types.ObjectId(userId) 
    }).exec();

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }

  async update(id: string, updateDto: any, userId: string): Promise<Budget> {
    const budget = await this.budgetModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      { $set: updateDto },
      { new: true }
    ).exec();

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.budgetModel.deleteOne({ 
      _id: new Types.ObjectId(id), 
      userId: new Types.ObjectId(userId) 
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Budget not found');
    }
  }
}
