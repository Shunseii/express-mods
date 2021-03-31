import { AppProps } from "next/app";
import Navbar from "../src/components/Navbar";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
        <Navbar />
        <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
