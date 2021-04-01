import { PrivateProtection } from '../src/configureAuth';

export default function Home() {
  return (
    <PrivateProtection>
      Main
    </PrivateProtection>
  );
};
