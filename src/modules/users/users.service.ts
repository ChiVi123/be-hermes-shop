import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import dayjs from 'dayjs';
import mongoose, { Document, Model, SortOrder, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Environment } from '~/config/environment.class';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '~/modules/users/dto/update-user.dto';
import { User } from '~/modules/users/entities/user.entity';
import { hashPassword } from '~/utils/hash';

type DocumentUser = Document<unknown, object, User, object> & User & { _id: Types.ObjectId };

const ACCOUNT_IS_NOT_ACTIVE = false;
const ACCOUNT_IS_ACTIVE = true;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService<Environment, true>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
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

  public async register(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);
    if (!hashedPassword) {
      throw new Error('Failed to hash password');
    }

    const verifyAccountExpireTime = this.config.get('VERIFY_ACCOUNT_EXPIRE_TIME', { infer: true }) || 24;
    const verifyAccountExpireUnit = this.config.get('VERIFY_ACCOUNT_EXPIRE_UNIT', { infer: true }) || 'minutes';
    const codeId = uuidv4();
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      isActive: false,
      codeId,
      codeExpired: dayjs().add(verifyAccountExpireTime, verifyAccountExpireUnit),
    });
    const savedUser = await newUser.save();

    this.sendMailAccountActivation(savedUser, codeId);

    return { _id: savedUser._id };
  }

  public async findAll(query: { [key: string]: any }) {
    const { filter, sort } = aqp(query);
    const page = parseInt(query.page as string) || 1;
    const pageSize = parseInt(query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    if (filter.page) delete filter.page;
    if (filter.pageSize) delete filter.pageSize;

    const users = await this.userModel
      .find(filter)
      .sort(sort as string | { [key: string]: SortOrder | { $meta: any } } | [string, SortOrder][] | undefined | null)
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

  public findOne(id: number) {
    return this.userModel.findById(id).exec();
  }

  public findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  public update({ _id, ...updateUserDto }: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(_id, updateUserDto, { returnDocument: 'after' }).select('-password').exec();
  }

  public async verify(email: string, codeId: string) {
    const user = await this.userModel.findOne({ email, codeId, isActive: ACCOUNT_IS_NOT_ACTIVE }).exec();
    if (!user) {
      throw new NotFoundException('User not found or already active');
    }

    this.handleUserCodeId(user.codeExpired);

    await user.updateOne({ isActive: ACCOUNT_IS_ACTIVE }).exec();

    return { message: 'User account activated successfully' };
  }

  public remove(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException(`Invalid user ID format {id}: ${id}`);
    }

    return this.userModel.deleteOne({ _id: id }).exec();
  }

  private handleUserCodeId(codeExpired: Date) {
    const isExpired = this.checkUserCodeIdExpired(codeExpired);
    if (isExpired) {
      throw new BadRequestException('Verification code expired');
    }
  }

  private checkUserCodeIdExpired(codeExpired: Date): boolean {
    return dayjs().isAfter(dayjs(codeExpired));
  }

  private sendMailAccountActivation(user: DocumentUser, codeId: string): void {
    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Active your account at HermesShop',
        template: 'register.hbs',
        context: {
          name: user.username ?? user.email,
          activationCode: codeId,
        },
      })
      .then(() => {})
      .catch(() => {});
  }
}
