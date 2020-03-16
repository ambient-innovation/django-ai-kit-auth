import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC, useContext, useState } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { AuthFunctionContext } from '../store/UserStore';
import { FullConfig } from '../Configuration';
import { AuthView } from './AuthView';
import { strings } from '../internationalization';
import { PasswordField } from './common/PasswordField';

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
}));

export const makeResetPasswordForm: (config: FullConfig) => {
  ResetPasswordForm: FC; ResetPasswordView: FC;
} = ({
  components: { loadingIndicator },
  paths: { login },
}) => {
  const ResetPasswordForm = () => {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useContext(AuthFunctionContext);
    const history = useHistory();

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
          loading ? (
            <Grid container item xs={12} justify="center">
              {loadingIndicator()}
            </Grid>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);

                resetPassword('', '', password).then(() => {
                  history.push(login);
                }).catch(() => {

                }).finally(() => {
                  setLoading(false);
                });
              // history.push(emailSent);
              }}
            >
              <PasswordField
                className={classes.inputField}
                password={password}
                setPassword={setPassword}
                errorMessage={{}}
                label={strings.ResetPassword.NewPassword}
                id="reset_password"
              />

              <PasswordField
                className={classes.inputField}
                password={password2}
                setPassword={setPassword2}
                errorMessage={{}}
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
                  disabled={password !== password2 || password.length < 8}
                >
                  {strings.ResetPassword.ButtonText}
                </Button>
              </Grid>
            </form>
          )
        }
      </Paper>
    );
  };

  const ResetPasswordView = () => (
    <AuthView>
      <ResetPasswordForm />
    </AuthView>
  );

  return { ResetPasswordForm, ResetPasswordView };
};
