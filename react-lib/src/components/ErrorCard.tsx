import React, { FC } from 'react';
import {
  createStyles, Paper, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import {useFormStyles} from "./common/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
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
  const formClasses = useFormStyles();

  return (
    <Paper className={formClasses.paper}>
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
