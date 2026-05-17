import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from '../expenses/expense.schema';

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(Expense.name) private expenseModel: Model<Expense>) {}

  async getSummary(userId: string) {
    const uid = new Types.ObjectId(userId);
    const result = await this.expenseModel.aggregate([
      { $match: { userId: uid } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const summary = {
      income: result.find(r => r._id === 'income')?.total || 0,
      expense: result.find(r => r._id === 'expense')?.total || 0,
    };

    return {
      ...summary,
      balance: summary.income - summary.expense,
    };
  }

  async getByCategory(userId: string) {
    const uid = new Types.ObjectId(userId);
    return this.expenseModel.aggregate([
      { $match: { userId: uid, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      { $project: { category: '$_id', total: 1, _id: 0 } },
      { $sort: { total: -1 } },
    ]);
  }

  async getMonthly(userId: string) {
    const uid = new Types.ObjectId(userId);
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    return this.expenseModel.aggregate([
      {
        $match: {
          userId: uid,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
  }
}
