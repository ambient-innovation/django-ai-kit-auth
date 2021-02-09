import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC, useContext, useState } from 'react';
import { AxiosError } from 'axios';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useDebouncedCallback } from 'use-debounce';
import { AuthFunctionContext } from '..';
import { FullConfig } from '../config/components';
import { AuthView } from './AuthView';
import { PasswordField } from './common/PasswordField';
import { ErrorMessage } from '../api/types';
import { TranslatorProps } from '../internationalization';
import { useFormStyles } from './common/styles';

enum SuccessState {
  INITIAL,
  LOADING,
  SUCCESS,
  INVALID_LINK,
}

const useStyles = makeStyles(createStyles({
  successText: {
    marginBottom: 30,
  },
}));

export const makeResetPasswordForm = ({
  components: { loadingIndicator: LoadingIndicator, backgroundImage },
  paths: { login, forgotPassword },
  defaultTranslator,
  routing: { useQueryParams },
}: FullConfig): {
  ResetPasswordForm: FC<TranslatorProps>;
  ResetPasswordView: FC<TranslatorProps>;
} => {
  const ResetPasswordForm: FC<TranslatorProps> = ({
    translator: t = defaultTranslator,
  }) => {
    const formClasses = useFormStyles();
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<ErrorMessage|undefined>();
    const [successState, setSuccessState] = useState<SuccessState>(SuccessState.INITIAL);
    const { validatePassword, resetPassword } = useContext(AuthFunctionContext);
    const { ident, token } = useQueryParams();

    const [debouncedPasswordValidation] = useDebouncedCallback(
      (pw: string) => {
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
        className={formClasses.paper}
      >
        <Typography
          className={formClasses.title}
          variant="h3"
        >
          {t('auth:ResetPassword.ResetPassword')}
        </Typography>
        {
          successState === SuccessState.INITIAL && (
            <form
              onSubmit={(e) => {
                e.preventDefault();

                console.log('submitting', ident, token, password);
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
                className={formClasses.inputField}
                password={password}
                errorMessage={passwordErrors || {}}
                label={t('auth:ResetPassword.NewPassword')}
                id="reset_password"
                onChange={setAndValidatePassword}
                translator={t}
              />

              <PasswordField
                className={formClasses.inputField}
                password={password2}
                onChange={setPassword2}
                errorMessage={password !== password2 && password2.length > 0 ? {
                  password: ['passwords_not_identical'],
                } : {}}
                label={t('auth:ResetPassword.RepeatNewPassword')}
                id="reset_password2"
                translator={t}
              />

              <Grid container item xs={12} justify="center">
                <Button
                  id="reset_submit"
                  type="submit"
                  title={t('auth:ResetPassword.ButtonText')}
                  variant="contained"
                  color="primary"
                  disabled={password !== password2 || passwordErrors !== undefined}
                >
                  {t('auth:ResetPassword.ButtonText')}
                </Button>
              </Grid>
            </form>
          )
        }
        {
          successState === SuccessState.SUCCESS && (
            <SuccessView translator={t} />
          )
        }
        {
          successState === SuccessState.INVALID_LINK && (
            <InvalidLinkView translator={t} />
          )
        }
        {
          successState === SuccessState.LOADING && (
            <Grid container item xs={12} justify="center">
              <LoadingIndicator />
            </Grid>
          )
        }
      </Paper>
    );
  };

  const SuccessView: FC<TranslatorProps> = ({
    translator: t = defaultTranslator,
  }) => {
    const classes = useStyles();

    return (
      <>
        <Typography
          className={classes.successText}
          variant="body1"
        >
          {t('auth:ResetPassword.SuccessText')}
        </Typography>

        <Grid container item xs={12} justify="center">
          <Button
            type="button"
            title={t('auth:ResetPassword.SuccessButtonText')}
            variant="contained"
            color="primary"
            href={login}
          >
            {t('auth:ResetPassword.SuccessButtonText')}
          </Button>
        </Grid>
      </>
    );
  };

  const InvalidLinkView: FC<TranslatorProps> = ({
    translator: t = defaultTranslator,
  }) => {
    const classes = useStyles();

    return (
      <>
        <Typography
          className={classes.successText}
          variant="body1"
        >
          {t('auth:ResetPassword.InvalidLink')}
        </Typography>

        <Grid container item xs={12} justify="center">
          <Button
            type="button"
            title={t('auth:ResetPassword.InvalidLinkButtonText')}
            variant="contained"
            color="primary"
            href={forgotPassword}
          >
            {t('auth:ResetPassword.InvalidLinkButtonText')}
          </Button>
        </Grid>
      </>
    );
  };

  const ResetPasswordView: FC<TranslatorProps> = (props) => (
    <AuthView backgroundImage={backgroundImage}>
      <ResetPasswordForm {...props} />
    </AuthView>
  );

  return { ResetPasswordForm, ResetPasswordView };
};
