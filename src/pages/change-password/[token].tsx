import { Formik, Form } from "formik";
import { GetServerSideProps, NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { PrimaryActionButton } from "../../components/ActionButton";
import LabeledFormField from "../../components/LabeledFormField";
import Navbar from "../../components/Navbar";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { mapValidationErrors } from "../../utils/mapAPIError";
import sleep from "../../utils/sleep";
import ErrorMessage from "../../components/ErrorMessage";

interface ChangePasswordPageProps {
  token?: string;
}

const ChangePassword: NextPage<ChangePasswordPageProps> = ({ token }) => {
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const [, changePassword] = useChangePasswordMutation();

  return (
    <>
      <Navbar />
      <main className="flex h-full">
        <div className="flex flex-col p-8 m-auto bg-white rounded-md shadow-md w-96">
          <h1 className="self-center mb-8 text-2xl font-bold">
            Change your password
          </h1>
          <div>
            <Formik
              initialValues={{ newPassword: "" }}
              onSubmit={async ({ newPassword }, { setErrors }) => {
                setFormError(null);
                await sleep(500);

                const response = await changePassword({
                  token,
                  newPassword: newPassword,
                });

                if (response.error) {
                  setErrors(mapValidationErrors(response.error.graphQLErrors));
                } else if (!response.data.changePassword) {
                  setFormError(`Your token is invalid or it has expired.`);
                } else {
                  router.push("/");
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col">
                  <LabeledFormField
                    className="mb-6"
                    name="newPassword"
                    type="password"
                    label="New password"
                  />
                  <PrimaryActionButton
                    className="text-lg h-11"
                    isLoading={isSubmitting}
                    type="submit"
                    label="Change password"
                  />
                  {formError && (
                    <ErrorMessage className="mt-2">{formError}</ErrorMessage>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  ChangePasswordPageProps,
  { token: string }
> = async ({ params }) => {
  return { props: { token: params.token } };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
