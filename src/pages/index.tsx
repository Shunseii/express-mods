import { withUrqlClient } from "next-urql";
import Head from "next/head";

import { createUrqlClient } from "../utils/createUrqlClient";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Express Mods</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <main className="text-xl">Hello world!</main>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);