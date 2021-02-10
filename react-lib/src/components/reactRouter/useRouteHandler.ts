import { useHistory } from 'react-router-dom';
import { useCallback } from 'react';
import { RouteHandler, UrlDescriptor } from '../../config/components';

const convertUrlDescriptor = (url: UrlDescriptor): string => {
  if (typeof url === 'string') return url;
  if (!url.query) return url.pathname;
  const query = new URLSearchParams(url.query).toString();

  return `${url.pathname}?${query}`;
};

export const useRouteHandler = (): RouteHandler => {
  const history = useHistory();

  return {
    push: useCallback((url) => history.push(convertUrlDescriptor(url)), [history]),
    replace: useCallback((url) => history.replace(convertUrlDescriptor(url)), [history]),
  };
};
