import { useHistory } from 'react-router-dom';
import { RouteHandler, UrlDescriptor } from '../../config/components';

const convertUrlDescriptor = (url: UrlDescriptor): string => {
  if (typeof url === 'string') return url;
  if (!url.query) return url.path;
  const query = new URLSearchParams(url.query).toString();

  return `${url.path}?${query}`;
};

export const useRouteHandler = (): RouteHandler => {
  const history = useHistory();

  return {
    push: (url) => history.push(convertUrlDescriptor(url)),
    replace: (url) => history.replace(convertUrlDescriptor(url)),
  };
};
