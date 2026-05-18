---
name: xelflow-flows
description: Create, edit, and manage Xelflow Flows and Events. Trigger when the user wants to implement server-side business logic, create new flows, or modify existing flow JSON files in the `flows/` directory.
version: 1.0.3
license: MIT
---

# Xelflow Flows Skill

This skill helps you work with Xelflow Flow definitions. Xelflow uses JSON files to define business logic, which are then synchronized to a server.

## Workflow

1.  **Identify the Requirement**: Determine what business logic needs to be implemented or changed.
2.  **Define the Flow**:
    -   Flow files are located in the `flows/` directory.
    -   Naming convention: `[FlowName].json`.
3.  **Structure the JSON**:
    -   `Name`, `Version`, `Status` (Active/Inactive), `StartStepId`, `ErrorStepId`, `Steps`, and `Events`.
4.  **Implement Steps**: Choose appropriate step types:
    -   `QueryDatabase`: Execute SQL.
    -   `SendEmail`: SMTP emails.
    -   `SendMessageToUser`: SSE to client.
    -   `SendMessageToUsers`: SSE to other users.
    -   `SendNotification`: VAPID push notifications.
    -   `SendEvent`: Trigger other flows or continue parent flow.
    -   `HttpsAction`: External API calls.
    -   `ValidateContext`: Logic validation.
    -   `AddDataToContext`: Variable storage.
    -   `Decision`: Conditional branching.
5.  **Use of Variables**:
    -   Most step fields accept variables.
    -   See [Reference: Variables](references/variables.md) for details.
6.  **Define Events**:
    -   Events trigger flows. They include `Name`, `Version`, `Status`, `Roles`, and `Validation`.
7.  **Sync Changes**:
    -   Always remind the user to run `npm run sync-flows changed` after modifications.

## Reference: Step Parameters

### QueryDatabase
See [Reference: QueryDatabase](references/query_database.md).

### SendMessageToUser
See [Reference: SendMessageToUser](references/send_message_to_user.md).

### SendMessageToUsers
See [Reference: SendMessageToUsers](references/send_message_to_users.md).

### SendEmail
See [Reference: SendEmail](references/send_email.md).

### SendNotification
See [Reference: SendNotification](references/send_notification.md).

### SendEvent
See [Reference: SendEvent](references/send_event.md).

### HttpsAction
See [Reference: HttpsAction](references/https_action.md).

### Decision
See [Reference: Decision](references/decision.md).

## Events
Events trigger flows based on Name and Version. They often contain validation rules to ensure input is correct.

| Parameter                 | Description                                                                                                          |
|:--------------------------|:---------------------------------------------------------------------------------------------------------------------|
| **Id** (req)              | Always `null`, filled upon storage in the database.                                                                  |
| **Name** (req)            | Name of the event.                                                                                                   |
| **Version** (req)         | Version of the event.                                                                                                |
| **Status** (req)          | Status of the event (`Active` or `Inactive`).                                                                        |
| **Continuation** (opt)    | `true` when event is triggered by subflow.                                                                           |
| **Cron** (opt)            | Cron expression determining when this event is created by the scheduler, e.g. `0 13 * * *;1` (Once at 13:00 hours).  |
| **Roles** (opt)           | List of user roles that can execute this event.                                                                      |
| **Validation** (opt, var) | List of validations.                                                                                                 |
| **Data** (opt, var)       | The payload data associated with the event.                                                                          |
req=required, opt=optional, var=variable

### Validation Rules

First, it checks if an event is `Active` and if the user has the correct role. Use the `Validation` array to perform checks before the flow starts.

```json
{
  "Validation": [
    {
      "Check": "${NOT(EMPTY(event.data.email))}",
      "Message": "Email is required"
    }
  ]
}
```

## Examples

### Creating a simple SaveFlow
```json
{
  "Name": "SaveDataFlow",
  "Version": "1.0",
  "Status": "Active",
  "StartStepId": "save-step",
  "Steps": {
    "save-step": {
      "Id": "save-step",
      "Type": "QueryDatabase",
      "Parameters": {
        "QueryType": "Insert",
        "QueryTextType": "Text",
        "Query": "INSERT INTO MyTable (Value) VALUES (@Value)",
        "Parameters": { "Value": "${event.data.value}" }
      },
      "NextStepId": "notify-step"
    },
    "notify-step": {
      "Id": "notify-step",
      "Type": "SendMessageToUser",
      "Parameters": {
        "Event": "DataSaved",
        "Data": { "success": true }
      },
      "NextStepId": null
    }
  },
  "Events": [
    {
      "Name": "SaveData",
      "Version": "1.0",
      "Status": "Active"
    }
  ]
}
```

## Best Practices
- Always include an `ErrorStepId` to handle failures gracefully.
- Use `Alias` for steps to make context data more readable in subsequent steps.
- Use Event Roles to restrict access to specific events. 
- Validate input using the `Events.Validation` array.
- Synchronize flows using `npm run sync-flows changed` after any change.
