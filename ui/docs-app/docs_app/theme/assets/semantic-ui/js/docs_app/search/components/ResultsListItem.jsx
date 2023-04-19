import React, { useContext } from "react";
import PropTypes from "prop-types";
import Overridable from "react-overridable";

import _get from "lodash/get";
import _join from "lodash/join";
import _truncate from "lodash/truncate";
import _mapValues from "lodash/mapValues";

import { Grid, Item, Label, List, Icon } from "semantic-ui-react";
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
  thesis,
  subjects,
  searchUrl,
}) => {
  const isThesisDefended = thesis?.dateDefended;

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
              <a
                href={
                  resourceType
                    ? `/vocabularies/${resourceType.type}/${resourceType.id}`
                    : ""
                }
                aria-label={`${i18next.t("Find all records")} ${i18next.t(
                  "by this document type"
                )}`}
                title={`${i18next.t("Find all records")} ${i18next.t(
                  "by this document type"
                )}`}
              >
                {resourceType.title || "No resource type"}
              </a>
              {thesis && (
                <Label pointing="left" size="mini" basic>
                  <Icon
                    name={isThesisDefended ? "check circle" : "remove circle"}
                    color={isThesisDefended ? "green" : "red"}
                  />{" "}
                  {isThesisDefended
                    ? i18next.t("defended")
                    : i18next.t("not defended")}
                </Label>
              )}
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
      <List>
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
  ...rest
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
  const resourceType = _get(result, "metadata.resourceType");
  const subjects = _get(result, "metadata.subjects", []);
  const title = _get(result, "metadata.title", "No title");
  const version = _get(result, "revision_id", null);
  const versions = _get(result, "versions");

  const thesis = _get(result, "metadata.thesis");
  const publishers = _get(result, "metadata.publishers", []);

  const filters =
    currentQueryState && Object.fromEntries(currentQueryState.filters);
  const allVersionsVisible = filters?.allversions;
  const numOtherVersions = version - 1;

  console.log(currentQueryState);

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
              <Grid.Column className="results-list item-side">
                <ItemSidebarIcons rights={rights} accessStatus={accessRights} />
              </Grid.Column>
              <Grid.Column className="results-list item-main">
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
                  thesis={thesis}
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
  ({ currentQueryState, updateQueryState, result, appName }) => (
    <ResultsListItem
      currentQueryState={currentQueryState}
      updateQueryState={updateQueryState}
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
