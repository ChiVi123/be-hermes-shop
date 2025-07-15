import { ConfigService, Path } from '@nestjs/config';

type RecordUnknown = Record<string | symbol, unknown>;

export const getPropertyConfig = <T = RecordUnknown>(config: ConfigService<T>, name: Path<T>) => {
  return config.get(name, { infer: true });
};
