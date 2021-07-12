import { useState } from "react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import ReactMarkdown from "react-markdown";

import {
  PrimaryActionButton,
  SecondaryActionButton,
} from "../../../../components/ActionButton";
import Container from "../../../../components/Container";
import Navbar from "../../../../components/Navbar";
import {
  UpdateModMutationVariables,
  useCreateCommentMutation,
  useDeleteModMutation,
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
  const gameSlug = router.query.gameSlug as string;
  const [, deleteMod] = useDeleteModMutation();
  const [, updateMod] = useUpdateModMutation();
  const [, createComment] = useCreateCommentMutation();
  const [{ data, fetching }] = useModQuery({ variables: { modId } });

  if (!fetching && !data) {
    return <div>Error loading data from query</div>;
  }

  if (fetching) {
    return <div>Loading...</div>;
  }

  if (!fetching && !data.mod) {
    return <div>That mod doesn't exist</div>;
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
          {data.mod.isOwner && (
            <>
              <SecondaryActionButton
                label="Delete mod"
                onClick={async () => {
                  if (confirm("Do you want to delete this mod?")) {
                    const response = await deleteMod({ id: data.mod.id });

                    if (response.data?.deleteMod) {
                      router.push(`/games/${gameSlug}/mods`);
                    } else {
                      alert("There was a problem deleting the mod.");
                    }
                  }
                }}
              />
              {isEditingTitle && (
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
            </>
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
                <ReactMarkdown>{data.mod.content}</ReactMarkdown>
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

          <hr className="my-8" />

          <div>
            <h3 className="text-2xl">Comments</h3>
            {data.mod.comments?.map((comment) => (
              <div key={comment.id}>
                <p>{comment.author.username}</p>
                <p>{comment.content}</p>
              </div>
            ))}
            <div className="mt-4">
              <h4>Write a comment</h4>
              <Formik
                initialValues={{
                  content: "",
                }}
                onSubmit={async (values, { setErrors }) => {
                  await sleep(500);

                  const response = await createComment({
                    modId: data.mod.id,
                    content: values.content,
                  });
                  const errors = mapAPIErrors(response.error?.graphQLErrors);

                  if (errors) {
                    setErrors(errors.validation);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="">
                    <LabeledFormField
                      className="mb-6"
                      name="content"
                      placeholder="Write something"
                      label="Content"
                      type="textarea"
                    />
                    <div>
                      <PrimaryActionButton
                        isLoading={isSubmitting}
                        className="mr-2 text-lg h-11"
                        type="submit"
                        label="Write a comment"
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(ModPage);
