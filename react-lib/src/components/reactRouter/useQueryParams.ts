import { useLocation } from 'react-router-dom';

export const useQueryParams = <QP extends {[key: string]: string}>(): QP => {
  const { search } = useLocation();
  const params: Record<string, string> = {};
  new URLSearchParams(search).forEach((value, key) => {
    params[key] = value;
  });

  return params as QP;
};
