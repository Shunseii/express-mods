import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";

import LabeledFormField from "../src/components/LabeledFormField";
import { PrimaryActionButton } from "../src/components/ActionButton";
import { useRegisterMutation } from "../src/generated/graphql";
import { mapValidationErrors } from "../src/utils/mapAPIError";
import sleep from "../src/utils/sleep";
import { createUrqlClient } from "../src/utils/createUrqlClient";
import Navbar from "../src/components/Navbar";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <>
      <Navbar />
      <main className="flex h-full">
        <div className="flex flex-col p-8 m-auto bg-white rounded-md shadow-md w-96">
          <h1 className="self-center mb-8 text-2xl font-bold">
            Create an account
          </h1>
          <div className="mb-6">
            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              onSubmit={async (values, { setErrors }) => {
                await sleep(1000);
                const response = await register(values);

                if (response.error) {
                  setErrors(mapValidationErrors(response.error.graphQLErrors));
                } else {
                  router.push("/");
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col">
                  <div className="mb-6">
                    <LabeledFormField name="username" label="Username" />
                  </div>
                  <div className="mb-6">
                    <LabeledFormField name="email" type="email" label="Email" />
                  </div>
                  <div className="mb-6">
                    <LabeledFormField
                      name="password"
                      type="password"
                      label="Password"
                    />
                  </div>
                  <PrimaryActionButton
                    className="text-lg h-11"
                    spinnerClassName="w-5 h-5"
                    isLoading={isSubmitting}
                    type="submit"
                    label="Register"
                  />
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
