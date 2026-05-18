# Send Message To Users

This section provides guidance on sending messages to other users with Server Sent Events (SSE) within Xelflow flows.

## Structure

| Parameter            | Description                                                       |
|:---------------------|:------------------------------------------------------------------|
| **Event** (req, var) | Name of the event triggered on the client (e.g., `MessageSaved`). |
| **Data** (req, var)  | Object with the payload sent to the client.                       |
| **Users** (req, var) | List of user OIDs to send the message to.                         |
req = required, var = variable, opt = optional

for variable usage see [Reference: Variables](variables.md) for details.

## Examples
### Sending query results to a user
```
"get-userss-step": {
    "Id": "get-users-step",
    "Type": "QueryDatabase",
    "Parameters": {
        "Query": "SELECT oid FROM users"
    },
    "Alias": "userOids",
    "NextStepId": "send-types-step"
},
"send-types-step": {
    "Id": "send-types-step",
    "Type": "SendMessageToUsers",
    "Parameters": {
        "Event": "ItemChanged",
        "Users": "${userOids}",
        "Data": {
            "Item": "Some item",
            "ChangedBy": "${user.FirstName} ${user.LastName}"
        },
    },
    "NextStepId": null
}
```