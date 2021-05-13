import { withUrqlClient } from "next-urql";
import Head from "next/head";

import { createUrqlClient } from "../utils/createUrqlClient";
import Navbar from "../components/Navbar";
import Container from "../components/Container";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Express Mods</title>
        <link rel="icon" href="/files-circle.svg" />
      </Head>

      <Navbar />
      <Container>Hello</Container>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
