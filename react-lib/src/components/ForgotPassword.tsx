import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC, useContext, useState } from 'react';
import { AuthFunctionContext } from '..';
import { AuthView } from './AuthView';
import { TranslatorProps } from '../internationalization';
import { useFormStyles } from './common/styles';
import { FullConfig } from '../config/components';

const useStyles = makeStyles(createStyles({
  inputField: {
    marginTop: 47,
    marginBottom: 30,
  },
}));

export const makeForgotPasswordForm = ({
  components: { backgroundImage },
  paths: { login, emailSent },
  defaultTranslator,
  routing: { useRouteHandler, link: Link },
}: FullConfig): {
  ForgotPasswordForm: FC<TranslatorProps>;
  ForgotPasswordView: FC<TranslatorProps>;
} => {
  const ForgotPasswordForm: FC<TranslatorProps> = ({
    translator: t = defaultTranslator,
  }) => {
    const classes = useStyles();
    const formClasses = useFormStyles();
    const [email, setEmail] = useState('');
    const { requestPasswordReset } = useContext(AuthFunctionContext);
    const routeHandler = useRouteHandler();

    return (
      <Paper className={formClasses.paper}>
        <Typography
          className={formClasses.title}
          variant="h3"
        >
          {t('auth:ForgotPassword.ForgotPassword')}
        </Typography>

        <Typography
          variant="body2"
        >
          {t('auth:ForgotPassword.Description')}
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestPasswordReset(email);
            routeHandler.push(emailSent);
          }}
        >
          <TextField
            className={classes.inputField}
            autoFocus
            fullWidth
            required
            id="forgot_email"
            label={t('auth:ForgotPassword.InputLabel')}
            variant="outlined"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />

          <Grid container item xs={12} justify="center">
            <Button
              id="forgot_submit"
              type="submit"
              title={t('auth:ForgotPassword.ButtonText')}
              variant="contained"
              color="primary"
            >
              {t('auth:ForgotPassword.ButtonText')}
            </Button>
          </Grid>

          <Grid style={{ marginTop: 24 }} container item xs={12} justify="center">
            <Link
              id="reset_to_login"
              variant="body1"
              color="textPrimary"
              href={login}
            >
              {t('auth:ForgotPassword.BackToLogin')}
            </Link>
          </Grid>
        </form>
      </Paper>
    );
  };

  const ForgotPasswordView: FC<TranslatorProps> = (props) => (
    <AuthView backgroundImage={backgroundImage}>
      <ForgotPasswordForm {...props} />
    </AuthView>
  );

  return { ForgotPasswordForm, ForgotPasswordView };
};
