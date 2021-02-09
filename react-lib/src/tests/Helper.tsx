import * as React from 'react';
import { FC } from 'react';
import { DeepPartial, mergeConfig } from '../util';
import {
  defaultComponentConfig, DefaultConfig,
  FullConfig, LinkProps, RouteHandler, RoutingConfig,
} from '../config/components';
import { noop } from '../store/UserStore';

export const getTestComponents = (): DefaultConfig['components'] => ({
  backgroundImage: jest.fn(() => null),
  loadingIndicator: jest.fn(() => null),
});

export interface TestRoutingProps {
  linkCallback?: (href: string) => void;
  routeHandler?: RouteHandler;
  queryParams?: Record<string, string>;
}

export const makeTestLink = (
  linkCallback: TestRoutingProps['linkCallback'] = noop,
): FC<LinkProps> => ({ children, href }) => (
  <a
    href={href}
    onClick={(event) => {
      event.preventDefault();
      linkCallback(href);
    }}
  >
    {children}
  </a>
);

export const getTestRouting = (props?: TestRoutingProps): RoutingConfig['routing'] => ({
  link: jest.fn(makeTestLink(props?.linkCallback)),
  useRouteHandler: jest.fn(() => props?.routeHandler ?? {
    push: jest.fn(), replace: jest.fn(),
  }),
  useQueryParams: jest.fn(() => props?.queryParams ?? {}),
});

export const getFullTestConfig = (
  config?: DeepPartial<FullConfig>, routingProps?: TestRoutingProps,
): FullConfig => ({
  ...mergeConfig({
    ...defaultComponentConfig,
    components: getTestComponents(),
    routing: getTestRouting(routingProps),
  }, config ?? {}),
});
