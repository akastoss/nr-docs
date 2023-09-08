import sqlalchemy_utils.types
import sqlalchemy_utils

#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""nrp install revision."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "nr_documents_3"
down_revision = "nr_documents_2"
branch_labels = ()
depends_on = None


def upgrade():
    """Upgrade database."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "nr_documents_parent_metadata",
        sa.Column(
            "created",
            sa.DateTime().with_variant(mysql.DATETIME(fsp=6), "mysql"),
            nullable=False,
        ),
        sa.Column(
            "updated",
            sa.DateTime().with_variant(mysql.DATETIME(fsp=6), "mysql"),
            nullable=False,
        ),
        sa.Column("id", sqlalchemy_utils.types.uuid.UUIDType(), nullable=False),
        sa.Column(
            "json",
            sa.JSON()
            .with_variant(sqlalchemy_utils.types.json.JSONType(), "mysql")
            .with_variant(
                postgresql.JSONB(none_as_null=True, astext_type=sa.Text()), "postgresql"
            )
            .with_variant(sqlalchemy_utils.types.json.JSONType(), "sqlite"),
            nullable=True,
        ),
        sa.Column("version_id", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_nr_documents_parent_metadata")),
    )
    op.create_table(
        "nrdocumentsdraft_metadata",
        sa.Column(
            "created",
            sa.DateTime().with_variant(mysql.DATETIME(fsp=6), "mysql"),
            nullable=False,
        ),
        sa.Column(
            "updated",
            sa.DateTime().with_variant(mysql.DATETIME(fsp=6), "mysql"),
            nullable=False,
        ),
        sa.Column("id", sqlalchemy_utils.types.uuid.UUIDType(), nullable=False),
        sa.Column(
            "json",
            sa.JSON()
            .with_variant(sqlalchemy_utils.types.json.JSONType(), "mysql")
            .with_variant(
                postgresql.JSONB(none_as_null=True, astext_type=sa.Text()), "postgresql"
            )
            .with_variant(sqlalchemy_utils.types.json.JSONType(), "sqlite"),
            nullable=True,
        ),
        sa.Column("version_id", sa.Integer(), nullable=False),
        sa.Column("index", sa.Integer(), nullable=True),
        sa.Column("fork_version_id", sa.Integer(), nullable=True),
        sa.Column(
            "expires_at",
            sa.DateTime().with_variant(mysql.DATETIME(fsp=6), "mysql"),
            nullable=True,
        ),
        sa.Column("parent_id", sqlalchemy_utils.types.uuid.UUIDType(), nullable=True),
        sa.ForeignKeyConstraint(
            ["parent_id"],
            ["nr_documents_parent_metadata.id"],
            name=op.f(
                "fk_nrdocumentsdraft_metadata_parent_id_nr_documents_parent_metadata"
            ),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_nrdocumentsdraft_metadata")),
    )
    op.create_table(
        "parent_state",
        sa.Column("latest_index", sa.Integer(), nullable=True),
        sa.Column("parent_id", sqlalchemy_utils.types.uuid.UUIDType(), nullable=False),
        sa.Column("latest_id", sqlalchemy_utils.types.uuid.UUIDType(), nullable=True),
        sa.Column(
            "next_draft_id", sqlalchemy_utils.types.uuid.UUIDType(), nullable=True
        ),
        sa.ForeignKeyConstraint(
            ["latest_id"],
            ["nrdocuments_metadata.id"],
            name=op.f("fk_parent_state_latest_id_nrdocuments_metadata"),
        ),
        sa.ForeignKeyConstraint(
            ["next_draft_id"],
            ["nrdocumentsdraft_metadata.id"],
            name=op.f("fk_parent_state_next_draft_id_nrdocumentsdraft_metadata"),
        ),
        sa.ForeignKeyConstraint(
            ["parent_id"],
            ["nr_documents_parent_metadata.id"],
            name=op.f("fk_parent_state_parent_id_nr_documents_parent_metadata"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("parent_id", name=op.f("pk_parent_state")),
    )
    op.drop_index("ix_uq_partial_files_object_is_head", table_name="files_object")
    op.add_column(
        "nrdocuments_metadata", sa.Column("index", sa.Integer(), nullable=True)
    )
    op.add_column(
        "nrdocuments_metadata",
        sa.Column("parent_id", sqlalchemy_utils.types.uuid.UUIDType(), nullable=True),
    )
    op.create_foreign_key(
        op.f("fk_nrdocuments_metadata_parent_id_nr_documents_parent_metadata"),
        "nrdocuments_metadata",
        "nr_documents_parent_metadata",
        ["parent_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.add_column(
        "nrdocuments_metadata_version",
        sa.Column("index", sa.Integer(), autoincrement=False, nullable=True),
    )
    op.add_column(
        "nrdocuments_metadata_version",
        sa.Column(
            "parent_id",
            sqlalchemy_utils.types.uuid.UUIDType(),
            autoincrement=False,
            nullable=True,
        ),
    )
    # ### end Alembic commands ###


def downgrade():
    """Downgrade database."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("nrdocuments_metadata_version", "parent_id")
    op.drop_column("nrdocuments_metadata_version", "index")
    op.drop_constraint(
        op.f("fk_nrdocuments_metadata_parent_id_nr_documents_parent_metadata"),
        "nrdocuments_metadata",
        type_="foreignkey",
    )
    op.drop_column("nrdocuments_metadata", "parent_id")
    op.drop_column("nrdocuments_metadata", "index")
    op.create_index(
        "ix_uq_partial_files_object_is_head",
        "files_object",
        ["bucket_id", "key"],
        unique=False,
    )
    op.drop_table("parent_state")
    op.drop_table("nrdocumentsdraft_metadata")
    op.drop_table("nr_documents_parent_metadata")
    # ### end Alembic commands ###
