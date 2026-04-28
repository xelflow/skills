---
name: xelflow-tables
description: "Create, validate, and migrate Xelflow table definitions using the official tables/rules.md schema."
version: 1.0.0
license: MIT
---

# Xelflow Tables Skill

This skill helps you create and maintain **Xelflow table definitions** and **database migrations** following the official schema rules defined in `tables/rules.md`.

It ensures:
- Correct table JSON structure
- Proper field definitions
- Valid constraints
- Correct migration scripts
- Compliance with Xelflow server syncing requirements

---

## Workflow
When modifying the database schema, it is **mandatory** to follow these steps:

1. **Identify the Requirement**: Determine what table definitions need to be implemented or changed.
2.  **Define or Update the Table Definition**::
    -   Table definition files are located in the `tables/` directory.
    -   Naming convention: `[TableName].json`.
3. **Create Migration Script**: Create a new JSON file in `tables/migrations/` (e.g., `YYYYMMDD_Description.json`).
    - Use the `Scripts` array to provide the SQL commands (e.g., `ALTER TABLE ... ADD ...`).
    - Use `IF NOT EXISTS` checks to ensure idempotency.
4. **Apply Changes**: Run `npm run sync-tables` from the project root. This will execute the scripts and move the migration file to `tables/migrations/processed/`.

## Folder Structure

- **/tables**: Contains table definitions for this project.
- **/tables/xelflow**: Contains table definitions needed for the Xelflow Flow Engine.
- **/tables/migrations**: Contains new migration files that need to be applied to the database.
- **/tables/migrations/processed**: Contains processed migration files that have been applied to the database.

## Table Definition Files

- **Naming**: `[TableName].json` (e.g., `Messages.json`).

## JSON Schema Key Elements

- **Name**: Name of the table entity.
- **Table**: Object defining the SQL table.
    - **Name**: SQL table name.
    - **Columns**: Array of column definitions.

## Column Properties

- **Name**: Column name.
- **Type**: SQL Data Type (e.g., `int`, `nvarchar(255)`, `datetime2`, `bit`).
- **IsPrimaryKey**: `true` if primary key.
- **IsIdentity**: `true` if auto-incrementing.
- **IsNullable**: `boolean`.
- **ForeignKey**: Object defining the foreign key.
    - **Table**: Name of the table that the foreign key references.
    - **Column**: Name of the column that the foreign key references.
- **DefaultValue**: SQL default value (e.g., `SYSUTCDATETIME()`, `0`).

## JSON Schema Key Elements Migrations

- **Name**: Name of the migration entity.
- **Scripts**: Array of SQL scripts to be executed.

## Syncing

- Run `npm run sync-tables` in the root to apply changes to the database.