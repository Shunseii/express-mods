import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import { SSRExchange } from "next-urql";
import { dedupExchange, fetchExchange, gql, stringifyVariables } from "urql";

import {
  ChangePasswordMutation,
  DeleteModMutationVariables,
  LikeModMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import isServer from "./isServer";

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "mods"
    );

    info.partial = !isInCache;

    let results: string[] = [];
    let hasMore = true;

    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = {
        mods: cache.resolve(key, "mods") as string[],
        hasMore: cache.resolve(key, "hasMore") as boolean,
      };

      if (!data.hasMore) {
        hasMore = data.hasMore;
      }

      results.push(...data.mods);
    });

    return { __typename: "PaginatedMods", mods: results, hasMore };
  };
};

export const createUrqlClient = (ssrExchange: SSRExchange, ctx: any) => {
  const cookie = isServer() ? ctx?.req?.headers?.cookie : "";

  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedMods: () => null,
        },
        resolvers: {
          Query: {
            mods: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deleteMod(_result, args, cache, _info) {
              cache.invalidate({
                __typename: "Mod",
                id: (args as DeleteModMutationVariables).id,
              });
            },
            likeMod: (_result, args, cache, info) => {
              const { modId } = args as LikeModMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Mod {
                    id
                    likesCount
                    hasLiked
                  }
                `,
                { id: modId }
              );

              if (data) {
                const newHasLiked = !data.hasLiked;
                const newLikesCount = newHasLiked
                  ? ++data.likesCount
                  : --data.likesCount;

                cache.writeFragment(
                  gql`
                    fragment _ on Mod {
                      id
                      likesCount
                      hasLiked
                    }
                  `,
                  {
                    id: modId,
                    hasLiked: newHasLiked,
                    likesCount: newLikesCount,
                  }
                );
              }
            },
            createMod: (_result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "mods"
              );

              fieldInfos.forEach((fieldInfo) => {
                cache.invalidate("Query", "mods", fieldInfo.arguments || {});
              });
            },
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

              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "mods" || info.fieldName === "mod"
              );

              fieldInfos.forEach((fieldInfo) => {
                cache.invalidate(
                  "Query",
                  fieldInfo.fieldName,
                  fieldInfo.arguments || {}
                );
              });
            },
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );

              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "mods" || info.fieldName === "mod"
              );

              fieldInfos.forEach((fieldInfo) => {
                cache.invalidate(
                  "Query",
                  fieldInfo.fieldName,
                  fieldInfo.arguments || {}
                );
              });
            },
            changePassword: (_result, args, cache, info) => {
              betterUpdateQuery<ChangePasswordMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (!result.changePassword) {
                    return query;
                  } else {
                    const { id, email, username } = result.changePassword;

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

              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "mods" || info.fieldName === "mod"
              );

              fieldInfos.forEach((fieldInfo) => {
                cache.invalidate(
                  "Query",
                  fieldInfo.fieldName,
                  fieldInfo.arguments || {}
                );
              });
            },
          },
        },
      }),
      ssrExchange,
      fetchExchange,
    ],
  };
};
