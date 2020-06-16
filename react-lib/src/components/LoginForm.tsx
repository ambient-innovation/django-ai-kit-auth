import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, {
  FC, useContext, useState,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AxiosError } from 'axios';
import { AuthFunctionContext } from '../store/UserStore';
import { LogoutReason } from '../store/types';
import { ErrorMessage } from '../api/types';
import { FullConfig, Identifier } from '../Configuration';
import { AuthView } from './AuthView';
import { PasswordField } from './common/PasswordField';

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

export const makeLoginForm: (config: FullConfig) => {
  LoginForm: FC;
  LoginView: FC;
} = ({
  components: { backgroundImage },
  paths: { forgotPassword, register },
  translator: t,
  userIdentifier,
  disableUserRegistration,
}) => {
  const LoginForm: FC = () => {
    const classes = useStyles();
    const { loading, login, justLoggedOut } = useContext(AuthFunctionContext);
    const [ident, setIdent] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({});

    const fieldErrorMap = (error: string) => t(`auth:Common.FieldErrors.${error}`);
    const nonFieldErrorMap = (error: string) => t(
      `auth:Common.NonFieldErrors.${error}.${Identifier[userIdentifier]}`,
    );

    return (
      <div className={classes.root}>
        <Paper
          className={classes.form}
        >
          <Typography
            className={classes.title}
            variant="h3"
          >
            {t('auth:LoginForm.Login')}
          </Typography>

          {
          justLoggedOut !== LogoutReason.NONE && (
            <Typography
              variant="body2"
              className={classes.loggedOutText}
            >
              {justLoggedOut === LogoutReason.USER
                ? t('auth:LoginForm.LogoutSuccess')
                : t('auth:LoginForm.AuthLogoutNotification')}
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
              label={t(`auth:LoginForm.${Identifier[userIdentifier]}`)}
              variant="outlined"
              type={userIdentifier === Identifier.Email ? 'email' : 'text'}
              value={ident}
              helperText={errorMessage.ident ? errorMessage.ident.map(fieldErrorMap).join(' - ') : ''}
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
              translator={t}
            />

            {
           errorMessage.non_field_errors && (
             errorMessage.non_field_errors.map((message) => (
               <Typography className={classes.formHelperText} key={message}>
                 {nonFieldErrorMap(message)}
               </Typography>
             ))
           )
         }

            <Grid container item xs={12} justify="center">
              <Button
                id="login_submit"
                type="submit"
                title={t('auth:LoginForm.Login')}
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {t('auth:LoginForm.Login')}
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
                {t('auth:LoginForm.ForgotPassword')}
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
            {t('auth:LoginForm.SignUp')}
          </Link>
          )
        }
      </div>
    );
  };

  const LoginView: FC = (props) => (
    <AuthView backgroundImage={backgroundImage}>
      <LoginForm {...props} />
    </AuthView>
  );

  return { LoginForm, LoginView };
};
