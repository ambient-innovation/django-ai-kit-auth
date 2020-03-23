import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC, useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AxiosError } from 'axios';
import { AuthFunctionContext } from '../store/UserStore';
import { LogoutReason } from '../store/types';
import { strings } from '../internationalization';
import { ErrorMessage, MetaDict, ObjectOfStrings } from '../api/types';
import { FullConfig, Identifier } from '../Configuration';
import { AuthView } from './AuthView';
import { PasswordField } from './common/PasswordField';

const fieldErrors: ObjectOfStrings = strings.Common.FieldErrors;
const nonFieldErrors: MetaDict = strings.Common.NonFieldErrors;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  form: {
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
  title: {
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
  linkUnderPaper: {
    marginTop: 20,
  },
}));

type IdentifierType = keyof typeof Identifier;

export const makeLoginForm: (config: FullConfig) => { LoginForm: FC; LoginView: FC } = ({
  paths: { forgotPassword, register },
  userIdentifier,
  disableUserRegistration,
}) => {
  const LoginForm = () => {
    const classes = useStyles();
    const { loading, login, justLoggedOut } = useContext(AuthFunctionContext);
    const [ident, setIdent] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({});

    return (
      <div className={classes.root}>
        <Paper
          className={classes.form}
        >
          <Typography
            className={classes.title}
            variant="h3"
          >
            {strings.LoginForm.Login}
          </Typography>

          {
          justLoggedOut !== LogoutReason.NONE && (
            <Typography
              variant="body2"
              className={classes.loggedOutText}
            >
              {justLoggedOut === LogoutReason.USER
                ? strings.LoginForm.LogoutSuccess
                : strings.LoginForm.AuthLogoutNotification}
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

            <PasswordField
              className={classes.inputField}
              password={password}
              onChange={setPassword}
              errorMessage={errorMessage}
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
                disabled={loading}
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
        {
          !disableUserRegistration && (
          <Link
            classes={{
              root: classes.linkUnderPaper,
            }}
            id="login_register"
            variant="body1"
            color="textPrimary"
            component={RouterLink}
            to={register}
          >
            {strings.LoginForm.SignUp}
          </Link>
          )
        }
      </div>
    );
  };

  const LoginView = () => (
    <AuthView>
      <LoginForm />
    </AuthView>
  );

  return { LoginForm, LoginView };
};
