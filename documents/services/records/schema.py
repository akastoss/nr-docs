import marshmallow as ma
from invenio_drafts_resources.services.records.schema import (
    ParentSchema as InvenioParentSchema,
)
from invenio_vocabularies.services.schema import i18n_strings
from marshmallow import fields as ma_fields
from marshmallow.fields import String
from marshmallow.utils import get_value
from marshmallow_utils.fields import SanitizedUnicode
from nr_metadata.documents.services.records.schema import (
    NRDocumentMetadataSchema,
    NRDocumentRecordSchema,
    NRDocumentSyntheticFieldsSchema,
)
from oarepo_runtime.services.schema.marshmallow import DictOnlySchema
from oarepo_vocabularies.services.schema import HierarchySchema


class GeneratedParentSchema(InvenioParentSchema):
    """"""

    owners = ma.fields.List(ma.fields.Dict(), load_only=True)


class DocumentsSchema(NRDocumentRecordSchema):
    class Meta:
        unknown = ma.RAISE

    metadata = ma_fields.Nested(lambda: NRDocumentMetadataSchema())

    oai = ma_fields.Nested(lambda: OaiSchema())

    syntheticFields = ma_fields.Nested(lambda: SyntheticFieldsSchema())
    parent = ma.fields.Nested(GeneratedParentSchema)
    files = ma.fields.Nested(
        lambda: FilesOptionsSchema(), load_default={"enabled": True}
    )

    # todo this needs to be generated for [default preview] to work
    def get_attribute(self, obj, attr, default):
        """Override how attributes are retrieved when dumping.

        NOTE: We have to access by attribute because although we are loading
              from an external pure dict, but we are dumping from a data-layer
              object whose fields should be accessed by attributes and not
              keys. Access by key runs into FilesManager key access protection
              and raises.
        """
        if attr == "files":
            return getattr(obj, attr, default)
        else:
            return get_value(obj, attr, default)


class OaiSchema(DictOnlySchema):
    class Meta:
        unknown = ma.RAISE

    harvest = ma_fields.Nested(lambda: HarvestSchema())


class HarvestSchema(DictOnlySchema):
    class Meta:
        unknown = ma.RAISE

    datestamp = ma_fields.String()

    identifier = ma_fields.String()


class InstitutionsSchema(DictOnlySchema):
    class Meta:
        unknown = ma.INCLUDE

    _id = String(data_key="id", attribute="id")

    _version = String(data_key="@v", attribute="@v")

    hierarchy = ma_fields.Nested(lambda: HierarchySchema())

    title = i18n_strings


class KeywordsSchema(DictOnlySchema):
    class Meta:
        unknown = ma.RAISE


class SyntheticFieldsSchema(NRDocumentSyntheticFieldsSchema):
    class Meta:
        unknown = ma.RAISE


class FilesOptionsSchema(ma.Schema):
    """Basic files options schema class."""

    enabled = ma.fields.Bool(missing=True)
    # allow unsetting
    default_preview = SanitizedUnicode(allow_none=True)

    def get_attribute(self, obj, attr, default):
        """Override how attributes are retrieved when dumping.

        NOTE: We have to access by attribute because although we are loading
              from an external pure dict, but we are dumping from a data-layer
              object whose fields should be accessed by attributes and not
              keys. Access by key runs into FilesManager key access protection
              and raises.
        """
        value = getattr(obj, attr, default)

        if attr == "default_preview" and not value:
            return default

        return value
