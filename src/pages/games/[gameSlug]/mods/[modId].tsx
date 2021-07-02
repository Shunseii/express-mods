import { useState } from "react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";

import {
  PrimaryActionButton,
  SecondaryActionButton,
} from "../../../../components/ActionButton";
import Container from "../../../../components/Container";
import Navbar from "../../../../components/Navbar";
import {
  UpdateModMutationVariables,
  useModQuery,
  useUpdateModMutation,
} from "../../../../generated/graphql";
import LabeledFormField from "../../../../components/LabeledFormField";
import { createUrqlClient } from "../../../../utils/createUrqlClient";
import sleep from "../../../../utils/sleep";
import { mapAPIErrors } from "../../../../utils/mapAPIError";

interface ModPageProps {}

const ModPage: NextPage<ModPageProps> = ({}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);

  const router = useRouter();
  const modId = parseInt(router.query.modId as string);
  const [, updateMod] = useUpdateModMutation();
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
        <div>
          {data.mod.isOwner && isEditingTitle && (
            <Formik
              initialValues={{
                title: data.mod.title,
              }}
              onSubmit={async (values, { setErrors }) => {
                await sleep(500);

                const modVars: UpdateModMutationVariables = {
                  modId: data.mod.id,
                };

                if (values.title !== data.mod.title) {
                  modVars.title = values.title;
                }

                const response = await updateMod(modVars);
                const errors = mapAPIErrors(response.error?.graphQLErrors);

                if (errors) {
                  setErrors(errors.validation);
                } else {
                  setIsEditingTitle(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="">
                  <LabeledFormField
                    className="mb-6"
                    name="title"
                    label="Title"
                  />
                  <div>
                    <PrimaryActionButton
                      isLoading={isSubmitting}
                      className="mr-2 text-lg h-11"
                      type="submit"
                      label="Confirm"
                    />
                    <SecondaryActionButton
                      className="text-lg h-11"
                      label="Cancel"
                      onClick={() => {
                        setIsEditingTitle(false);
                      }}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {!isEditingTitle && (
            <>
              <h1 className="mb-4 text-3xl">{data.mod.title}</h1>
              {data.mod.isOwner && (
                <PrimaryActionButton
                  label="Edit title"
                  onClick={() => {
                    setIsEditingTitle(true);
                  }}
                />
              )}
            </>
          )}

          {!data.mod.isOwner && (
            <p>
              by <span>{data.mod.author.username}</span>
            </p>
          )}

          <hr className="my-8" />

          <div className="mt-12">
            {!isEditingContent && (
              <>
                <p>{data.mod.content}</p>
                {data.mod.isOwner && (
                  <PrimaryActionButton
                    className="mt-4"
                    label="Edit description"
                    onClick={() => {
                      setIsEditingContent(true);
                    }}
                  />
                )}
              </>
            )}

            {data.mod.isOwner && isEditingContent && (
              <Formik
                initialValues={{
                  content: data.mod.content,
                }}
                onSubmit={async (values, { setErrors }) => {
                  await sleep(500);

                  const modVars: UpdateModMutationVariables = {
                    modId: data.mod.id,
                  };

                  if (values.content !== data.mod.content) {
                    modVars.content = values.content;
                  }

                  const response = await updateMod(modVars);
                  const errors = mapAPIErrors(response.error?.graphQLErrors);

                  if (errors) {
                    setErrors(errors.validation);
                  } else {
                    setIsEditingContent(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="">
                    <LabeledFormField
                      className="mb-6"
                      name="content"
                      label="Content"
                      type="textarea"
                    />
                    <div>
                      <PrimaryActionButton
                        isLoading={isSubmitting}
                        className="mr-2 text-lg h-11"
                        type="submit"
                        label="Confirm"
                      />
                      <SecondaryActionButton
                        className="text-lg h-11"
                        label="Cancel"
                        onClick={() => {
                          setIsEditingContent(false);
                        }}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(ModPage);
