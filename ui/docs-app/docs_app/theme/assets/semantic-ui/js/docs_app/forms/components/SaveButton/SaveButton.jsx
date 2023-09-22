import React from "react";
import { Button } from "semantic-ui-react";
import { i18next } from "@translations/docs_app/i18next";
import { useDepositApiClient } from "@js/oarepo_ui";

export const SaveButton = ({ ...uiProps }) => {
  const { isSubmitting, save } = useDepositApiClient();
  return (
    <Button
      name="save"
      disabled={isSubmitting}
      loading={isSubmitting}
      color="grey"
      onClick={() => save()}
      icon="save"
      labelPosition="left"
      content={i18next.t("Save")}
      type="submit"
      {...uiProps}
    />
  );
};
