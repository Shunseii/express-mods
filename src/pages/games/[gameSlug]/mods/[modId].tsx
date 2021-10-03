import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import ReactMarkdown from "react-markdown";
import { withUrqlClient } from "next-urql";

import {
  PrimaryActionButton,
  SecondaryActionButton,
} from "components/ActionButton";
import Container from "components/Container";
import Navbar from "components/Navbar";
import {
  UpdateModMutationVariables,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useDeleteModMutation,
  useModQuery,
  useUpdateCommentMutation,
  useUpdateModMutation,
  useUploadImageMutation,
} from "generated/graphql";
import FormField from "components/FormField";
import sleep from "utils/sleep";
import { mapAPIErrors } from "utils/mapAPIError";
import { renderMostRecentRelativeTime } from "utils/time";
import { createUrqlClient } from "utils/createUrqlClient";
import { allValidImageMimetypes } from "utils/checkFileMimetypes";

const enum Tabs {
  Description = "Description",
  Images = "Images",
  Files = "Files",
}

const ModPage: NextPage = () => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [commentsInEdit, setCommentsInEdit] = useState([]);
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.Description);

  const router = useRouter();
  const modId = router.query.modId as string;
  const gameSlug = router.query.gameSlug as string;
  const [, deleteMod] = useDeleteModMutation();
  const [, updateMod] = useUpdateModMutation();
  const [, createComment] = useCreateCommentMutation();
  const [, updateComment] = useUpdateCommentMutation();
  const [, deleteComment] = useDeleteCommentMutation();
  const [, uploadImage] = useUploadImageMutation();
  const [{ data, fetching }] = useModQuery({ variables: { modId } });

  if (!fetching && !data) {
    return <div>Error loading data from query</div>;
  }

  if (fetching) {
    return <div>Loading...</div>;
  }

  if (!fetching && !data.mod) {
    return <div>That mod doesn&rsquo;t exist</div>;
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
                      <FormField className="mb-6" name="title" />
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

          <div>
            <div>
              <button
                className="inline mr-4"
                onClick={() => setActiveTab(Tabs.Description)}
              >
                <h3
                  className={`text-xl ${
                    activeTab === Tabs.Description &&
                    "font-medium border-b border-purple-500"
                  }`}
                >
                  {Tabs.Description}
                </h3>
              </button>
              <button
                className="inline mr-4"
                onClick={() => setActiveTab(Tabs.Images)}
              >
                <h3
                  className={`text-xl ${
                    activeTab === Tabs.Images &&
                    "font-medium border-b border-purple-500"
                  }`}
                >
                  {Tabs.Images}
                </h3>
              </button>
              <button
                className="inline"
                onClick={() => setActiveTab(Tabs.Files)}
              >
                <h3
                  className={`text-xl ${
                    activeTab === Tabs.Files &&
                    "font-medium border-b border-purple-500"
                  }`}
                >
                  {Tabs.Files}
                </h3>
              </button>
            </div>
            <div className="mt-6">
              {activeTab === Tabs.Description && (
                <div>
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
                        const errors = mapAPIErrors(
                          response.error?.graphQLErrors
                        );

                        if (errors) {
                          setErrors(errors.validation);
                        } else {
                          setIsEditingContent(false);
                        }
                      }}
                    >
                      {({ isSubmitting }) => (
                        <Form className="">
                          <FormField
                            className="mb-6"
                            name="content"
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
              )}
              {activeTab === Tabs.Images && (
                <div>
                  <h1>Upload files here :)</h1>
                  <input
                    type="file"
                    // multiple
                    accept="image/jpeg,image/png"
                    onChange={({ target: { files } }) => {
                      const hasValidFiles = allValidImageMimetypes(files);

                      if (hasValidFiles) {
                        Array.from(files).forEach((file) => {
                          uploadImage({ modId, imageFile: file });
                        });
                      } else {
                        alert("Invalid file type selected >:(");
                      }
                    }}
                  />
                  <br />
                  {data.mod.isOwner &&
                    data.mod.images.map((imageUrl) => (
                      <Image alt="mod image" key={data.mod.id} src={imageUrl} />
                    ))}
                </div>
              )}
            </div>
          </div>

          <hr className="my-8" />

          <div>
            <h3 className="text-2xl">Comments</h3>
            {data.mod.comments?.map((comment) => (
              <div className="mt-4" key={comment.id}>
                <div className="flex flex-row items-baseline justify-between">
                  <div className="flex flex-row items-baseline">
                    <p className="text-lg font-medium">
                      {comment.author.username}
                    </p>
                    <p className="ml-2 font-light">
                      {renderMostRecentRelativeTime(
                        comment.createdAt,
                        comment.updatedAt
                      )}
                    </p>
                  </div>
                  {comment.isOwner && !commentsInEdit.includes(comment.id) && (
                    <div>
                      <PrimaryActionButton
                        className="mr-2"
                        label="Edit"
                        onClick={() => {
                          setCommentsInEdit([...commentsInEdit, comment.id]);
                        }}
                      />
                      <SecondaryActionButton
                        label="Delete"
                        onClick={() => {
                          deleteComment({ id: comment.id });
                        }}
                      />
                    </div>
                  )}
                </div>
                {commentsInEdit.includes(comment.id) && comment.isOwner ? (
                  <Formik
                    initialValues={{
                      content: comment.content,
                    }}
                    onSubmit={async (values, { setErrors }) => {
                      if (values.content === comment.content) {
                        setCommentsInEdit(
                          commentsInEdit.filter(
                            (commentIdInEdit) => commentIdInEdit !== comment.id
                          )
                        );
                        return;
                      }

                      await sleep(500);

                      const response = await updateComment({
                        id: comment.id,
                        content: values.content,
                      });
                      const errors = mapAPIErrors(
                        response.error?.graphQLErrors
                      );

                      if (errors) {
                        setErrors(errors.validation);
                      } else {
                        setCommentsInEdit(
                          commentsInEdit.filter(
                            (commentIdInEdit) => commentIdInEdit !== comment.id
                          )
                        );
                      }
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form className="">
                        <FormField className="mb-6" name="content" />
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
                              setCommentsInEdit(
                                commentsInEdit.filter(
                                  (commentIdInEdit) =>
                                    commentIdInEdit !== comment.id
                                )
                              );
                            }}
                          />
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <p className="">{comment.content}</p>
                )}
              </div>
            ))}
            <div className="mt-4">
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
                    if (errors.errors) {
                      alert("You must be logged in to comment.");
                    }
                  } else {
                    values.content = "";
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="">
                    <FormField
                      className="mb-6"
                      name="content"
                      placeholder="Write something..."
                      type="textarea"
                    />
                    <div>
                      <PrimaryActionButton
                        isLoading={isSubmitting}
                        className="mr-2 text-lg h-11"
                        type="submit"
                        label="Comment"
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
