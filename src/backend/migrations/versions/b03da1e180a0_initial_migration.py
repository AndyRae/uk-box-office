"""Initial migration.

Revision ID: b03da1e180a0
Revises:
Create Date: 2022-11-11 00:09:11.324706

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "b03da1e180a0"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "country",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
        sa.UniqueConstraint("slug"),
    )
    op.create_table(
        "distributor",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
        sa.UniqueConstraint("slug"),
    )
    op.create_table(
        "week",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("date", sa.DateTime(), nullable=False),
        sa.Column("number_of_cinemas", sa.Integer(), nullable=True),
        sa.Column("number_of_releases", sa.Integer(), nullable=True),
        sa.Column("weekend_gross", sa.Integer(), nullable=True),
        sa.Column("week_gross", sa.Integer(), nullable=True),
        sa.Column("forecast_high", sa.Integer(), nullable=True),
        sa.Column("forecast_medium", sa.Integer(), nullable=True),
        sa.Column("forecast_low", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("date"),
    )
    op.create_table(
        "film",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("country_id", sa.Integer(), nullable=True),
        sa.Column("distributor_id", sa.Integer(), nullable=False),
        sa.Column("slug", sa.String(length=300), nullable=False),
        sa.ForeignKeyConstraint(
            ["country_id"],
            ["country.id"],
        ),
        sa.ForeignKeyConstraint(
            ["distributor_id"],
            ["distributor.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_table(
        "countries",
        sa.Column("country_id", sa.Integer(), nullable=False),
        sa.Column("film_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["country_id"],
            ["country.id"],
        ),
        sa.ForeignKeyConstraint(
            ["film_id"],
            ["film.id"],
        ),
        sa.PrimaryKeyConstraint("country_id", "film_id"),
    )
    op.create_table(
        "film_week",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("film_id", sa.Integer(), nullable=False),
        sa.Column("distributor_id", sa.Integer(), nullable=False),
        sa.Column("date", sa.DateTime(), nullable=False),
        sa.Column("rank", sa.Integer(), nullable=False),
        sa.Column("weeks_on_release", sa.Integer(), nullable=False),
        sa.Column("number_of_cinemas", sa.Integer(), nullable=False),
        sa.Column("weekend_gross", sa.Integer(), nullable=False),
        sa.Column("week_gross", sa.Integer(), nullable=False),
        sa.Column("total_gross", sa.Integer(), nullable=False),
        sa.Column("site_average", sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(
            ["distributor_id"],
            ["distributor.id"],
        ),
        sa.ForeignKeyConstraint(
            ["film_id"],
            ["film.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("film_week")
    op.drop_table("countries")
    op.drop_table("film")
    op.drop_table("week")
    op.drop_table("distributor")
    op.drop_table("country")
    # ### end Alembic commands ###
