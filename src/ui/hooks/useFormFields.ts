import React from "react";

interface FormFields {
  [key: string]: string;
}

export default function useFormFields<T extends FormFields>(initialValues: T) {
  const [values, setValues] = React.useState<T>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFields = () => {
    setValues(initialValues);
  };

  return {
    values,
    handleChange,
    resetFields,
    setValues,
  };
}
