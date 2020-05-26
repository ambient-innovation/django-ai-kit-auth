import React, { FC } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Button,
  createStyles, Grid, Paper, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { FullConfig } from '../Configuration';
import { strings } from '../internationalization';
import { AuthView } from './AuthView';
import { MailSvg } from '../assets/MailSvg';

const useStyles = makeStyles((theme: Theme) => createStyles({
  PaperCard: {
    paddingTop: 35,
    paddingLeft: 47,
    paddingRight: 30,
    paddingBottom: 36,
    boxShadow: '0 1px 36px 0 rgba(211, 211, 211, 0.5)',
    width: '100%',
    position: 'relative',
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
  },
  SuccessTitle: {
    marginBottom: 47,
    '& span': {
      marginRight: 8,
    },
  },
  SuccessText: {
    marginBottom: 30,
  },
  MailSvg: {
    position: 'absolute',
    top: 30,
    right: 40,
  },
}));

export const makeEmailSentCard: (config: FullConfig) => {
  EmailSentCard: FC; EmailSentView: FC;
} = ({
  paths: {
    mainPage,
    login,
    forgotPassword,
  },
  backgroundImage,
}) => {
  const EmailSentCard: FC = () => {
    const classes = useStyles();
    const history = useHistory();

    const handleRedirect = () => {
      history.replace(
        login,
        { from: mainPage },
      );
    };

    return (
      <Paper className={classes.PaperCard}>
        <Typography variant="h4" className={classes.SuccessTitle}>
          <span>{strings.EmailSent.EmailSent}</span>
        </Typography>

        <Typography variant="body1" className={classes.SuccessText}>
          {strings.EmailSent.Description}
        </Typography>

        <Grid item container justify="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRedirect()}
          >
            {strings.EmailSent.ContinueToLogin}
          </Button>
        </Grid>

        <Grid style={{ marginTop: 24 }} container item xs={12} justify="center">
          <Link
            id="reset_to_login"
            variant="body1"
            color="textPrimary"
            component={RouterLink}
            to={forgotPassword}
          >
            {strings.EmailSent.RequestAgain}
          </Link>
        </Grid>
        <MailSvg className={classes.MailSvg} />
      </Paper>
    );
  };

  const EmailSentView: FC = () => (
    <AuthView backgroundImage={backgroundImage}>
      <EmailSentCard />
    </AuthView>
  );

  return { EmailSentCard, EmailSentView };
};
