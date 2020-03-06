import React, { FC, useContext } from 'react';
import { Button } from '@material-ui/core';
import { UserContext } from 'ai-kit-auth';

export const Dashboard: FC = () => {
  const { logout } = useContext(UserContext);

  return (
    <div>
      Django Test App
      <Button
        variant="contained"
        onClick={() => logout()}
      >
        Logout
      </Button>
    </div>
  );
};
