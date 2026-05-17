import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: any): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async addCustomCategory(userId: string, category: { name: string; icon: string; color: string }): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { customCategories: category } },
      { new: true }
    ).exec();
  }

  async updateCustomCategory(userId: string, index: number, category: { name: string; icon: string; color: string }): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (user && user.customCategories[index]) {
      user.customCategories[index] = category;
      return user.save();
    }
    return user;
  }

  async deleteCustomCategory(userId: string, index: number): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (user) {
      user.customCategories.splice(index, 1);
      return user.save();
    }
    return user;
  }
}
