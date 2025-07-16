import { ConfigService, Path, PathValue } from '@nestjs/config';

type RecordUnknown = Record<string | symbol, unknown>;
type GetPropertyConfig = <T = RecordUnknown, P extends Path<T> = any>(
  config: ConfigService<T>,
  name: P,
) => PathValue<T, P> | undefined;

export const getPropertyConfig: GetPropertyConfig = (config, name) => config.get(name, { infer: true });
