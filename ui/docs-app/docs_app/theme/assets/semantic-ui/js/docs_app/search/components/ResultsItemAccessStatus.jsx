import React from "react";
import { Image } from "semantic-ui-react";

const iconsObject = {
  c_abf2: "zamky_open_access.svg",
  c_16ec: "zamky_Partialy_closed_access.svg",
  c_f1cf: "zamky_Closed_access.svg",
};

export const ResultsItemAccessStatus = ({ status }) => {
  const { id, title } = status;
  const iconFile = iconsObject[id] || null;
  return (
    iconFile && (
      <Image
        as="a"
        href={`/vocabularies/access-rights/${id}`}
        centered
        fluid
        title={title}
        aria-label={title}
        className={`access-status ${title}`}
        src={`/static/icons/locks/${iconFile}`}
      />
    )
  );
};
