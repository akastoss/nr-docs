import React from "react";
import { Button, Form, Grid, Modal, Popup, Icon } from "semantic-ui-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { i18next } from "@translations/i18next";
import PropTypes from "prop-types";
import { MultilingualTextInput } from "@js/oarepo_ui";
import { requiredMessage } from "../../deposit/NRDocumentValidationSchema";

const SubjectsValidationSchema = Yup.object({
  keywords: Yup.array().of(
    Yup.object().shape({
      lang: Yup.string().required(requiredMessage).label(i18next.t("Language")),
      value: Yup.string().required(requiredMessage).label(i18next.t("Keyword")),
    })
  ),
});

export const SubjectsModal = ({ trigger, handleSubjectAdd }) => {
  const [open, setOpen] = React.useState(false);
  const [saveAndContinueLabel, setSaveAndContinueLabel] = React.useState(
    i18next.t("Save and add another")
  );
  const [action, setAction] = React.useState();

  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };

  const changeContent = () => {
    setSaveAndContinueLabel(i18next.t("Added"));
    setTimeout(() => {
      setSaveAndContinueLabel(i18next.t("Save and add another"));
    }, 1000);
  };

  const onSubmit = (values, formikBag) => {
    const newSubject = { subjectScheme: "keyword", subject: values.keywords };
    handleSubjectAdd(newSubject);
    formikBag.setSubmitting(false);
    formikBag.resetForm();
    switch (action) {
      case "saveAndContinue":
        closeModal();
        openModal();
        changeContent();
        break;
      case "saveAndClose":
        closeModal();
        break;
      default:
        break;
    }
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={onSubmit}
      enableReinitialize
      validationSchema={SubjectsValidationSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ values, resetForm, handleSubmit, errors }) => (
        <Modal
          className="form-modal"
          size="large"
          centered={false}
          onOpen={() => openModal()}
          open={open}
          trigger={trigger}
          onClose={() => {
            closeModal();
            resetForm();
          }}
          closeIcon
          closeOnDimmerClick={false}
        >
          <Modal.Header as="h6">
            <Grid>
              <Grid.Column floated="left" width={8}>
                <span>{i18next.t("Add keywords")}</span>
                <Popup
                  content={i18next.t(
                    "Write keywords describing the resource, always choose a language."
                  )}
                  trigger={
                    <Icon
                      name="question circle outline"
                      style={{ fontSize: "1rem", paddingLeft: "0.5rem" }}
                    ></Icon>
                  }
                />
              </Grid.Column>
            </Grid>
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field style={{ marginTop: 0 }} width={16}>
                <MultilingualTextInput
                  fieldPath="keywords"
                  lngFieldWidth={3}
                  textFieldLabel={i18next.t("Subject")}
                  required
                  showEmptyValue
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              name="cancel"
              onClick={() => {
                resetForm();
                closeModal();
              }}
              icon="remove"
              content={i18next.t("Cancel")}
              floated="left"
            />

            <Button
              name="submit"
              type="submit"
              onClick={() => {
                setAction("saveAndContinue");
                handleSubmit();
              }}
              primary
              icon="checkmark"
              content={saveAndContinueLabel}
            />
            <Button
              name="submit"
              type="submit"
              onClick={() => {
                setAction("saveAndClose");
                handleSubmit();
              }}
              primary
              icon="checkmark"
              content={i18next.t("Save")}
            />
          </Modal.Actions>
        </Modal>
      )}
    </Formik>
  );
};

SubjectsModal.propTypes = {
  trigger: PropTypes.node,
  handleSubjectAdd: PropTypes.func.isRequired,
};
