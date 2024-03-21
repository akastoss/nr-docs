import React from "react";
import { BaseFormLayout } from "@js/oarepo_ui";
import { NRDocumentValidationSchema } from "@nr";

export const FormAppLayout = () => {
  const formikProps = {
    validationSchema: NRDocumentValidationSchema,
  };
  return <BaseFormLayout formikProps={formikProps} />;
};
export default FormAppLayout;
