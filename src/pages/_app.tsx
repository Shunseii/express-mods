import React from "react";
import { AppProps } from "next/app";

import GlobalStyles from "../../styles/GlobalStyles";
import "../../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <GlobalStyles />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
