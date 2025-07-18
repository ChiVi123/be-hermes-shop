import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
