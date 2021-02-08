import React, { FC } from 'react';
import {
  Button,
  createStyles, Grid, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import { AuthView } from './AuthView';
import { TranslatorProps } from '../internationalization';
import { useFormStyles } from './common/styles';
import { FullConfig } from '../config/Components';

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
}));

export const makeActivationCard: (config: FullConfig) => {
  ActivationCard: FC<TranslatorProps>;
  ActivationView: FC<TranslatorProps>;
} = ({
  components: { backgroundImage },
  paths: {
    login,
    mainPage,
  },
  defaultTranslator,
  routing: { useRouteHandler },
}) => {
  const ActivationCard: FC<TranslatorProps> = ({
    translator: t = defaultTranslator,
  }) => {
    const classes = useStyles();
    const formClasses = useFormStyles();
    const routeHandler = useRouteHandler();

    const handleRedirect = () => {
      routeHandler.replace({
        path: login,
        query: {
          next: mainPage,
        },
      });
    };

    return (
      <Paper className={formClasses.paper}>
        <Typography variant="h4" className={classes.SuccessTitle}>
          <span>{t('auth:EmailActivation.SuccessTitle')}</span>
          <CheckIcon color="primary" fontSize="inherit" className={classes.CheckIcon} />
        </Typography>
        <Typography variant="body1" className={classes.SuccessText}>
          {t('auth:EmailActivation.SuccessText')}
        </Typography>
        <Grid item container justify="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRedirect()}
          >
            {t('auth:EmailActivation.ButtonText')}
          </Button>
        </Grid>
      </Paper>
    );
  };

  const ActivationView: FC<TranslatorProps> = (props) => (
    <AuthView backgroundImage={backgroundImage}>
      <ActivationCard {...props} />
    </AuthView>
  );

  return { ActivationCard, ActivationView };
};
