import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async create(createDto: any, userId: string): Promise<Category> {
    const category = new this.categoryModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
    });
    return category.save();
  }

  async findAll(userId: string): Promise<Category[]> {
    return this.categoryModel.find({
      $or: [
        { userId: new Types.ObjectId(userId) },
        { userId: null }, // Default categories
      ],
    }).exec();
  }

  async update(id: string, updateDto: any, userId: string): Promise<Category> {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      updateDto,
      { new: true }
    ).exec();

    if (!category) {
      throw new NotFoundException('Category not found or not authorized');
    }
    return category;
  }

  async remove(id: string, userId: string): Promise<any> {
    const result = await this.categoryModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Category not found or not authorized');
    }
    return { message: 'Category deleted successfully' };
  }
}
