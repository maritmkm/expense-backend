import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Expense, ExpenseSchema } from '../expenses/expense.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
