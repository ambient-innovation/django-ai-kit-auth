import React, { FC } from 'react';
import MaterialLink from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import { LinkProps } from '../../config/components';

export const Link: FC<LinkProps> = ({
  href, children, ...typographyProps
}) => (
  <MaterialLink
    {...typographyProps}
    component={RouterLink}
    to={href}
  >
    {children}
  </MaterialLink>
);
