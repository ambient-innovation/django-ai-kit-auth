import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { AuthFunctionContext } from '../store/UserStore';
import { ErrorView } from './AuthView';
import { FullConfig } from '../Configuration';
import { makeActivationCard } from './Activation';
import { TranslatorProps } from '../internationalization';

export const makeActivateEmailAddress: (
  config: FullConfig,
) => {
  ActivateEmailAddress: FC<TranslatorProps>;
  ActivationView: FC<TranslatorProps>;
  ActivationCard: FC<TranslatorProps>;
} = (config) => {
  const { ActivationView, ActivationCard } = makeActivationCard(config);
  const {
    defaultTranslator,
    components,
  } = config;

  const ActivateEmailAddress: FC<TranslatorProps> = ({
    translator: t = defaultTranslator,
  }) => {
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

    if (loading) return components.loadingIndicator();

    if (error) {
      const errorKey = `auth:EmailActivation.Errors.${error}`;
      const message = t(errorKey);

      return (
        <ErrorView
          title={t('auth:EmailActivation.ErrorTitle')}
          message={message === errorKey
            ? t('auth:EmailActivation.Errors.general') : message}
          backgroundImage={components.backgroundImage}
        />
      );
    }

    return <ActivationView />;
  };

  return { ActivateEmailAddress, ActivationCard, ActivationView };
};
