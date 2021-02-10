import { useRouter } from 'next/router';

const lastElementIfArray = (input: string|string[]): string => (
  typeof input === 'string' ? input : (input[input.length - 1] ?? '')
);


export const useQueryParams = (): Record<string, string> => {
  const { query } = useRouter();

  return Object.assign({}, ...Object.entries(query).map(
    ([key, value]) => ({ [key]: lastElementIfArray(value) }),
  ));
};
