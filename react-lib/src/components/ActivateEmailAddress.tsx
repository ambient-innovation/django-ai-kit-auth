import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { AuthFunctionContext } from '../store/UserStore';
import { ErrorView } from './AuthView';
import { strings } from '../internationalization';
import { FullConfig } from '../Configuration';
import { makeActivationCard } from './ActivationCard';

const Errors = strings.EmailActivation.Errors as { [key: string]: string };

export const makeActivateEmailAddress: (
  config: FullConfig,
) => {
  ActivateEmailAddress: FC; ActivationView: FC; ActivationCard: FC;
} = (config) => {
  const { ActivationView, ActivationCard } = makeActivationCard(config);

  const ActivateEmailAddress = () => {
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

    if (loading) return config.components.loadingIndicator();

    if (error) {
      return (
        <ErrorView
          title={strings.EmailActivation.ErrorTitle}
          message={Errors[error] || Errors.general}
        />
      );
    }

    return <ActivationView />;
  };

  return { ActivateEmailAddress, ActivationCard, ActivationView };
};
