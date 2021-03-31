import React from "react";
import { Field, useField, ErrorMessage } from "formik";
import { RiErrorWarningFill as ErrorIcon } from "react-icons/ri";

interface LabeledFormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

const LabeledFormField: React.FC<LabeledFormFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  const { type, label, placeholder } = props;

  return (
    <>
      <label>
        {label}
        <Field
          type={type ?? "text"}
          id={field.name}
          name={field.name}
          placeholder={placeholder ?? label}
          {...field}
          className={`block w-full mt-1 rounded-md shadow-sm transition-colors focus:placeholder-transparent ${
            error
              ? "border-red-600 placeholder-red-500 placeholder-opacity-70"
              : "border-gray-300"
          } focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        />
      </label>
      {error && (
        <p className="text-red-600">
          <ErrorIcon className="inline mr-2" />
          <span className="text-sm font-light">
            <ErrorMessage name={field.name} />
          </span>
        </p>
      )}
    </>
  );
};

export default LabeledFormField;
