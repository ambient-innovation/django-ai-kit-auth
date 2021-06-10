export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

export const mergeConfig = <T>(
  defaults: T, configs: DeepPartial<T>,
): T => {
  const fullConfig: T = { ...defaults };
  if (configs) {
    Object.entries(configs).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
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
