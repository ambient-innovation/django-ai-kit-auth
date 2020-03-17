import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC, useContext, useState } from 'react';

import { AxiosError } from 'axios';
import Button from '@material-ui/core/Button';
import { AuthFunctionContext } from '../store/UserStore';
import { AuthView } from './AuthView';
import { strings } from '../internationalization';
import { ErrorMessage, ObjectOfStrings } from '../api/types';
import { FullConfig } from '../Configuration';

const fieldErrors: ObjectOfStrings = strings.RegisterForm.FieldErrors;
const nonFieldErrors: ObjectOfStrings = strings.RegisterForm.NonFieldErrors;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
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
}));

export const makeRegisterForm: (config: FullConfig) => {
  RegisterForm: FC; RegisterView: FC;
} = () => {
  const RegisterForm: FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ErrorMessage>({});

    const { register } = useContext(AuthFunctionContext);

    const classes = useStyles();

    return (
      <Paper className={classes.root}>
        <Typography
          className={classes.title}
          variant="h3"
        >
          {strings.RegisterForm.Title}
        </Typography>

        <Typography
          className={classes.inputField}
        >
          {strings.RegisterForm.Description}
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            register(username, email, password)
              .catch((error: AxiosError) => {
                if (error.response) {
                  setErrors(error.response.data);
                }
              });
          }}
        >
          <TextField
            className={classes.inputField}
            autoFocus
            fullWidth
            id="register_username"
            label={strings.RegisterForm.Username}
            variant="outlined"
            type="text"
            value={username}
            helperText={errors.username ? errors.username.map((message: string) => (
              fieldErrors[message])) : ''}
            error={!!errors.username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <TextField
            className={classes.inputField}
            fullWidth
            id="register_email"
            label={strings.RegisterForm.Email}
            variant="outlined"
            type="email"
            value={email}
            helperText={errors.email ? errors.email.map((message: string) => (
              fieldErrors[message])) : ''}
            error={!!errors.email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <TextField
            {...{}/* TODO: replace this with PasswordField after #3 is merged */}
            className={classes.inputField}
            fullWidth
            id="register_password"
            label={strings.RegisterForm.Password}
            variant="outlined"
            type="password"
            value={password}
            helperText={errors.password ? errors.password.map((message: string) => (
              fieldErrors[message])) : ''}
            error={!!errors.password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />

          {
            errors.non_field_errors && (
              errors.non_field_errors.map((message) => (
                <Typography className={classes.formHelperText} key={message}>
                  {
                    nonFieldErrors[message]
                  }
                </Typography>
              ))
            )
          }

          <Grid container item xs={12} justify="center">
            <Button
              id="register_submit"
              type="submit"
              title={strings.RegisterForm.Register}
              variant="contained"
              color="primary"
            >
              {strings.RegisterForm.Register}
            </Button>
          </Grid>
        </form>
      </Paper>
    );
  };

  const RegisterView: FC = () => (
    <AuthView>
      <RegisterForm />
    </AuthView>
  );

  return { RegisterForm, RegisterView };
};
