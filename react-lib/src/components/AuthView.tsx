import Grid from '@material-ui/core/Grid';
import React, { ComponentType, FC } from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ErrorCard, ErrorCardProps } from './ErrorCard';

const useStyles = makeStyles((theme: Theme) => createStyles({
  authView: {
    [theme.breakpoints.up('lg')]: {
      height: '100vh',
    },
  },
  formContainer: {
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
  sideBanner: {
    [theme.breakpoints.down('md')]: {
      height: '37.5vh',
    },
    [theme.breakpoints.down('xs')]: {
      height: '45vh',
    },
  },
}));

export interface AuthViewProps {
  backgroundImage: ComponentType;
}

export const AuthView: FC<AuthViewProps> = ({
  children, backgroundImage: BackgroundImage,
}) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.authView}>
      <Grid item xs={12} lg={4} className={classes.sideBanner}>
        <BackgroundImage />
      </Grid>

      <Grid item lg={2} />

      <Grid container item xs={12} lg={4} className={classes.formContainer}>
        {children}
      </Grid>
    </Grid>
  );
};

export interface ErrorViewProps extends ErrorCardProps, AuthViewProps {
}

export const ErrorView: FC<ErrorViewProps> = (
  errorViewProps,
) => (
  // eslint-disable-next-line react/destructuring-assignment
  <AuthView backgroundImage={errorViewProps.backgroundImage}>
    <ErrorCard {...errorViewProps} />
  </AuthView>
);
