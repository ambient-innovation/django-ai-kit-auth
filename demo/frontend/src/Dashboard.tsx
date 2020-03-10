import React, { FC, useContext } from 'react';
import {
  Button, Grid, Typography,
} from '@material-ui/core';
import { UserContext } from 'ai-kit-auth';

export const Dashboard: FC = () => {
  const { logout, user } = useContext(UserContext);

  const unAuthorizedFetch = () => {
    // TODO: use apiUrl after !45 (https://gitlab.ambient-innovation.com/ai/ai.kit/authentication/merge_requests/45) is merged
    fetch('http://localhost:8000/api/v1/unauthorized')
      .then((response) => (response.json()))
      .catch(logout);
  };

  return (
    <Grid container alignItems="center" justify="center" spacing={2}>
      <Grid item xs={12}>
        <Typography
          align="center"
          variant="h1"
        >
          Django Test App
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
