import pytest
import psycopg2
import sys

DATABASE_URL = "postgresql://postgres:jinkalikki@database-1.c6h8a6myaxt5.us-east-1.rds.amazonaws.com:5432/postgres"

def get_connection():
    """Establish database connection."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection failed: {e}")
        sys.exit(1)  # Exit CI/CD with failure

def get_tables():
    """Fetch all table names from the database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    tables = cursor.fetchall()
    cursor.close()
    conn.close()
    return [table[0] for table in tables]

def test_fetch_tables():
    """Test if tables are fetched correctly."""
    tables = get_tables()
    assert len(tables) > 0, "No tables found in the database"
    if len(tables) == 0:
        print("No tables found, failing CI/CD pipeline.")
        sys.exit(1)  # Exit CI/CD with failure

def test_primary_keys():
    """Ensure each table has a primary key."""
    conn = get_connection()
    cursor = conn.cursor()
    tables = get_tables()
    
    for table in tables:
        cursor.execute(f"""
            SELECT column_name FROM information_schema.key_column_usage
            WHERE table_name = '{table}'
        """)
        primary_keys = cursor.fetchall()
        assert len(primary_keys) > 0, f"Table {table} has no primary key!"
    
    cursor.close()
    conn.close()

def test_foreign_keys():
    """Ensure foreign keys reference existing tables."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT conrelid::regclass AS table_name, conname, confrelid::regclass AS referenced_table
        FROM pg_constraint WHERE contype = 'f'
    """)
    foreign_keys = cursor.fetchall()
    
    tables = get_tables()
    for table, constraint, ref_table in foreign_keys:
        assert ref_table in tables, f"Foreign key {constraint} in {table} references a non-existing table {ref_table}!"
    
    cursor.close()
    conn.close()

def test_data_integrity():
    """Ensure each table has at least some data."""
    conn = get_connection()
    cursor = conn.cursor()
    tables = get_tables()

    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        assert count > 0, f"Table {table} is empty!"

    cursor.close()
    conn.close()
