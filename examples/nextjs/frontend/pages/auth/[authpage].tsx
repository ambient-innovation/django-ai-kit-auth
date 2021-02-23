import React from "react";
import { AuthPage, getStaticAuthProps, getStaticAuthPaths } from '../../src/configureAuth';

export const getStaticProps = getStaticAuthProps;
export const getStaticPaths = getStaticAuthPaths;

export default AuthPage;
