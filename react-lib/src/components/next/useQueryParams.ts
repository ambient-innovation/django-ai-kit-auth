import { useRouter } from 'next/router';

const lastElementIfArray = <T>(input: T|T[]): T => (
  Array.isArray(input) ? input[input.length - 1] : input
);

export const useQueryParams = (): Record<string, string> => {
  const { query } = useRouter();

  return Object.assign({}, ...Object.entries(query).map(
    ([key, value]) => ({ [key]: lastElementIfArray(value) ?? '' }),
  ));
};
