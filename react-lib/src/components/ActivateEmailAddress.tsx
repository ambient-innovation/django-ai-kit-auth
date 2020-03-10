import CircularProgress from '@material-ui/core/CircularProgress';
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

interface ActivateEmailAddressOptions<User> {
  userContext: UserContext<User>;
  loadingIndicator?: () => JSX.Element;
  errorView?: (title: string, message: string) => JSX.Element;
  successView?: () => JSX.Element;
}

export const makeActivateEmailAddress: <User>(
  options: ActivateEmailAddressOptions<User>,
) => FC = ({
  userContext,
  loadingIndicator = () => <CircularProgress />,
  errorView = ((title, message) => <ErrorView title={title} message={message} />),
  successView = () => <ActivationView />,
}) => () => {
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

  if (loading) return loadingIndicator();

  if (error) {
    return errorView(
      strings.EmailActivation.ErrorTitle,
      Errors[error] || Errors.general,
    );
  }

  return successView();
};

export const ActivateEmailAddress = makeActivateEmailAddress({
  userContext: StandardUserContext,
});
