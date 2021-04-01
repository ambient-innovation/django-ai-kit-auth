import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { AuthFunctionContext, FullConfig } from '..';
import { ErrorView } from './AuthView';
import { makeActivationCard } from './Activation';
import { TranslatorProps } from '../internationalization';

export interface MakeActivateEmailAddressResult {
  ActivateEmailAddress: FC<TranslatorProps>;
  ActivationView: FC<TranslatorProps>;
  ActivationCard: FC<TranslatorProps>;
}

export function makeActivateEmailAddress(config: FullConfig): MakeActivateEmailAddressResult {
  const { useQueryParams } = config.routing;
  const { ActivationView, ActivationCard } = makeActivationCard(config);
  const {
    defaultTranslator,
    components,
  } = config;

  const ActivateEmailAddress: FC<TranslatorProps> = ({
    translator: t = defaultTranslator,
  }) => {
    const { ident, token } = useQueryParams();
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

    if (loading) return <components.loadingIndicator />;

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
}
