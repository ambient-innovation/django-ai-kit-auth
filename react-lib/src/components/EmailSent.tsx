import React, { FC } from 'react';
import {
  Button,
  createStyles, Grid, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AuthView } from './AuthView';
import { MailSvg } from '../assets/MailSvg';
import { TranslatorProps } from '../internationalization';
import { useFormStyles } from './common/styles';
import { FullConfig } from '..';

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

export interface MakeEmailSentCardResult {
  EmailSentCard: FC<TranslatorProps>;
  EmailSentView: FC<TranslatorProps>;
}

export function makeEmailSentCard({
  components: { backgroundImage },
  paths: {
    mainPage,
    login,
    forgotPassword,
  },
  defaultTranslator,
  routing: {
    link: Link,
    useRouteHandler,
  },
}: FullConfig): MakeEmailSentCardResult {
  const EmailSentCard: FC<TranslatorProps> = ({
    translator: t = defaultTranslator,
  }) => {
    const classes = useStyles();
    const formClasses = useFormStyles();
    const routeHandler = useRouteHandler();

    const handleRedirect = () => {
      routeHandler.replace({
        pathname: login,
        query: {
          from: mainPage,
        },
      });
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
            href={forgotPassword}
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
}
