import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  createStyles, Grid, Paper, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import { strings } from '../internationalization';

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
  CheckIcon: {
    verticalAlign: 'sub',
    marginLeft: 8,
  },
  SuccessTitle: {
    marginBottom: 47,
  },
  SuccessText: {
    marginBottom: 30,
  },
}));

export const ActivationCard: FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleRedirect = () => {
    history.push(
      '/auth/login',
      { from: '/' },
    );
  };

  return (
    <Paper className={classes.PaperCard}>
      <Typography variant="h4" className={classes.SuccessTitle}>
        <span>{strings.EmailActivation.SuccessTitle}</span>
        <CheckIcon color="primary" fontSize="inherit" className={classes.CheckIcon} />
      </Typography>
      <Typography variant="body1" className={classes.SuccessText}>
        {strings.EmailActivation.SuccessText}
      </Typography>
      <Grid item container justify="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRedirect()}
        >
          {strings.EmailActivation.ButtonText}
        </Button>
      </Grid>
    </Paper>
  );
};
