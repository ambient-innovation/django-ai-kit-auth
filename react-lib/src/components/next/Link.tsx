import React, { FC } from 'react';
import NextLink from 'next/link';
import MaterialLink from '@material-ui/core/Link';
import { LinkProps } from '../../config/components';

export const Link: FC<LinkProps> = ({
  href, children, ...typographyProps
}) => (
  <NextLink href={href} passHref>
    <MaterialLink {...typographyProps}>
      {children}
    </MaterialLink>
  </NextLink>
);
