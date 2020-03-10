import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from '../store/types';
import { UserContext as StandardUserContext } from '../store/UserStore';
import { activateEmailAddressAPI } from '../api/api';
import { ActivationView, ErrorView } from './AuthView';
import { strings } from '../internationalization';

const Errors = strings.EmailActivation.Errors as { [key: string]: string };

export const makeActivateEmailAddress: <User>(
  userContext: UserContext<User>,
) => FC = (
  userContext,
) => () => {
  const { ident, token } = useParams();
  const { apiUrl } = useContext(userContext);
  const [error, setError] = useState<string|undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ident && token) {
      activateEmailAddressAPI(apiUrl, ident, token)
        .catch((error_: AxiosError) => {
          if (error_.response?.status === 400) {
            setError(error_.response.data.error);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [apiUrl, ident, token]);

  if (loading) return <div>Loading</div>;

  if (error) {
    return (
      <ErrorView
        title={strings.EmailActivation.ErrorTitle}
        message={Errors[error] || Errors.general}
      />
    );
  }

  return (
    <ActivationView />
  );
};

export const ActivateEmailAddress = makeActivateEmailAddress(
  StandardUserContext,
);
