import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC, useState } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { AxiosError } from 'axios';
import { useUserStore } from '../store/UserStore';
import { strings } from '../internationalization';
import { MetaDict, ObjectOfStrings } from '../api/types';

const fieldErrors: ObjectOfStrings = strings.LoginForm.FieldErrors;
const nonFieldErrors: MetaDict = strings.LoginForm.NonFieldErrors;

const useStyles = makeStyles((theme: Theme) => createStyles({
  loginForm: {
    paddingTop: 35,
    paddingLeft: 47,
    paddingRight: 30,
    paddingBottom: 36,
    boxShadow: '0 1px 36px 0 rgba(211, 211, 211, 0.5)',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      paddingLeft: 30,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 17,
      paddingRight: 17,
    },
  },
  loginTitle: {
    marginBottom: 35,
    [theme.breakpoints.down('xs')]: {
      fontSize: 30,
      letterSpacing: 0.18,
    },
  },
  inputField: {
    marginBottom: 30,
  },
  formHelperText: {
    marginBottom: 41,
    fontSize: '1rem',
    color: theme.palette.primary.main,
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
  const [errorMessage, setErrorMessage] = useState<ObjectOfStrings>({});

  return (
    <Paper
      className={classes.loginForm}
    >
      <Typography
        className={classes.loginTitle}
        variant="h3"
      >
        {strings.LoginForm.Login}
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(userIdentifier, password)
            .catch((error: AxiosError) => {
              if (error.response) {
                setErrorMessage(error.response.data);
              }
            });
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
          helperText={errorMessage.ident ? (fieldErrors[errorMessage.ident]) : ''}
          error={!!errorMessage.ident}
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
          helperText={errorMessage.password ? (fieldErrors[errorMessage.password]) : ''}
          error={!!errorMessage.password}
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
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {
          errorMessage.non_field_errors && (
            <Typography className={classes.formHelperText}>
              {
                nonFieldErrors[
                  errorMessage.non_field_errors
                ][Identifier[identifier] as IdentifierType]
              }
            </Typography>
          )
        }

        <Grid container item xs={12} justify="center">
          <Button
            type="submit"
            title={strings.LoginForm.Login}
            variant="contained"
            color="primary"
          >
            {strings.LoginForm.Login}
          </Button>
        </Grid>
      </form>
    </Paper>
  );
};

export const LoginForm = makeLoginForm({
  identifier: Identifier.UsernameOrEmail,
});
