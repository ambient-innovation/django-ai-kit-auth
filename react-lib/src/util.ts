/* eslint-disable @typescript-eslint/ban-types */

type AnyConfig = Object;

export type DeepPartial<T extends AnyConfig> = {
  [K in keyof T]?: T[K] extends Function
? T[K] : T[K] extends AnyConfig ? DeepPartial<T[K]> : T[K];
}

export const mergeConfig = <T extends AnyConfig>(
  defaults: T, configs: DeepPartial<T>,
): T => {
  const fullConfig: T = { ...defaults };
  if (configs) {
    Object.entries(configs).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        fullConfig[key as keyof T] = mergeConfig(
          // We cannot lean on typescript to infer the correct types because
          // of the use of Object.entries(). Therefore we bite the bullet
          // and use tests to make sure everything works fine.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          defaults[key as keyof T] as any,
          value,
        );
      } else {
        fullConfig[key as keyof T] = value as T[keyof T];
      }
    });
  }

  return fullConfig;
};
