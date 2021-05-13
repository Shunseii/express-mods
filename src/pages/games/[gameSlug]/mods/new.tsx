import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import Head from "next/head";
import React, { useState } from "react";

import { PrimaryActionButton } from "../../../../components/ActionButton";
import LabeledFormField from "../../../../components/LabeledFormField";
import Navbar from "../../../../components/Navbar";
import { useCreateModMutation } from "../../../../generated/graphql";
import { createUrqlClient } from "../../../../utils/createUrqlClient";
import { mapAPIErrors } from "../../../../utils/mapAPIError";
import sleep from "../../../../utils/sleep";
import ErrorMessage from "../../../../components/ErrorMessage";
import useIsAuth from "../../../../hooks/useIsAuth";
import Container from "../../../../components/Container";

interface CreateModPageProps {}

const CreateModPage: NextPage<CreateModPageProps> = () => {
  const [, createMod] = useCreateModMutation();
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useIsAuth();

  return (
    <>
      <Head>
        <title>Create a Mod | Express Mods</title>
        <link rel="icon" href="/files-circle.svg" />
      </Head>

      <Navbar />
      <Container>
        <h1 className="mb-8 text-2xl font-medium text-center">Create a mod</h1>
        <div className="mb-4">
          <Formik
            initialValues={{ title: "", content: "" }}
            onSubmit={async (values, { setErrors }) => {
              setFormError("");
              await sleep(500);

              const response = await createMod({
                title: values.title,
                content: values.content,
                gameSlug: router.query.gameSlug as string,
              });
              const apiErrors = mapAPIErrors(response.error?.graphQLErrors);

              if (apiErrors) {
                setErrors(apiErrors.validation);
                setFormError(apiErrors?.errors[0] ?? "");
              } else {
                router.push(`/games/${router.query.gameSlug}/mods`);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col">
                <LabeledFormField
                  className="mb-6"
                  name="title"
                  label="Title (min. 4, max. 255 characters)"
                  placeholder="Title"
                />
                <LabeledFormField
                  className="mb-6"
                  name="content"
                  type="textarea"
                  label="Content (min. 16 characters)"
                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />
                <PrimaryActionButton
                  isLoading={isSubmitting}
                  className="text-lg h-11"
                  type="submit"
                  label="Create mod"
                />
                {formError && (
                  <ErrorMessage className="mt-2">{formError}</ErrorMessage>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(CreateModPage);
