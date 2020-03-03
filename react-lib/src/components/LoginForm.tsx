import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC, useState } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { useUserStore } from '../store/UserStore';
import { en as strings } from '../internationalization';

const useStyles = makeStyles((theme: Theme) => createStyles({
  loginForm: {
    paddingTop: 35,
    paddingLeft: 47,
    paddingRight: 30,
    paddingBottom: 36,
    boxShadow: '0 1px 36px 0 rgba(211, 211, 211, 0.5)',
  },
  loginTitle: {
    marginBottom: 35,

  },
  inputField: {
    marginBottom: 30,
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Paper
      className={classes.loginForm}
    >
      <Typography
        className={classes.loginTitle}
        variant="h2"
      >
        {strings.LoginForm.Login}
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(userIdentifier, password);
        }}
      >
        <TextField
          className={classes.inputField}
          autoFocus
          fullWidth
          id="userIdentifier"
          label={strings.LoginForm[Identifier[identifier] as IdentifierType]}
          variant="outlined"
          value={userIdentifier}
          onChange={(event) => {
            setUserIdentifier(event.target.value);
          }}
        />
        <TextField
          className={classes.inputField}
          fullWidth
          id="password"
          label={strings.LoginForm.Password}
          variant="outlined"
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          title="Anmelden"
          variant="contained"
          color="primary"
        >
          {strings.LoginForm.Login}
        </Button>
      </form>
    </Paper>
  );
};

export const LoginForm = makeLoginForm({
  identifier: Identifier.UsernameOrEmail,
});
