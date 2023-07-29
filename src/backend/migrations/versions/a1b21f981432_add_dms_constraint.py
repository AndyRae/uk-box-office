"""Add dms constraint

Revision ID: a1b21f981432
Revises: 3661a8e9d4fa
Create Date: 2023-07-26 18:48:34.621200

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "a1b21f981432"
down_revision = "3661a8e9d4fa"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(
        None, "distributor_market_share", ["distributor_id", "year"]
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "distributor_market_share", type_="unique")
    # ### end Alembic commands ###