import React from "react";
import { Field, useField, ErrorMessage as FormikError } from "formik";
import ErrorMessage from "./ErrorMessage";

type InputType = "text" | "password" | "email" | "number" | "textarea";

interface LabeledFormFieldProps {
  name: string;
  label: string;
  type?: InputType;
  HelpLink?: React.FC;
  className?: string;
  placeholder?: string;
}

const LabeledFormField: React.FC<LabeledFormFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  const { type = "text", label, placeholder, className, HelpLink } = props;

  return (
    <div className={className}>
      <label>
        <div className="flex flex-row items-center justify-between">
          <span className="">{label}</span>
          {HelpLink && (
            <span className="text-sm font-light">
              <HelpLink />
            </span>
          )}
        </div>
        <Field
          type={type}
          id={field.name}
          name={field.name}
          as={type === "textarea" ? "textarea" : "input"}
          placeholder={placeholder ?? label}
          rows={5}
          {...field}
          className={`block w-full mt-1 rounded-md shadow-sm transition-colors ${
            type !== "textarea" && "focus:placeholder-transparent"
          } ${
            error
              ? "border-red-600 placeholder-red-500 placeholder-opacity-70"
              : "border-gray-300"
          } focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        />
      </label>
      {error && (
        <ErrorMessage>
          <FormikError name={field.name} />
        </ErrorMessage>
      )}
    </div>
  );
};

export default LabeledFormField;
