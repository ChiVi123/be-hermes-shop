import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsString, IsUrl, Matches } from 'class-validator';
import dayjs from 'dayjs';

type ApiVersion = `api/v${number}`;

const PORT_DEFAULT = 8080;
const API_VERSION_DEFAULT = 'api/v1';

const nodeEnv = ['production', 'development', 'debug', 'test'] as const;
const manipulate = [
  'year',
  'years',
  'y',
  'month',
  'months',
  'M',
  'week',
  'weeks',
  'w',
  'day',
  'days',
  'd',
  'hour',
  'hours',
  'h',
  'minute',
  'minutes',
  'm',
  'second',
  'seconds',
  's',
  'millisecond',
  'milliseconds',
  'ms',
] as const;

export class Environment {
  @IsNumber()
  @Transform(({ value }) => Number(value) || PORT_DEFAULT)
  PORT: number;

  @IsIn(nodeEnv)
  @IsString()
  NODE_ENV: (typeof nodeEnv)[number];

  @Matches(/^api\/v\d+$/)
  @IsString()
  @Transform(({ value }) => String(value) || API_VERSION_DEFAULT)
  API_VERSION: ApiVersion;

  @IsUrl({ protocols: ['mongodb', 'mongodb+srv'], require_tld: false })
  @IsString()
  MONGO_URI: string;

  @IsString()
  ACCESS_TOKEN_SECRET_SIGNATURE: string;

  @IsString()
  ACCESS_TOKEN_LIFE: string;

  @IsString()
  REFRESH_TOKEN_SECRET_SIGNATURE: string;

  @IsString()
  REFRESH_TOKEN_LIFE: string;

  @IsNumber()
  VERIFY_ACCOUNT_EXPIRE_TIME: number;

  @IsIn(manipulate)
  @IsString()
  VERIFY_ACCOUNT_EXPIRE_UNIT: dayjs.ManipulateType;

  @IsString()
  MAIL_SERVICE: string;

  @IsString()
  MAIL_HOST: string;

  @IsNumber()
  MAIL_PORT: number;

  @IsString()
  MAIL_USER: string;

  @IsString()
  MAIL_PASSWORD: string;
}
