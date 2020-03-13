import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC, useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AxiosError } from 'axios';
import { AuthFunctionContext } from '../store/UserStore';
import { strings } from '../internationalization';
import { ErrorMessage, MetaDict, ObjectOfStrings } from '../api/types';
import { FullConfig, Identifier } from '../Configuration';
import { AuthView } from './AuthView';

const fieldErrors: ObjectOfStrings = strings.LoginForm.FieldErrors;
const nonFieldErrors: MetaDict = strings.LoginForm.NonFieldErrors;

const useStyles = makeStyles((theme: Theme) => createStyles({
  loginForm: {
    paddingTop: 35,
    paddingLeft: 47,
    paddingRight: 30,
    paddingBottom: 40,
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
  loggedOutText: {
    color: theme.palette.primary.main,
    marginBottom: 35,
    marginTop: -20,
  },
}));

type IdentifierType = keyof typeof Identifier;

export const makeLoginForm: (config: FullConfig) => { LoginForm: FC; LoginView: FC } = ({
  paths: { forgotPassword },
  userIdentifier,
}) => {
  const LoginForm = () => {
    const classes = useStyles();
    const { login, justLoggedOut } = useContext(AuthFunctionContext);
    const [ident, setIdent] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({});

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

        {
         justLoggedOut && (
           <Typography
             variant="body2"
             className={classes.loggedOutText}
           >
             {strings.LoginForm.LogoutSuccess}
           </Typography>
         )
       }

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(ident, password)
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
            id="login_userIdentifier"
            label={strings.LoginForm[Identifier[userIdentifier] as IdentifierType]}
            variant="outlined"
            type={userIdentifier === Identifier.Email ? 'email' : 'text'}
            value={ident}
            helperText={errorMessage.ident ? errorMessage.ident.map((message: string) => (
              fieldErrors[message])) : ''}
            error={!!errorMessage.ident}
            onChange={(event) => {
              setIdent(event.target.value);
            }}
          />

          <TextField
            className={classes.inputField}
            fullWidth
            id="login_password"
            label={strings.LoginForm.Password}
            variant="outlined"
            value={password}
            type={showPassword ? 'text' : 'password'}
            helperText={errorMessage.password ? errorMessage.password.map((message: string) => (
              fieldErrors[message])) : ''}
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
             errorMessage.non_field_errors.map((message) => (
               <Typography className={classes.formHelperText} key={message}>
                 {
                   nonFieldErrors[message][Identifier[userIdentifier] as IdentifierType]
                 }
               </Typography>
             ))
           )
         }

          <Grid container item xs={12} justify="center">
            <Button
              id="login_submit"
              type="submit"
              title={strings.LoginForm.Login}
              variant="contained"
              color="primary"
            >
              {strings.LoginForm.Login}
            </Button>
          </Grid>

          <Grid style={{ marginTop: 24 }} container item xs={12} justify="center">
            <Link
              id="login_password_reset"
              variant="body1"
              color="textPrimary"
              component={RouterLink}
              to={forgotPassword}
            >
              {strings.LoginForm.ForgotPassword}
            </Link>
          </Grid>
        </form>
      </Paper>
    );
  };

  const LoginView = () => (
    <AuthView>
      <LoginForm />
    </AuthView>
  );

  return { LoginForm, LoginView };
};
