import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from './expense.schema';

@Injectable()
export class ExpensesService {
  constructor(@InjectModel(Expense.name) private expenseModel: Model<Expense>) {}

  async create(createDto: any, userId: string): Promise<Expense> {
    const expense = new this.expenseModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
    });
    return expense.save();
  }

  async findAll(userId: string, query: any): Promise<any> {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      type, 
      startDate, 
      endDate 
    } = query;

    const filter: any = { userId: new Types.ObjectId(userId) };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.expenseModel.find(filter).sort({ date: -1 }).skip(skip).limit(limit).exec(),
      this.expenseModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Expense> {
    const expense = await this.expenseModel.findOne({ 
      _id: new Types.ObjectId(id), 
      userId: new Types.ObjectId(userId) 
    }).exec();

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(id: string, updateDto: any, userId: string): Promise<Expense> {
    const expense = await this.expenseModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      { $set: updateDto },
      { new: true }
    ).exec();

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.expenseModel.deleteOne({ 
      _id: new Types.ObjectId(id), 
      userId: new Types.ObjectId(userId) 
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Expense not found');
    }
  }
}
