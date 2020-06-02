import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC, useContext, useState } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { StringsProps } from '../internationalization';
import { AuthFunctionContext } from '../store/UserStore';
import { FullConfig } from '../Configuration';
import { AuthView } from './AuthView';

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
    marginBottom: 35,
    [theme.breakpoints.down('xs')]: {
      fontSize: 30,
      letterSpacing: 0.18,
    },
  },
  inputField: {
    marginTop: 47,
    marginBottom: 30,
  },
  formHelperText: {
    marginBottom: 41,
    fontSize: '1rem',
    color: theme.palette.primary.main,
  },
}));

export const makeForgotPasswordForm: (config: FullConfig) => {
  ForgotPasswordForm: FC<StringsProps>;
  ForgotPasswordView: FC<StringsProps>;
} = ({
  components: { backgroundImage },
  paths: { login, emailSent },
}) => {
  const ForgotPasswordForm: FC<StringsProps> = ({ strings }) => {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const { requestPasswordReset } = useContext(AuthFunctionContext);
    const history = useHistory();

    return (
      <Paper
        className={classes.form}
      >
        <Typography
          className={classes.title}
          variant="h3"
        >
          {strings.ForgotPassword.ForgotPassword}
        </Typography>

        <Typography
          variant="body2"
        >
          {strings.ForgotPassword.Description}
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestPasswordReset(email);
            history.push(emailSent);
          }}
        >
          <TextField
            className={classes.inputField}
            autoFocus
            fullWidth
            required
            id="forgot_email"
            label={strings.ForgotPassword.InputLabel}
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
              title={strings.ForgotPassword.ButtonText}
              variant="contained"
              color="primary"
            >
              {strings.ForgotPassword.ButtonText}
            </Button>
          </Grid>

          <Grid style={{ marginTop: 24 }} container item xs={12} justify="center">
            <Link
              id="reset_to_login"
              variant="body1"
              color="textPrimary"
              component={RouterLink}
              to={login}
            >
              {strings.ForgotPassword.BackToLogin}
            </Link>
          </Grid>
        </form>
      </Paper>
    );
  };

  const ForgotPasswordView: FC<StringsProps> = (props) => (
    <AuthView backgroundImage={backgroundImage}>
      <ForgotPasswordForm {...props} />
    </AuthView>
  );

  return { ForgotPasswordForm, ForgotPasswordView };
};
