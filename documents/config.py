from oarepo_requests.resolvers.ui import (
    RecordEntityDraftReferenceUIResolver,
    RecordEntityReferenceUIResolver,
)
from oarepo_requests.resources.draft.resource import DraftRecordRequestsResource
from oarepo_requests.services.draft.service import DraftRecordRequestsService

from documents.files.api import DocumentsFileDraft
from documents.files.requests.resolvers import DocumentsFileDraftResolver
from documents.records.api import DocumentsDraft, DocumentsRecord
from documents.records.requests.resolvers import (
    DocumentsDraftResolver,
    DocumentsResolver,
)
from documents.resources.files.config import (
    DocumentsFileDraftResourceConfig,
    DocumentsFileResourceConfig,
)
from documents.resources.files.resource import (
    DocumentsFileDraftResource,
    DocumentsFileResource,
)
from documents.resources.records.config import DocumentsResourceConfig
from documents.resources.records.resource import DocumentsResource
from documents.services.files.config import (
    DocumentsFileDraftServiceConfig,
    DocumentsFileServiceConfig,
)
from documents.services.files.service import (
    DocumentsFileDraftService,
    DocumentsFileService,
)
from documents.services.records.config import DocumentsServiceConfig
from documents.services.records.service import DocumentsService

DOCUMENTS_RECORD_RESOURCE_CONFIG = DocumentsResourceConfig


DOCUMENTS_RECORD_RESOURCE_CLASS = DocumentsResource


DOCUMENTS_RECORD_SERVICE_CONFIG = DocumentsServiceConfig


DOCUMENTS_RECORD_SERVICE_CLASS = DocumentsService


DOCUMENTS_REQUESTS_RESOURCE_CLASS = DraftRecordRequestsResource


DOCUMENTS_REQUESTS_SERVICE_CLASS = DraftRecordRequestsService


REQUESTS_ENTITY_RESOLVERS = [
    DocumentsResolver(
        record_cls=DocumentsRecord, service_id="documents", type_key="documents"
    ),
    DocumentsDraftResolver(
        record_cls=DocumentsDraft, service_id="documents", type_key="documents_draft"
    ),
    DocumentsFileDraftResolver(
        record_cls=DocumentsFileDraft,
        service_id="documents_file_draft",
        type_key="documents_file_draft",
    ),
]


ENTITY_REFERENCE_UI_RESOLVERS = {
    "documents": RecordEntityReferenceUIResolver("documents"),
    "documents_draft": RecordEntityDraftReferenceUIResolver("documents_draft"),
}
REQUESTS_UI_SERIALIZATION_REFERENCED_FIELDS = []


DOCUMENTS_FILES_RESOURCE_CONFIG = DocumentsFileResourceConfig


DOCUMENTS_FILES_RESOURCE_CLASS = DocumentsFileResource


DOCUMENTS_FILES_SERVICE_CONFIG = DocumentsFileServiceConfig


DOCUMENTS_FILES_SERVICE_CLASS = DocumentsFileService


DOCUMENTS_DRAFT_FILES_RESOURCE_CONFIG = DocumentsFileDraftResourceConfig


DOCUMENTS_DRAFT_FILES_RESOURCE_CLASS = DocumentsFileDraftResource


DOCUMENTS_DRAFT_FILES_SERVICE_CONFIG = DocumentsFileDraftServiceConfig


DOCUMENTS_DRAFT_FILES_SERVICE_CLASS = DocumentsFileDraftService
