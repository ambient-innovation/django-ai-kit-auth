import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import React, { FC, useState } from 'react';
import { type } from 'os';
import { Paper } from '@material-ui/core';
import { useUserStore } from '../store/UserStore';
import { en as strings } from '../internationalization';

const useStyles = makeStyles((theme: Theme) => ({
  loginForm: {
    paddingTop: 35,
    paddingLeft: 47,
    paddingRight: 30,
    paddingBottom: 36,
    boxShadow: '0 1px 36px 0 rgba(211, 211, 211, 0.5)',
  },
}));
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
  const classes = useStyles();
  const { login } = useUserStore();
  const [userIdentifier, setUserIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Paper
      className={classes.loginForm}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(userIdentifier, password);
        }}
      >
        <TextField
          autoFocus
          id="userIdentifier"
          label={strings.LoginForm[Identifier[identifier] as IdentifierType]}
          variant="outlined"
          value={userIdentifier}
          onChange={(event) => {
            setUserIdentifier(event.target.value);
          }}
        />
        <TextField
          id="password"
          label={strings.LoginForm.Password}
          variant="outlined"
          value={password}
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <Button
          type="submit"
          title={strings.LoginForm.Login}
          variant="contained"
          color="primary"
        />
      </form>
    </Paper>
  );
};

export const LoginForm = makeLoginForm({
  identifier: Identifier.UsernameOrEmail,
});
