import React, { useState } from "react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { Formik, Form } from "formik";

import Navbar from "../components/Navbar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { PrimaryActionButton } from "../components/ActionButton";
import LabeledFormField from "../components/LabeledFormField";
import { mapValidationErrors } from "../utils/mapAPIError";
import sleep from "../utils/sleep";
import { useForgotPasswordMutation } from "../generated/graphql";

interface ForgotPasswordProps {}

const ForgotPassword: NextPage<ForgotPasswordProps> = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [completed, setCompleted] = useState(false);

  return (
    <>
      <Navbar />
      <main className="flex h-full">
        <div className="flex flex-col p-8 m-auto bg-white rounded-md shadow-md w-96">
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

                  if (response.error) {
                    setErrors(
                      mapValidationErrors(response.error.graphQLErrors)
                    );
                  } else {
                    setCompleted(true);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col">
                    <LabeledFormField
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
