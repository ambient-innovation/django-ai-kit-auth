import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { AuthFunctionContext } from '../store/UserStore';
import { ErrorView } from './AuthView';
import { strings } from '../internationalization';
import { FullConfig } from '../Configuration';
import { makeActivationCard } from './Activation';

const Errors = strings.EmailActivation.Errors as { [key: string]: string };

export const makeActivateEmailAddress: (
  config: FullConfig,
) => {
  ActivateEmailAddress: FC; ActivationView: FC; ActivationCard: FC;
} = (config) => {
  const { ActivationView, ActivationCard } = makeActivationCard(config);

  const ActivateEmailAddress = () => {
    const { ident, token } = useParams();
    const { activateEmailAddress, csrf } = useContext(AuthFunctionContext);
    const [error, setError] = useState<string|undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (ident && token && csrf) {
        activateEmailAddress(ident, token)
          .catch((error_: AxiosError) => {
            setError(error_.response?.data.error || 'general');
          })
          .finally(() => setLoading(false));
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ident, token, csrf]);

    if (loading) return config.components.loadingIndicator();

    if (error) {
      return (
        <ErrorView
          title={strings.EmailActivation.ErrorTitle}
          message={Errors[error] || Errors.general}
          backgroundImage={config.components.backgroundImage}
        />
      );
    }

    return <ActivationView />;
  };

  return { ActivateEmailAddress, ActivationCard, ActivationView };
};
