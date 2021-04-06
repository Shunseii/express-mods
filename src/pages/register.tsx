import React, { useState } from "react";
import Link from "next/link";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";

import LabeledFormField from "../components/LabeledFormField";
import { PrimaryActionButton } from "../components/ActionButton";
import { useRegisterMutation } from "../generated/graphql";
import { mapValidationErrors } from "../utils/mapAPIError";
import sleep from "../utils/sleep";
import { createUrqlClient } from "../utils/createUrqlClient";
import Navbar from "../components/Navbar";
import ErrorMessage from "../components/ErrorMessage";

interface RegisterProps {}

const Register: NextPage<RegisterProps> = ({}) => {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [, register] = useRegisterMutation();

  return (
    <>
      <Navbar />
      <main className="flex h-full">
        <div className="flex flex-col p-8 m-auto bg-white rounded-md shadow-md w-96">
          <h1 className="self-center mb-8 text-2xl font-bold">
            Create an account
          </h1>
          <div className="mb-4">
            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              onSubmit={async (values, { setErrors }) => {
                setFormError("");
                await sleep(500);

                const response = await register(values);

                if (response.error) {
                  setErrors(mapValidationErrors(response.error.graphQLErrors));
                } else if (!response.data.register) {
                  const errorMsg = "An error occured. Please try again.";

                  setFormError(errorMsg);
                } else {
                  router.push("/");
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col">
                  <LabeledFormField
                    className="mb-6"
                    name="username"
                    label="Username"
                  />
                  <LabeledFormField
                    className="mb-6"
                    name="email"
                    type="email"
                    label="Email"
                  />
                  <LabeledFormField
                    className="mb-6"
                    name="password"
                    type="password"
                    label="Password"
                  />
                  <PrimaryActionButton
                    className="text-lg h-11"
                    isLoading={isSubmitting}
                    type="submit"
                    label="Register"
                  />
                  {formError && (
                    <ErrorMessage className="mt-2">{formError}</ErrorMessage>
                  )}
                </Form>
              )}
            </Formik>
          </div>
          <p className="self-center text-sm font-extralight">
            Already have an account?
            <span className="ml-1 font-medium">
              <Link href="/login">Login</Link>
            </span>
          </p>
        </div>
      </main>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Register);