import React, { useContext } from "react";
import PropTypes from "prop-types";
import Overridable from "react-overridable";

import _get from "lodash/get";
import _join from "lodash/join";
import _truncate from "lodash/truncate";

import { Grid, Item, Label, List } from "semantic-ui-react";
import { withState, buildUID } from "react-searchkit";
import { SearchConfigurationContext } from "@js/invenio_search_ui/components";

import { i18next } from "@translations/docs_app/i18next";

import { ResultsItemAccessStatus } from "./ResultsItemAccessStatus";
import { ResultsItemCreatibutors } from "./ResultsItemCreatibutors";
import { ResultsItemSubjects } from "./ResultsItemSubjects";
import { ResultsItemLicense } from "./ResultsItemLicense";
import { DoubleSeparator } from "./DoubleSeparator";

const ItemHeader = ({ title, searchUrl, selfLink }) => {
  const viewLink = new URL(
    selfLink,
    new URL(searchUrl, window.location.origin)
  );
  return (
    <Item.Header as="h2">
      <a href={viewLink}>{title}</a>
    </Item.Header>
  );
};

const ItemSubheader = ({
  creators,
  contributors,
  publicationDate,
  languages,
  version,
  resourceType,
  defended,
  subjects,
  searchUrl,
}) => {
  return (
    <>
      <Item.Meta>
        <Grid columns={1}>
          <Grid.Column>
            <Grid.Row className="ui separated creatibutors">
              <ResultsItemCreatibutors
                creators={creators}
                contributors={contributors}
                searchUrl={searchUrl}
              />
            </Grid.Row>
            <Grid.Row className="ui separated">
              <span
                aria-label={i18next.t("Publication date")}
                title={i18next.t("Publication date")}
              >
                {publicationDate} (v{version})
              </span>
              <DoubleSeparator />
              <span
                aria-label={i18next.t("Languages")}
                title={i18next.t("Languages")}
              >
                {_join(
                  languages.map((l) => l.title),
                  ","
                )}
              </span>
            </Grid.Row>
            <Grid.Row>
              <span
                aria-label={i18next.t("Document type")}
                title={i18next.t("Document type")}
              >
                {resourceType}
              </span>
              <Label
                pointing="left"
                size="mini"
                color={defended ? "positive" : "negative"}
              >
                {defended ? i18next.t("defended") : i18next.t("not defended")}
              </Label>
            </Grid.Row>
            <Grid.Row>
              <ResultsItemSubjects subjects={subjects} />
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Item.Meta>
    </>
  );
};

const ItemExtraInfo = ({ createdDate, publishers }) => {
  return (
    <Item.Extra>
      <div>
        <small>
          <p>
            {createdDate && (
              <>
                {i18next.t("Uploaded on")} <span>{createdDate}</span>
              </>
            )}
            {createdDate && publishers && " | "}
            {publishers && (
              <>
                {i18next.t("Published in: ")}{" "}
                <span>{_join(publishers, ", ")}</span>
              </>
            )}
          </p>
        </small>
      </div>
    </Item.Extra>
  );
};

const ItemSidebarIcons = ({ accessStatus, rights }) => {
  return (
    <Item.Extra className="labels-actions">
      <List vertical>
        <List.Item>
          <ResultsItemAccessStatus status={accessStatus} />
        </List.Item>
        <List.Item>
          <ResultsItemLicense rights={rights} />
        </List.Item>
      </List>
    </Item.Extra>
  );
};

export const ResultsListItemComponent = ({
  currentQueryState,
  result,
  appName,
}) => {
  const searchAppConfig = useContext(SearchConfigurationContext);
  const accessRights = _get(result, "metadata.accessRights");
  const createdDate = _get(result, "created", "No creation date found.");
  const creators = result.metadata.creators;
  const contributors = _get(result, "metadata.contributors", []);

  const rights = _get(result, "metadata.rights");

  const descriptionStripped = _get(
    result,
    "metadata.abstract[0].value",
    "No description"
  );

  const languages = _get(result, "metadata.languages", []);

  const publicationDate = _get(
    result,
    "metadata.dateAvailable",
    "No publication date found."
  );
  const resourceType = _get(
    result,
    "metadata.resourceType.title",
    "No resource type"
  );
  const subjects = _get(result, "metadata.subjects", []);
  const title = _get(result, "metadata.title", "No title");
  const version = _get(result, "revision_id", null);
  const versions = _get(result, "versions");

  const thesis = _get(result, "metadata.thesis", {});
  const publishers = _get(result, "metadata.publishers", []);

  const filters =
    currentQueryState && Object.fromEntries(currentQueryState.filters);
  const allVersionsVisible = filters?.allversions;
  const numOtherVersions = version - 1;

  const sidebarColumnWidth = 2;

  return (
    <Overridable
      id={buildUID("RecordsResultsListItem.layout", "", appName)}
      result={result}
      accessStatus={accessRights}
      createdDate={createdDate}
      creators={creators}
      descriptionStripped={descriptionStripped}
      publicationDate={publicationDate}
      publishers={publishers}
      resourceType={resourceType}
      subjects={subjects}
      languages={languages}
      title={title}
      version={version}
      versions={versions}
      rights={rights}
      thesis={thesis}
      allVersionsVisible={allVersionsVisible}
      numOtherVersions={numOtherVersions}
    >
      <Item key={result.id}>
        <Item.Content>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column width={sidebarColumnWidth}>
                <ItemSidebarIcons rights={rights} accessStatus={accessRights} />
              </Grid.Column>
              <Grid.Column width={16 - sidebarColumnWidth}>
                <ItemHeader
                  title={title}
                  searchUrl={searchAppConfig.ui_endpoint}
                  selfLink={result.links.self}
                />
                <ItemSubheader
                  creators={creators}
                  contributors={contributors}
                  publicationDate={publicationDate}
                  languages={languages}
                  version={version}
                  resourceType={resourceType}
                  defended={thesis.dateDefended}
                  subjects={subjects}
                  searchUrl={searchAppConfig.ui_endpoint}
                />
                <Item.Description>
                  {_truncate(descriptionStripped, { length: 350 })}
                </Item.Description>
                <ItemExtraInfo
                  createdDate={createdDate}
                  publishers={publishers}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Item.Content>
      </Item>
    </Overridable>
  );
};

ResultsListItemComponent.propTypes = {
  currentQueryState: PropTypes.object,
  result: PropTypes.object.isRequired,
  appName: PropTypes.string,
};

ResultsListItemComponent.defaultProps = {
  currentQueryState: null,
  appName: "",
};

export const ResultsListItem = (props) => {
  return (
    <Overridable id={buildUID("ResultsListItem", "", props.appName)} {...props}>
      <ResultsListItemComponent {...props} />
    </Overridable>
  );
};

ResultsListItem.propTypes = {
  currentQueryState: PropTypes.object,
  result: PropTypes.object.isRequired,
  appName: PropTypes.string,
};

ResultsListItem.defaultProps = {
  currentQueryState: null,
  appName: "",
};

export const ResultsListItemWithState = withState(
  ({ currentQueryState, result, appName }) => (
    <ResultsListItem
      currentQueryState={currentQueryState}
      result={result}
      appName={appName}
    />
  )
);

ResultsListItemWithState.propTypes = {
  currentQueryState: PropTypes.object,
  result: PropTypes.object.isRequired,
};

ResultsListItemWithState.defaultProps = {
  currentQueryState: null,
};
