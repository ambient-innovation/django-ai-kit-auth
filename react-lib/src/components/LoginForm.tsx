import TextField from '@material-ui/core/TextField';
import React, { FC, useState } from 'react';
import { useUserStore } from '../store/UserStore';
import { en as strings } from '../internationalization';

export enum Identifier {
  Username = 1,
  Email= 2,
  UsernameOrEmail = 3,
}

type IdentifierType = keyof typeof Identifier;

export interface LoginFormOptions {
  identifier: Identifier;
}

export const makeLoginForm: (options: LoginFormOptions) => FC = ({
  identifier,
}) => () => {
  const { login } = useUserStore();
  const [userIdentifier, setUserIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        login(userIdentifier, password);
      }}
    >
      <TextField
        id="userIdentifier"
        placeholder={strings.LoginForm[Identifier[identifier] as IdentifierType]}
        variant="outlined"
        value={userIdentifier}
        onChange={(event) => {
          setUserIdentifier(event.target.value);
        }}
      />
      <TextField
        id="password"
        placeholder={strings.LoginForm.Password}
        variant="outlined"
        value={password}
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
    </form>
  );
};

export const LoginForm = makeLoginForm({
  identifier: Identifier.UsernameOrEmail,
});
