import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";

import LabeledFormField from "../components/LabeledFormField";
import { PrimaryActionButton } from "../components/ActionButton";
import { useLoginMutation } from "../generated/graphql";
import { mapValidationErrors } from "../utils/mapAPIError";
import sleep from "../utils/sleep";
import { createUrqlClient } from "../utils/createUrqlClient";
import Navbar from "../components/Navbar";
import Link from "../components/Link";

interface LoginProps {}

const Login: NextPage<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <>
      <Navbar />
      <main className="flex h-full">
        <div className="flex flex-col p-8 m-auto bg-white rounded-md shadow-md w-96">
          <h1 className="self-center mb-8 text-2xl font-bold">Login</h1>
          <div className="mb-4">
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={async (values, { setErrors }) => {
                await sleep(500);

                const response = await login(values);

                if (response.error) {
                  setErrors(mapValidationErrors(response.error.graphQLErrors));
                } else if (!response.data.login) {
                  const errorMsg = "Your username or password is incorrect.";

                  setErrors({ username: errorMsg, password: errorMsg });
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
                    name="password"
                    type="password"
                    HelpLink={() => (
                      <Link href="/forgot-password">Forgot your password?</Link>
                    )}
                    label="Password"
                  />
                  <PrimaryActionButton
                    isLoading={isSubmitting}
                    className="text-lg h-11"
                    type="submit"
                    label="Login"
                  />
                </Form>
              )}
            </Formik>
          </div>
          <p className="self-center text-sm font-extralight">
            Don't have an account?
            <Link className="ml-1 text-sm font-medium" href="/register">
              Register
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Login);