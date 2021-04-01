import React, { FC } from 'react';
import axios from 'axios';
import {
  Button, Grid, Typography,
} from '@material-ui/core';
import { useUserStore } from './ConfiguredAuth';

axios.defaults.withCredentials = true;

interface DashboardProps {
  title?: string;
}

export const Dashboard: FC<DashboardProps> = ({ title }) => {
  const {
    apiUrl, csrf, logout, user,
  } = useUserStore();

  const unAuthorizedFetch = () => {
    fetch(`${apiUrl}unauthorized`)
      .then((response) => (response.json()))
      .catch(logout);
  };

  const postTest = () => axios.post(`${apiUrl}test/`, {}, {
    headers: { 'X-CSRFToken': csrf },
  });

  return (
    <Grid container alignItems="center" justify="center" spacing={2}>
      <Grid item xs={12}>
        <Typography
          align="center"
          variant="h1"
        >
          {title || 'Dashboard AI-KIT: Auth Demo'}
        </Typography>

        <Typography
          align="center"
          variant="body1"
        >
          { /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */ }
          {`User: ${user!.username}`}
        </Typography>

        <Typography
          align="center"
          variant="body1"
        >
          { /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */ }
          {`Email: ${user!.email}`}
        </Typography>

      </Grid>

      <Grid container item xs={12} spacing={2} justify="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            onClick={() => postTest().then(({ data }) => console.log(data))}
          >
            POST TEST
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => unAuthorizedFetch()}
          >
            Trigger 401
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
