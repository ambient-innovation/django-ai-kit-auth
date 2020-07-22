import React, { FC } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Button,
  createStyles, Grid, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { FullConfig } from '../Configuration';
import { AuthView } from './AuthView';
import { MailSvg } from '../assets/MailSvg';
import { TranslatorProps } from '../internationalization';
import { useFormStyles } from './common/styles';

const useStyles = makeStyles(createStyles({
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
  EmailSentCard: FC<TranslatorProps>;
  EmailSentView: FC<TranslatorProps>;
} = ({
  components: { backgroundImage },
  paths: {
    mainPage,
    login,
    forgotPassword,
  },
  defaultTranslator,
}) => {
  const EmailSentCard: FC<TranslatorProps> = ({
    translator: t = defaultTranslator,
  }) => {
    const classes = useStyles();
    const formClasses = useFormStyles();
    const history = useHistory();

    const handleRedirect = () => {
      history.replace(
        login,
        { from: mainPage },
      );
    };

    return (
      <Paper className={formClasses.paper}>
        <Typography variant="h4" className={classes.SuccessTitle}>
          <span>{t('auth:EmailSent.EmailSent')}</span>
        </Typography>

        <Typography variant="body1" className={classes.SuccessText}>
          {t('auth:EmailSent.Description')}
        </Typography>

        <Grid item container justify="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRedirect()}
          >
            {t('auth:EmailSent.ContinueToLogin')}
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
            {t('auth:EmailSent.RequestAgain')}
          </Link>
        </Grid>
        <MailSvg className={classes.MailSvg} />
      </Paper>
    );
  };

  const EmailSentView: FC<TranslatorProps> = (props) => (
    <AuthView backgroundImage={backgroundImage}>
      <EmailSentCard {...props} />
    </AuthView>
  );

  return { EmailSentCard, EmailSentView };
};
