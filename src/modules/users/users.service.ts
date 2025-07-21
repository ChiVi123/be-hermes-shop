import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import dayjs from 'dayjs';
import mongoose, { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '~/modules/users/dto/update-user.dto';
import { User } from '~/modules/users/entities/user.entity';
import { hashPassword } from '~/utils/hash';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);
    if (!hashedPassword) {
      throw new Error('Failed to hash password');
    }
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);
    if (!hashedPassword) {
      throw new Error('Failed to hash password');
    }
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      isActive: false,
      codeId: uuidv4(),
      codeExpired: dayjs().add(1, 'minutes'),
    });
    return newUser.save();
  }

  async findAll(query: any) {
    const { filter, sort } = aqp(query);
    const page = parseInt(query.page as any) || 1;
    const pageSize = parseInt(query.pageSize as any) || 10;
    const skip = (page - 1) * pageSize;

    if (filter.page) delete filter.page;
    if (filter.pageSize) delete filter.pageSize;

    const users = await this.userModel
      .find(filter)
      .sort(sort as any)
      .skip(skip)
      .limit(pageSize)
      .select('-password')
      .exec();
    const total = await this.userModel.countDocuments(filter).exec();
    return {
      data: users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: skip + pageSize < total,
    };
  }

  findOne(id: number) {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  update({ _id, ...updateUserDto }: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(_id, updateUserDto, { returnDocument: 'after' }).select('-password').exec();
  }

  remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.userModel.deleteOne({ _id: id }).exec();
    } else {
      throw new BadRequestException(`Invalid user ID format {id}: ${id}`);
    }
  }
}
