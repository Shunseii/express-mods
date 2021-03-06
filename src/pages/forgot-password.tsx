import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { withUrqlClient } from "next-urql";
import { Formik, Form } from "formik";

import Navbar from "../components/Navbar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { PrimaryActionButton } from "../components/ActionButton";
import FormField from "../components/FormField";
import { mapAPIErrors } from "../utils/mapAPIError";
import sleep from "../utils/sleep";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword: NextPage = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [completed, setCompleted] = useState(false);

  return (
    <>
      <Head>
        <title>Forgot Password | Express Mods</title>
        <link rel="icon" href="/files-circle.svg" />
      </Head>

      <Navbar />
      <main className="flex h-full">
        <div className="flex flex-col p-8 m-auto bg-white border rounded-md shadow-md w-96">
          <h1 className="self-center mb-8 text-2xl font-bold">
            Reset your password
          </h1>
          {completed ? (
            <div>
              If an account with that email exists, we will send you a link to
              reset your password.
            </div>
          ) : (
            <div>
              <Formik
                initialValues={{ email: "" }}
                onSubmit={async (values, { setErrors }) => {
                  await sleep(500);

                  const response = await forgotPassword({
                    email: values.email,
                  });
                  const errors = mapAPIErrors(response.error?.graphQLErrors);

                  if (errors) {
                    setErrors(errors.validation);
                  } else {
                    setCompleted(true);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col">
                    <FormField
                      className="mb-6"
                      name="email"
                      type="email"
                      label="Email"
                    />
                    <PrimaryActionButton
                      isLoading={isSubmitting}
                      className="text-lg h-11"
                      type="submit"
                      label="Send confirmation link"
                    />
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
