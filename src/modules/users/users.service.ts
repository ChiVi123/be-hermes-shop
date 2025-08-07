import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import dayjs from 'dayjs';
import { isValidObjectId, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Environment } from '~/core/environment.class';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '~/modules/users/dto/update-user.dto';
import { User, UserDocument } from '~/modules/users/entities/user.entity';
import { Query } from '~/types/apiQueryParams';
import { hashPassword } from '~/utils/hash';

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
    const isAccountExist = await this.userModel.exists({ email: createUserDto.email }).exec();
    if (isAccountExist !== null) {
      throw new ConflictException([{ property: 'email', constraints: ['Account is already'] }]);
    }

    const hashedPassword = await hashPassword(createUserDto.password);
    if (!hashedPassword) {
      throw new Error('Failed to hash password');
    }

    const verifyAccountExpireTime = this.config.get('VERIFY_ACCOUNT_EXPIRE_TIME', { infer: true }) || 5;
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

  public async findAll(query: string | Query) {
    const { filter, sort } = aqp(query);
    const page = parseInt(filter.page as string) || 1;
    const pageSize = parseInt(filter.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    if (filter.page) delete filter.page;
    if (filter.pageSize) delete filter.pageSize;

    const users = await this.userModel
      .find(filter)
      .sort(sort as Record<string, 1 | -1>)
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

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address of the user to find.
   * @param security - If true, excludes the password field in the result; otherwise, includes it. Defaults to undefined.
   * @returns A promise that resolves to the user document if found, or null otherwise.
   */
  public findByEmail(email: string, security?: boolean) {
    let modelQuery = this.userModel.findOne({ email });
    if (security) {
      modelQuery = modelQuery.select('-password');
    }
    return modelQuery.exec();
  }

  public update({ _id, ...updateUserDto }: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(_id, updateUserDto, { returnDocument: 'after' }).select('-password').exec();
  }

  public async verify(_id: string, codeId: string) {
    const user = await this.userModel.findOne({ _id, codeId, isActive: ACCOUNT_IS_NOT_ACTIVE }).exec();
    if (!user) {
      throw new NotFoundException('User not found or activated');
    }

    const isExpired = dayjs().isAfter(dayjs(user.codeExpired));
    if (isExpired) {
      throw new BadRequestException('Verification code expired');
    }

    await user.updateOne({ isActive: ACCOUNT_IS_ACTIVE }).exec();

    return { message: 'User account activated successfully' };
  }

  public remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid user ID format {id}: ${id}`);
    }

    return this.userModel.deleteOne({ _id: id }).exec();
  }

  public async resendMail(email: string) {
    const user = await this.findByEmail(email, true);
    if (!user) {
      throw new NotFoundException('User not found or activated');
    }
    const codeId = uuidv4();
    const verifyAccountExpireTime = this.config.get('VERIFY_ACCOUNT_EXPIRE_TIME', { infer: true }) || 5;
    const verifyAccountExpireUnit = this.config.get('VERIFY_ACCOUNT_EXPIRE_UNIT', { infer: true }) || 'minutes';

    user.codeId = codeId;
    user.codeExpired = dayjs().add(verifyAccountExpireTime, verifyAccountExpireUnit).toDate();

    const savedUser = await user.save();
    this.sendMailAccountActivation(savedUser, codeId);
    return { _id: savedUser._id };
  }

  private sendMailAccountActivation(user: UserDocument, codeId: string): void {
    // TODO: should insert button for copy the code active account - use js handle the feature
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
