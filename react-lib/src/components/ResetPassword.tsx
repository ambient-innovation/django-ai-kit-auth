import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC, useContext, useState } from 'react';
import { AxiosError } from 'axios';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { AuthFunctionContext } from '../store/UserStore';
import { FullConfig } from '../Configuration';
import { AuthView } from './AuthView';
import { strings } from '../internationalization';
import { PasswordField } from './common/PasswordField';
import { ErrorMessage } from '../api/types';

enum SuccessState {
  INITIAL,
  LOADING,
  SUCCESS,
  INVALID_LINK,
}

const useStyles = makeStyles((theme: Theme) => createStyles({
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
    marginBottom: 47,
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
  successText: {
    marginBottom: 30,
  },
}));

export const makeResetPasswordForm: (config: FullConfig) => {
  ResetPasswordForm: FC; ResetPasswordView: FC;
} = ({
  components: { loadingIndicator, backgroundImage },
  paths: { login, forgotPassword },
}) => {
  const ResetPasswordForm = () => {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<ErrorMessage|undefined>();
    const [successState, setSuccessState] = useState<SuccessState>(SuccessState.INITIAL);
    const { validatePassword, resetPassword } = useContext(AuthFunctionContext);
    const { ident, token } = useParams();

    const [debouncedPasswordValidation] = useDebouncedCallback(
      (pw) => {
        validatePassword({ ident, password: pw })
          .then(() => {
            setPasswordErrors(undefined);
          }).catch((error: AxiosError) => {
            if (error.response) {
              setPasswordErrors(error.response.data);
            }
          });
      },
      300,
    );

    const setAndValidatePassword = (pw: string) => {
      setPassword(pw);
      if (ident) {
        debouncedPasswordValidation(pw);
      }
    };

    return (
      <Paper
        className={classes.form}
      >
        <Typography
          className={classes.title}
          variant="h3"
        >
          {strings.ResetPassword.ResetPassword}
        </Typography>
        {
          successState === SuccessState.INITIAL && (
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (ident && token) {
                  setSuccessState(SuccessState.LOADING);
                  resetPassword(ident, token, password).then(() => {
                    setSuccessState(SuccessState.SUCCESS);
                  }).catch((error: AxiosError) => {
                    if (error.response?.data.password) {
                      setSuccessState(SuccessState.INITIAL);
                      setPasswordErrors(error.response.data);
                    } else if (error.response?.data.error) {
                      setSuccessState(SuccessState.INVALID_LINK);
                    }
                  });
                }
              }}
            >
              <PasswordField
                className={classes.inputField}
                password={password}
                errorMessage={passwordErrors || {}}
                label={strings.ResetPassword.NewPassword}
                id="reset_password"
                onChange={setAndValidatePassword}
              />

              <PasswordField
                className={classes.inputField}
                password={password2}
                onChange={setPassword2}
                errorMessage={password !== password2 && password2.length > 0 ? {
                  password: ['passwords_not_identical'],
                } : {}}
                label={strings.ResetPassword.RepeatNewPassword}
                id="reset_password2"
              />

              <Grid container item xs={12} justify="center">
                <Button
                  id="reset_submit"
                  type="submit"
                  title={strings.ResetPassword.ButtonText}
                  variant="contained"
                  color="primary"
                  disabled={password !== password2 || passwordErrors !== undefined}
                >
                  {strings.ResetPassword.ButtonText}
                </Button>
              </Grid>
            </form>
          )
        }
        {
          successState === SuccessState.SUCCESS && (
            <SuccessView />
          )
        }
        {
          successState === SuccessState.INVALID_LINK && (
            <InvalidLinkView />
          )
        }
        {
          successState === SuccessState.LOADING && (
            <Grid container item xs={12} justify="center">
              {loadingIndicator()}
            </Grid>
          )
        }
      </Paper>
    );
  };

  const SuccessView: FC = () => {
    const classes = useStyles();

    return (
      <>
        <Typography
          className={classes.successText}
          variant="body1"
        >
          {strings.ResetPassword.SuccessText}
        </Typography>

        <Grid container item xs={12} justify="center">
          <Button
            type="button"
            title={strings.ResetPassword.SuccessButtonText}
            variant="contained"
            color="primary"
            href={login}
          >
            {strings.ResetPassword.SuccessButtonText}
          </Button>
        </Grid>
      </>
    );
  };

  const InvalidLinkView: FC = () => {
    const classes = useStyles();

    return (
      <>
        <Typography
          className={classes.successText}
          variant="body1"
        >
          {strings.ResetPassword.InvalidLink}
        </Typography>

        <Grid container item xs={12} justify="center">
          <Button
            type="button"
            title={strings.ResetPassword.InvalidLinkButtonText}
            variant="contained"
            color="primary"
            href={forgotPassword}
          >
            {strings.ResetPassword.InvalidLinkButtonText}
          </Button>
        </Grid>
      </>
    );
  };

  const ResetPasswordView = () => (
    <AuthView backgroundImage={backgroundImage}>
      <ResetPasswordForm />
    </AuthView>
  );

  return { ResetPasswordForm, ResetPasswordView };
};
