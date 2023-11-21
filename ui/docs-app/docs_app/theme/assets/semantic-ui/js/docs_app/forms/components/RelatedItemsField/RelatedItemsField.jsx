// This file is part of Invenio-RDM-Records
// Copyright (C) 2020-2023 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio-RDM-Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { getIn, FieldArray } from "formik";
import { Button, Form, Label, List, Icon } from "semantic-ui-react";
import _get from "lodash/get";
import { FieldLabel } from "react-invenio-forms";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { RelatedItemsModal } from "./RelatedItemsModal";
import { RelatedItemsFieldItem } from "./RelatedItemsFieldItem";
import { i18next } from "@translations/docs_app/i18next";

const creatibutorNameDisplay = (value) => {
  const name = _get(value, `fullName`);

  return `${name}`;
};

class RelatedItemsFieldForm extends Component {
  handleOnContributorChange = (selectedCreatibutor) => {
    const { push: formikArrayPush } = this.props;
    formikArrayPush(selectedCreatibutor);
  };

  render() {
    const {
      form: { values, errors, initialErrors, initialValues },
      remove: formikArrayRemove,
      replace: formikArrayReplace,
      move: formikArrayMove,
      name: fieldPath,
      label,
      labelIcon,
      schema,
      modal,
      autocompleteNames,
      addButtonLabel,
    } = this.props;

    const creatibutorsList = getIn(values, fieldPath, []);
    const formikInitialValues = getIn(initialValues, fieldPath, []);

    const error = getIn(errors, fieldPath, null);
    const initialError = getIn(initialErrors, fieldPath, null);
    const creatibutorsError =
      error || (creatibutorsList === formikInitialValues && initialError);

    return (
      <DndProvider backend={HTML5Backend}>
        <Form.Field
          required={schema === "creators"}
          className={creatibutorsError ? "error" : ""}
        >
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          <List>
            {creatibutorsList.map((value, index) => {
              const key = `${fieldPath}.${index}`;
              const identifiersError = creatibutorsError
                ? creatibutorsError[index]?.authorityIdentifiers
                : [];
              const displayName = creatibutorNameDisplay(value);
              return (
                <RelatedItemsFieldItem
                  key={key}
                  identifiersError={identifiersError}
                  {...{
                    displayName,
                    index,
                    schema,
                    compKey: key,
                    initialCreatibutor: value,
                    removeCreatibutor: formikArrayRemove,
                    replaceCreatibutor: formikArrayReplace,
                    moveCreatibutor: formikArrayMove,
                    addLabel: modal.addLabel,
                    editLabel: modal.editLabel,
                    autocompleteNames: autocompleteNames,
                  }}
                />
              );
            })}
            <RelatedItemsModal
              onCreatibutorChange={this.handleOnContributorChange}
              initialAction="add"
              addLabel={modal.addLabel}
              editLabel={modal.editLabel}
              schema={schema}
              autocompleteNames={autocompleteNames}
              trigger={
                <Button type="button" icon labelPosition="left">
                  <Icon name="add" />
                  {addButtonLabel}
                </Button>
              }
            />
            {creatibutorsError && typeof creatibutorsError == "string" && (
              <Label pointing="left" prompt>
                {creatibutorsError}
              </Label>
            )}
          </List>
        </Form.Field>
      </DndProvider>
    );
  }
}

export class RelatedItemsField extends Component {
  render() {
    const { fieldPath } = this.props;

    return (
      <FieldArray
        name={fieldPath}
        component={(formikProps) => (
          <RelatedItemsFieldForm {...formikProps} {...this.props} />
        )}
      />
    );
  }
}

RelatedItemsFieldForm.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  addButtonLabel: PropTypes.string,
  modal: PropTypes.shape({
    addLabel: PropTypes.string.isRequired,
    editLabel: PropTypes.string.isRequired,
  }),
  schema: PropTypes.oneOf(["creators", "contributors"]).isRequired,
  autocompleteNames: PropTypes.oneOf(["search", "search_only", "off"]),
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  form: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

RelatedItemsFieldForm.defaultProps = {
  autocompleteNames: "search",
  label: i18next.t("Creators"),
  modal: {
    addLabel: i18next.t("Add creator"),
    editLabel: i18next.t("Edit creator"),
  },
  addButtonLabel: i18next.t("Add related item"),
};

RelatedItemsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  addButtonLabel: PropTypes.string,
  modal: PropTypes.shape({
    addLabel: PropTypes.string.isRequired,
    editLabel: PropTypes.string.isRequired,
  }),
  schema: PropTypes.oneOf(["creators", "contributors"]).isRequired,
  autocompleteNames: PropTypes.oneOf(["search", "search_only", "off"]),
  label: PropTypes.string,
  labelIcon: PropTypes.string,
};

RelatedItemsField.defaultProps = {
  autocompleteNames: "search",
  label: undefined,
  labelIcon: undefined,
  modal: {
    addLabel: i18next.t("Add related item"),
    editLabel: i18next.t("Edit related item"),
  },
  addButtonLabel: i18next.t("Add related item"),
};
