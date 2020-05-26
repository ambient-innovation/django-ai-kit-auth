import Grid from '@material-ui/core/Grid';
import React, { FC } from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ErrorCard, ErrorCardProps } from './ErrorCard';
import { DefaultBackgroundImage } from '../assets/DefaultBackgroundImage';

const useStyles = makeStyles((theme: Theme) => createStyles({
  loginView: {
    [theme.breakpoints.up('lg')]: {
      height: '100vh',
    },
  },
  loginFormContainer: {
    justifyContent: 'center',
    [theme.breakpoints.up('lg')]: {
      alignItems: 'center',
    },
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-start',
      paddingLeft: 30,
      paddingRight: 30,
      marginTop: '-25vh',
    },
    [theme.breakpoints.down('xs')]: {
      height: '-20vh',
      paddingLeft: 17,
      paddingRight: 17,
    },
  },
  loginSideBanner: {
    [theme.breakpoints.down('md')]: {
      height: '37.5vh',
    },
    [theme.breakpoints.down('xs')]: {
      height: '45vh',
    },
  },
}));

export interface AuthViewProps {
  backgroundImage: () => JSX.Element;
}

export const AuthView: FC<AuthViewProps> = ({ children, backgroundImage }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.loginView}>
      <Grid item xs={12} lg={4} className={classes.loginSideBanner}>
        {backgroundImage()}
      </Grid>

      <Grid item lg={2} />

      <Grid container item xs={12} lg={4} className={classes.loginFormContainer}>
        {
          children
        }
      </Grid>
    </Grid>
  );
};

export interface ErrorViewProps extends ErrorCardProps, AuthViewProps {
}

export const ErrorView: FC<ErrorViewProps> = (
  errorViewProps,
) => (
  <AuthView backgroundImage={errorViewProps.backgroundImage}>
    <ErrorCard {...errorViewProps} />
  </AuthView>
);
