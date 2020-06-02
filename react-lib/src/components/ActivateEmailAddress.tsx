import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { AuthFunctionContext } from '../store/UserStore';
import { ErrorView } from './AuthView';
import { StringsProps, Strings } from '../internationalization';
import { FullConfig } from '../Configuration';
import { makeActivationCard } from './Activation';

type Errortype = keyof Strings['EmailActivation']['Errors'];

export const makeActivateEmailAddress: (
  config: FullConfig,
) => {
  ActivateEmailAddress: FC<StringsProps>;
  ActivationView: FC<StringsProps>;
  ActivationCard: FC<StringsProps>;
} = (config) => {
  const { ActivationView, ActivationCard } = makeActivationCard(config);

  const ActivateEmailAddress: FC<StringsProps> = ({ strings }) => {
    const { ident, token } = useParams();
    const { activateEmailAddress, csrf } = useContext(AuthFunctionContext);
    const [error, setError] = useState<Errortype|undefined>(undefined);
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
          message={strings.EmailActivation.Errors[error]
            || strings.EmailActivation.Errors.general}
          backgroundImage={config.components.backgroundImage}
        />
      );
    }

    return <ActivationView strings={strings} />;
  };

  return { ActivateEmailAddress, ActivationCard, ActivationView };
};
