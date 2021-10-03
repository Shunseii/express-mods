import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import React from "react";

import Container from "../../components/Container";
import Link from "../../components/Link";
import Navbar from "../../components/Navbar";
import { useGamesQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const GamesPage: NextPage = () => {
  const [{ data, fetching }] = useGamesQuery();

  if (fetching) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Games | Express Mods</title>
        <link rel="icon" href="/files-circle.svg" />
      </Head>

      <Navbar />
      <Container>
        <h1 className="text-2xl font-medium">All games:</h1>
        {data.games.map((game) => (
          <Link key={game.id} href={`/games/${game.gameSlug}/mods`}>
            {game.name}
          </Link>
        ))}
      </Container>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(GamesPage);
