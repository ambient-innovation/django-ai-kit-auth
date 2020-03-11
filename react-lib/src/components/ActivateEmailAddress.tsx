import CircularProgress from '@material-ui/core/CircularProgress';
import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { AuthFunctionContext } from '../store/UserStore';
import { ActivationView, ErrorView } from './AuthView';
import { strings } from '../internationalization';

const Errors = strings.EmailActivation.Errors as { [key: string]: string };

interface ActivateEmailAddressOptions {
  loadingIndicator?: () => JSX.Element;
  errorView?: (title: string, message: string) => JSX.Element;
  successView?: () => JSX.Element;
}

export const makeActivateEmailAddress: (
  options: ActivateEmailAddressOptions,
) => FC = ({
  loadingIndicator = () => <CircularProgress />,
  errorView = ((title, message) => <ErrorView title={title} message={message} />),
  successView = () => <ActivationView />,
}) => () => {
  const { ident, token } = useParams();
  const { activateEmailAddress } = useContext(AuthFunctionContext);
  const [error, setError] = useState<string|undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ident && token) {
      activateEmailAddress(ident, token)
        .catch((error_: AxiosError) => {
          if (error_.response?.status === 400) {
            setError(error_.response.data.error);
          }
        })
        .finally(() => setLoading(false));
    }
  });

  if (loading) return loadingIndicator();

  if (error) {
    return errorView(
      strings.EmailActivation.ErrorTitle,
      Errors[error] || Errors.general,
    );
  }

  return successView();
};

export const ActivateEmailAddress = makeActivateEmailAddress({});
