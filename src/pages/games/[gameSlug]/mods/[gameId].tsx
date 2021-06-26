import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { useRouter } from "next/router";

import Container from "../../../../components/Container";
import Navbar from "../../../../components/Navbar";
import { useModQuery } from "../../../../generated/graphql";
import { createUrqlClient } from "../../../../utils/createUrqlClient";

interface ModPageProps {}

const ModPage: NextPage<ModPageProps> = ({}) => {
  const router = useRouter();
  const modId = parseInt(router.query.gameId as string);
  const [{ data, fetching }] = useModQuery({ variables: { modId } });

  if (!fetching && !data) {
    return <div>Error loading data from query</div>;
  }

  if (fetching) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>{data.mod.title} | Express Mods</title>
        <link rel="icon" href="/files-circle.svg" />
      </Head>

      <Navbar />
      <Container>
        <div>{data.mod.title}</div>
      </Container>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(ModPage);
