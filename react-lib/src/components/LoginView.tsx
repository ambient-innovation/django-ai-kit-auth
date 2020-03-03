import Grid from '@material-ui/core/Grid';
import React, { FC } from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { LoginForm } from './LoginForm';

const useStyles = makeStyles((theme: Theme) => createStyles({
  loginView: {
    height: '100vh',
  },
}));

export const LoginView: FC = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.loginView}>
      <Grid item xs={4}>
        Image
      </Grid>
      <Grid item xs={6}>
        <LoginForm />
      </Grid>
    </Grid>
  );
};
