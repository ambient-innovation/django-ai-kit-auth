import '../styles/globals.css'
import {AppProps} from "next/app";
import { UserStore } from '../src/configureAuth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserStore apiAuthPath='localhost:8000/api/v1/' apiUrl='auth/'>
      <Component {...pageProps} />
    </UserStore>
  );
};

export default MyApp
