import React, { FC } from 'react';
import {
  createStyles, Paper, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme: Theme) => createStyles({
  PaperCard: {
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
  ErrorOutlineIcon: {
    verticalAlign: 'sub',
    color: theme.palette.error.main,
  },
  Title: {
    marginBottom: 47,
    '& span': {
      marginRight: 8,
    },
  },
  Message: {
    marginBottom: 30,
  },
}));

export interface ErrorCardProps {
  title: string;
  message: string;
}

export const ErrorCard: FC<ErrorCardProps> = ({
  title,
  message,
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.PaperCard}>
      <Typography variant="h4" className={classes.Title}>
        <span>{title}</span>
        <ErrorOutlineIcon color="primary" fontSize="inherit" className={classes.ErrorOutlineIcon} />
      </Typography>
      <Typography variant="body1" className={classes.Message}>
        {message}
      </Typography>
    </Paper>
  );
};
