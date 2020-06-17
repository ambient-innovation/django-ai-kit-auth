
import enStrings from './en.json';
import deStrings from './de.json';

export type Strings = typeof enStrings;

interface StringTree {
  [key: string]: StringTree|string;
}

export type Translator = (key: string) => string;

export const tFactory: (strings: Strings) => Translator = (strings) => (key) => {
  let result: StringTree|string|undefined = strings;
  const [, path] = key.split(':', 2);
  const items = path?.split('.') || [];
  items.forEach((item) => {
    switch (typeof result) {
      case 'object':
        result = result[item];
        break;
      default:
        result = undefined;
        break;
    }
  });
  if (typeof result !== 'string') {
    // eslint-disable-next-line no-console
    console.warn('Unknown key for translation:', key);

    return key;
  }

  return result;
};

export const en = tFactory(enStrings);
export const de = tFactory(deStrings);
