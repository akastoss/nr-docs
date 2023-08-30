import React from "react";
import { Button } from "semantic-ui-react";
import { i18next } from "@translations/docs_app/i18next";
import { useFormikContext } from "formik";
import {
  useFormConfig,
  useSubmitConfig,
  submitContextType,
} from "@js/oarepo_ui";

export const SaveButton = ({ ...uiProps }) => {
  const { handleSubmit, isSubmitting } = useFormikContext();
  const { record, formConfig } = useFormConfig();
  const { updateConfig } = useSubmitConfig();
  const existingRecord = !!record.id;

  return (
    <Button
      name="save"
      disabled={isSubmitting}
      loading={isSubmitting}
      color="grey"
      onClick={(e) => {
        updateConfig(submitContextType.save);
        handleSubmit(e);
      }}
      icon="save"
      labelPosition="left"
      content={i18next.t("Save")}
      type="button"
      {...uiProps}
    />
  );
};
