import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC, useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useDebouncedCallback } from 'use-debounce';

import { AuthFunctionContext } from '../store/UserStore';
import { AuthView } from './AuthView';
import { ErrorMessage } from '../api/types';
import { FullConfig, Identifier } from '../Configuration';
import { PasswordField } from './common/PasswordField';
import { TranslatorProps } from '../internationalization';
import { useFormStyles } from './common/styles';

const useStyles = makeStyles(createStyles({
  linkUnderPaper: {
    marginTop: 20,
  },
}));

export const makeRegisterForm: (config: FullConfig) => {
  RegisterForm: FC<TranslatorProps>;
  RegisterView: FC<TranslatorProps>;
} = ({
  components: { backgroundImage },
  paths: { login },
  defaultTranslator,
  userIdentifier,
}) => {
  const RegisterForm: FC<TranslatorProps> = ({
    translator: t = defaultTranslator,
  }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ErrorMessage>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { validatePassword, register } = useContext(AuthFunctionContext);

    const fieldErrorMap = (error: string) => t(`auth:Common.FieldErrors.${error}`);
    const nonFieldErrorMap = (error: string) => {
      const key = `auth:RegisterForm.NonFieldErrors.${error}`;
      const message = t(key);
      if (message === undefined || message === key) {
        return t('auth:RegisterForm.NonFieldErrors.general');
      }

      return message;
    };

    const classes = useStyles();
    const formClasses = useFormStyles();

    const [debouncedPasswordValidation] = useDebouncedCallback(
      (pw: string) => {
        validatePassword({ username, email, password: pw })
          .then(() => {
            setErrors((current: ErrorMessage) => ({
              ...current,
              password: [],
            }));
          }).catch((error: AxiosError) => {
            if (error.response) {
              setErrors((current: ErrorMessage) => ({
                ...current,
                password: error.response?.data.password || [],
              }));
            }
          });
      },
      300,
    );

    const setAndValidatePassword = (pw: string) => {
      setPassword(pw);
      debouncedPasswordValidation(pw);
    };

    return (
      <div className={formClasses.root}>
        <Paper className={formClasses.paper}>
          <Typography
            className={formClasses.title}
            variant="h3"
          >
            {success ? t('auth:RegisterForm.SuccessTitle')
              : t('auth:RegisterForm.Title')}
          </Typography>

          <Typography
            className={formClasses.inputField}
          >
            {success ? t('auth:RegisterForm.SuccessText')
              : t('auth:RegisterForm.Description')}
          </Typography>

          { !success && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              register(username, email, password)
                .then(() => setSuccess(true))
                .catch((error: AxiosError) => {
                  if (error.response) {
                    setErrors(error.response.data);
                  } else {
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    setErrors({ nonFieldErrors: ['general'] });
                  }
                })
                .finally(() => setLoading(false));
            }}
          >
            {userIdentifier !== Identifier.Email && (
              <TextField
                className={formClasses.inputField}
                autoFocus
                fullWidth
                id="register_username"
                data-testid="register_username"
                label={t('auth:RegisterForm.Username')}
                variant="outlined"
                type="text"
                value={username}
                helperText={errors.username
                  ? errors.username.map(fieldErrorMap).join(' - ')
                  : t('auth:RegisterForm.UsernameHelperText')}
                error={!!errors.username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  // always reset errors after typing
                  setErrors((prev) => ({ ...prev, username: undefined }));
                }}
              />
            )}
            <TextField
              className={formClasses.inputField}
              fullWidth
              id="register_email"
              label={t('auth:RegisterForm.Email')}
              variant="outlined"
              type="email"
              value={email}
              helperText={errors.email ? errors.email.map(fieldErrorMap).join(' - ') : ''}
              error={!!errors.email}
              onChange={(event) => {
                setEmail(event.target.value);
                // always reset errors after typing
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            <PasswordField
              className={formClasses.inputField}
              id="register_password"
              password={password}
              label={t('auth:RegisterForm.Password')}
              errorMessage={errors}
              onChange={setAndValidatePassword}
              translator={t}
              helperText={t('auth:RegisterForm.PasswordHelperText')}
            />
            {
              errors.nonFieldErrors && (
                errors.nonFieldErrors.map((message) => (
                  <Typography className={formClasses.formHelperText} key={message}>
                    {nonFieldErrorMap(message)}
                  </Typography>
                ))
              )
            }

            <Grid container item xs={12} justify="center">
              <Button
                id="register_submit"
                type="submit"
                title={t('auth:RegisterForm.Register')}
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {t('auth:RegisterForm.Register')}
                {loading && <CircularProgress size={15} />}
              </Button>
            </Grid>
          </form>
          )}
        </Paper>
        <Link
          classes={{
            root: classes.linkUnderPaper,
          }}
          id="register_back_to_login"
          variant="body1"
          color="textPrimary"
          component={RouterLink}
          to={login}
        >
          {t('auth:RegisterForm.BackToLogin')}
        </Link>
      </div>
    );
  };

  const RegisterView: FC<TranslatorProps> = (props) => (
    <AuthView backgroundImage={backgroundImage}>
      <RegisterForm {...props} />
    </AuthView>
  );

  return { RegisterForm, RegisterView };
};
