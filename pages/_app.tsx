import { QueryInput, Cache, cacheExchange } from "@urql/exchange-graphcache";
import { AppProps } from "next/app";
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";

import Navbar from "../src/components/Navbar";
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../src/generated/graphql";

import "../styles/globals.css";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  fn: (res: Result, query: Query) => Query
) {
  return cache.updateQuery(
    queryInput,
    (data) => fn(result, data as any) as any
  );
}

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: { credentials: "include" },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (!result.login) {
                  return query;
                } else {
                  const { id, email, username } = result.login;

                  return {
                    me: { id, email, username },
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (!result.register) {
                  return query;
                } else {
                  const { id, email, username } = result.register;

                  return {
                    me: { id, email, username },
                  };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Provider value={client}>
        <Navbar />
        <Component {...pageProps} />
      </Provider>
    </div>
  );
}

export default MyApp;
