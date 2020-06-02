
import en from './en.json';
import de from './de.json';

const strings = { en, de };

export type Language = keyof typeof strings;
export type Strings = typeof en;

const typedStrings: { [language in Language]: Strings } = strings;

export interface StringsProps {
  strings: Strings;
}

export default typedStrings;
