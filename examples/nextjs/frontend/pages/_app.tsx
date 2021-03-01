import '../styles/globals.css'
import {AppProps} from "next/app";
import { UserStore } from '../src/configureAuth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserStore>
      <Component {...pageProps} />
    </UserStore>
  );
};

export default MyApp
