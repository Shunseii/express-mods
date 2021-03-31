import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";

import LabeledFormField from "../src/components/LabeledFormField";
import { PrimaryActionButton } from "../src/components/ActionButton";
import { useLoginMutation } from "../src/generated/graphql";
import { mapValidationErrors } from "../src/utils/mapAPIError";
import sleep from "../src/utils/sleep";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <div className="flex h-full">
      <div className="flex flex-col p-8 m-auto bg-white rounded-md shadow-md w-96">
        <h1 className="self-center mb-8 text-2xl font-bold">Login</h1>
        <div className="mb-6">
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              await sleep(1000);
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
                <div className="mb-6">
                  <LabeledFormField name="username" label="Username" />
                </div>
                <div className="mb-6">
                  <LabeledFormField
                    name="password"
                    type="password"
                    label="Password"
                  />
                </div>
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
          <span className="ml-1 font-medium">
            <Link href="/register">Register</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
