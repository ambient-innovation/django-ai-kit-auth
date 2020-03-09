import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { strings } from '../internationalization';
import { UserContext } from '../store/types';
import { UserContext as StandardUserContext } from '../store/UserStore';
import { activateEmailAddressAPI } from '../api/api';

export const makeActivateEmailAddress: <User>(
  userContext: UserContext<User>,
) => FC = (
  userContext,
) => () => {
  const { ident, token } = useParams();
  const { apiUrl } = useContext(userContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ident && token) {
      activateEmailAddressAPI(apiUrl, ident, token)
        .finally(() => setLoading(false));
    }
  }, [apiUrl, ident, token]);

  if (loading) return <div>Loading</div>;

  return (
    <div>
      {strings.EmailActivation.SucessMessage}
    </div>
  );
};

export const ActivateEmailAddress = makeActivateEmailAddress(
  StandardUserContext,
);
