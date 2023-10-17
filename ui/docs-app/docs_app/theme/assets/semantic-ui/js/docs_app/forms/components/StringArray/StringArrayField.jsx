import React from "react";
import PropTypes from "prop-types";
import { FieldLabel, TextField } from "react-invenio-forms";
import { i18next } from "@translations/docs_app/i18next";
import { useFormikContext, getIn, FieldArray } from "formik";
import { Icon, Form } from "semantic-ui-react";
import { ArrayFieldItem } from "@js/oarepo_ui";

export const StringArrayField = ({
  fieldPath,
  label,
  required,
  newItemInitialValue,
  addButtonLabel,
  helpText,
  labelIcon,
  ...uiProps
}) => {
  const { values } = useFormikContext();
  return (
    <Form.Field>
      <FieldLabel label={label} icon={labelIcon} htmlFor={fieldPath} />
      <FieldArray
        name={fieldPath}
        render={(arrayHelpers) => (
          <React.Fragment>
            {getIn(values, fieldPath, []).map((item, index) => {
              const indexPath = `${fieldPath}.${index}`;
              return (
                <ArrayFieldItem
                  key={index}
                  indexPath={index}
                  arrayHelpers={arrayHelpers}
                >
                  <TextField
                    width={16}
                    fieldPath={indexPath}
                    label={`#${index + 1}`}
                    optimized
                    fluid
                    {...uiProps}
                  />
                </ArrayFieldItem>
              );
            })}
            <label className="helptext">{helpText}</label>
            <Form.Button
              type="button"
              icon
              labelPosition="left"
              onClick={() => {
                arrayHelpers.push(newItemInitialValue);
              }}
            >
              <Icon name="add" />
              {addButtonLabel}
            </Form.Button>
          </React.Fragment>
        )}
      />
    </Form.Field>
  );
};

StringArrayField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  newItemInitialValue: PropTypes.string,
  addButtonLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  helpText: PropTypes.string,
  labelIcon: PropTypes.string,
};

StringArrayField.defaultProps = {
  addButtonLabel: i18next.t("Add note"),
  newItemInitialValue: "",
  labelIcon: "pencil",
  label: i18next.t("Notes"),
  helpText: i18next.t("Items shall be unique"),
};
