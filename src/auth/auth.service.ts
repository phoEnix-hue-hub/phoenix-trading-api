// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken'; // Import jsonwebtoken
import { Types } from 'mongoose'; // Import Types for ObjectId

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(name: string, phone: string, email: string, password: string): Promise<{ success: boolean; message?: string; user?: any }> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      return { success: false, message: 'Email already registered. Please use a different email or log in.' };
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new this.userModel({
      name,
      phone,
      email,
      password: hashedPassword,
      balance: 0,
      lastLogin: new Date(),
    });

    try {
      const savedUser = await newUser.save();
      return {
        success: true,
        user: {
          name: savedUser.name,
          email: savedUser.email,
          username: savedUser.email,
          balance: savedUser.balance,
          lastLogin: savedUser.lastLogin,
        },
      };
    } catch (error) {
      console.error('Error saving user:', error);
      return { success: false, message: 'An error occurred during registration. Please try again.' };
    }
  }

  async login(identifier: string, password: string): Promise<{ success: boolean; message?: string; user?: any; token?: string }> {
    const user = await this.userModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    }).exec() as UserDocument | null; // Explicitly type as UserDocument

    if (!user) {
      return { success: false, message: 'Invalid email/phone or password.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid email/phone or password.' };
    }

    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token with explicit _id casting
    const payload = {
      id: (user._id as Types.ObjectId).toString(), // Explicit cast to ObjectId
      email: user.email,
      name: user.name,
    };
    const token = sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return {
      success: true,
      user: {
        name: user.name,
        email: user.email,
        username: user.email,
        balance: user.balance,
        lastLogin: user.lastLogin,
      },
      token, // Return the generated token
    };
  }

  async updateBalance(username: string, balance: number): Promise<{ success: boolean; message?: string }> {
    const user = await this.userModel.findOne({ email: username }).exec();
    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    user.balance = balance;
    await user.save();
    return { success: true };
  }

  async updateCentralWallet(amount: number): Promise<{ success: boolean; message?: string }> {
    let centralWallet = await this.userModel.findOne({ email: 'central-wallet@phoenix-trading.frx' }).exec();
    if (!centralWallet) {
      centralWallet = new this.userModel({
        email: 'central-wallet@phoenix-trading.frx',
        balance: 0,
        name: 'Central Wallet',
      });
    }
    centralWallet.balance += amount;
    await centralWallet.save();
    return { success: true };
  }
}
