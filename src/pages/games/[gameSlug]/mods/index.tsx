import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

import { createUrqlClient } from "../../../../utils/createUrqlClient";
import Navbar from "../../../../components/Navbar";
import {
  useGameQuery,
  useLikeModMutation,
  useModsQuery,
} from "../../../../generated/graphql";
import Container from "../../../../components/Container";
import { SecondaryActionButton } from "../../../../components/ActionButton";
import { PrimaryLinkButton } from "../../../../components/LinkButton";

interface ModsPageProps {}

const ModsPage: NextPage<ModsPageProps> = ({}) => {
  const router = useRouter();
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
    gameSlug: router.query.gameSlug as string,
  });
  const [{ data: gameData, fetching: fetchingGame }] = useGameQuery({
    variables: { gameSlug: variables.gameSlug },
  });
  const [{ data, fetching }] = useModsQuery({ variables });
  const [, likeMod] = useLikeModMutation();

  if (!fetching && !data) {
    return <div>Error loading data from query</div>;
  }

  if (fetchingGame) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>{gameData.game.name} | Express Mods</title>
        <link rel="icon" href="/files-circle.svg" />
      </Head>

      <Navbar />
      <Container>
        {!data && fetching ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="flex flex-row items-center mb-8">
              <h1 className="mx-auto text-2xl font-semibold">All mods:</h1>
              <PrimaryLinkButton
                label="Create a mod"
                href={`/games/${router.query.gameSlug}/mods/new`}
              />
            </div>
            {data?.mods?.mods &&
              data.mods.mods.map((mod) =>
                !mod ? null : (
                  <div
                    key={mod.id}
                    className="flex flex-row items-center justify-between p-2 mb-2 border border-coolGray-200"
                  >
                    <div>
                      <Link
                        href={`/games/${router.query.gameSlug}/mods/${mod.id}`}
                      >
                        {mod.title}
                      </Link>
                      <p>by: {mod.author.username}</p>
                    </div>
                    <div>
                      <span className="mr-2">Likes: {mod.likesCount}</span>
                      {!mod.isOwner && (
                        <SecondaryActionButton
                          onClick={async () => {
                            const response = await likeMod({ modId: mod.id });

                            if (response.error) {
                              alert("You have to be logged in to like mods.");
                            }
                          }}
                          label={mod.hasLiked ? "Unlike" : "Like"}
                        />
                      )}
                    </div>
                  </div>
                )
              )}
          </>
        )}
        {data?.mods?.hasMore && (
          <SecondaryActionButton
            className="mx-auto mt-2 mb-4"
            label="Load more"
            isLoading={fetching}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.mods.mods[data.mods.mods.length - 1].createdAt,
                gameSlug: variables.gameSlug,
              });
            }}
          />
        )}
      </Container>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(ModsPage);
