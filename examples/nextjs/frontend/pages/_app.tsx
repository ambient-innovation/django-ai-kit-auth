import '../styles/globals.css'
import {AppProps} from "next/app";
import { UserStore } from '../src/configureAuth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserStore apiUrl='http://localhost:8000/api/v1/' apiAuthPath='auth/'>
      <Component {...pageProps} />
    </UserStore>
  );
};

export default MyApp
