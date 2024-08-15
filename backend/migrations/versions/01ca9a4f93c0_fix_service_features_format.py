"""Fix service features format

Revision ID: <auto_generated_id>  # Keep this as is
Revises: f091092479b9  # Update this to match the latest revision
Create Date: <auto_generated_date>  # Keep this as is

"""
from alembic import op
import sqlalchemy as sa
import json

# revision identifiers, used by Alembic.
revision = '<auto_generated_id>'  # Keep this as is
down_revision = 'f091092479b9'  # Update this to match the latest revision
branch_labels = None
depends_on = None

def upgrade():
    # Get a reference to the Service table
    service_table = sa.Table(
        'service',
        sa.MetaData(),
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('features', sa.Text)
    )

    # Create a database connection
    connection = op.get_bind()

    # Fetch all services
    services = connection.execute(service_table.select()).fetchall()

    # Update each service
    for service in services:
        features = service.features
        if features:
            try:
                # Try to parse as JSON
                json.loads(features)
            except json.JSONDecodeError:
                # If parsing fails, convert to JSON
                features_list = [f.strip() for f in features.split(',') if f.strip()]
                new_features = json.dumps(features_list)
                
                # Update the service
                connection.execute(
                    service_table.update().
                    where(service_table.c.id == service.id).
                    values(features=new_features)
                )

def downgrade():
    # No downgrade necessary
    pass