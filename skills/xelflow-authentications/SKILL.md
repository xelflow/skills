---
name: xelflow-authentications
description: "Create, validate Xelflow authentication definitions"
version: 1.0.0
license: MIT
---

# Xelflow Authentications Skill

This skill helps you create and maintain **Xelflow authentication definitions**.

It ensures:
- Correct JSON structure
- Proper field definitions
- Compliance with Xelflow server syncing requirements

# Authentications Guidelines

The `authentications.json` is located in the `authentications` directory, it contains the Authentications definition file in JSON format.
The id is used in flows in the authenticationId property.
The type of the authentication matches the flow step type.
Do NOT store api keys or secrets in the authentications.json file.
The default database authentication is always `"id": 0`.
When adding a new authentication, always notify the user to create the authentication in the Xelflow Admin Panel.

## JSON Schema Key Elements

- **Id**: Id of the authentication.
- **Name**: Name of the authentication.
- **Type**: Type of the authentication. Currently supported types are:
  - `QueryDatabase`
  - `SendNotification`
  - `SendEmail`
  - `HttpsAction`

## Syncing

- The authentications should be added manually in the Xelflow Admin Panel. 
