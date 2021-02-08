export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

export const mergeConfig = <T extends {}>(
  defaults: T, configs: DeepPartial<T>,
): T => {
  const fullConfig = { ...defaults };
  if (configs) {
    Object.entries(configs).forEach(([key, value]) => {
      if (typeof value === 'object') {
        fullConfig[key as keyof T] = mergeConfig(
          defaults[key as keyof T],
          value as DeepPartial<T[keyof T]>,
        );
      } else {
        fullConfig[key as keyof T] = value as T[keyof T];
      }
    });
  }

  return fullConfig;
};
