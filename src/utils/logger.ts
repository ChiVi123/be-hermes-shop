import * as winston from 'winston';
import { NestLikeConsoleFormatOptions, WinstonModule } from 'nest-winston';
import { Format } from 'logform';
import safeStringify from 'fast-safe-stringify';
import { inspect } from 'util';

type Info = {
  timestamp: string | undefined;
  level: string;
  context: string | undefined;
  message: string | undefined;
  ms: string | undefined;
};

const clc = {
  bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
  italic: (text: string) => `\x1B[3m${text}\x1B[0m`,
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  blueBright: (text: string) => `\x1B[94m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
  paleGreen: (text: string) => `\x1b[38;5;192m${text}\x1B[0m`,
  mediumOrchid: (text: string) => `\x1b[38;5;181m${text}\x1B[0m`,
};
const nestLikeColorScheme: Record<string, (text: string) => string> = {
  log: clc.green,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
};
const defaultOptions: NestLikeConsoleFormatOptions = {
  colors: !process.env.NO_COLOR,
  prettyPrint: true,
  processId: true,
  appName: true,
};

const stringDefined = (value: string | undefined): value is string => typeof value !== 'undefined';
const nestLikeConsoleFormat = (appName = 'NestWinston', options: NestLikeConsoleFormatOptions = {}): Format => {
  const formatOptions: NestLikeConsoleFormatOptions = { ...defaultOptions, ...options };

  return winston.format.printf(({ context, level, timestamp, message, ms, ...meta }: Info) => {
    if ('info' === level) {
      level = 'log';
    }

    if (stringDefined(timestamp)) {
      // Only format the timestamp to a locale representation if it's ISO 8601 format. Any format
      // that is not a valid date string will throw, just ignore it (it will be printed as-is).
      try {
        if (timestamp === new Date(timestamp).toISOString()) {
          timestamp = new Date(timestamp).toLocaleString();
        }
      } catch (error) {
        console.error(error);
      }
    }

    const color = (formatOptions.colors && nestLikeColorScheme[level]) || ((text: string): string => text);

    const stringifiedMeta = safeStringify(meta);
    const formattedMeta = formatOptions.prettyPrint
      ? inspect(JSON.parse(stringifiedMeta), { colors: formatOptions.colors, depth: null })
      : stringifiedMeta;

    return (
      (formatOptions.appName ? color(`[${appName}]`) + ' ' : '') +
      (formatOptions.processId ? color(String(process.pid)).padEnd(6) + ' ' : '') +
      (stringDefined(timestamp) ? `${timestamp} ` : '') +
      `${color(level.toUpperCase().padStart(7))} ` +
      (stringDefined(context) ? `${clc.mediumOrchid('[' + context + ']')}` : '') +
      (stringDefined(message) ? ` ${color(message)}` : '') +
      (formattedMeta && formattedMeta !== '{}' ? ` - ${formattedMeta}` : '') +
      (stringDefined(ms) ? ` ${clc.italic(clc.paleGreen(ms))}` : '')
    );
  });
};

export const LoggerFactory = (appName: string) => {
  const consoleFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestLikeConsoleFormat(appName),
  );

  return WinstonModule.createLogger({
    transports: [new winston.transports.Console({ format: consoleFormat })],
  });
};
