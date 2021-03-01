import React, { FC, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthFunctionContext, FullConfig } from '../..';

export const makePrivateProtection = ({
  paths: { mainPage, login },
  components: {
    loadingIndicator: LoadingIndicator,
  },
}: FullConfig): FC => ({ children }) => {
  const { loggedIn, loading } = useContext(AuthFunctionContext);
  const { asPath, replace } = useRouter();
  const next = asPath || mainPage;

  if (loading) return <LoadingIndicator />;
  if (!loggedIn) {
    replace({
      pathname: login,
      query: { next },
    });

    return <LoadingIndicator />;
  }

  return <>{children}</>;
};
