from flask_resources import BaseListSchema
from flask_resources.serializers import JSONSerializer
from oarepo_runtime.resources import LocalizedUIJSONSerializer

from documents.services.files.ui_schema import (
    DocumentsFileDraftUISchema,
    DocumentsFileUISchema,
)


class DocumentsFileUIJSONSerializer(LocalizedUIJSONSerializer):
    """UI JSON serializer."""

    def __init__(self):
        """Initialise Serializer."""
        super().__init__(
            format_serializer_cls=JSONSerializer,
            object_schema_cls=DocumentsFileUISchema,
            list_schema_cls=BaseListSchema,
            schema_context={"object_key": "ui"},
        )


class DocumentsFileDraftUIJSONSerializer(LocalizedUIJSONSerializer):
    """UI JSON serializer."""

    def __init__(self):
        """Initialise Serializer."""
        super().__init__(
            format_serializer_cls=JSONSerializer,
            object_schema_cls=DocumentsFileDraftUISchema,
            list_schema_cls=BaseListSchema,
            schema_context={"object_key": "ui"},
        )
