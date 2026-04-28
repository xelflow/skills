# Send Message To User

This section provides guidance on sending messages to users with Server Sent Events (SSE) within Xelflow flows.

## Structure

| Parameter            | Description                                                       |
|:---------------------|:------------------------------------------------------------------|
| **Event** (req, var) | Name of the event triggered on the client (e.g., `MessageSaved`). |
| **Data** (req, var)  | Object with the payload sent to the client.                       |
req = required, var = variable, opt = optional

## Examples
### Sending query results to a user
```
"send-types-step": {
    "Id": "send-types-step",
    "Type": "SendMessageToUser",
    "Parameters": {
        "Event": "TypesLoaded",
        "Data": "${types}"
    },
    "NextStepId": null
},
```
### Sending a message to a user
```
"error-step": {
  "Id": "error-step",
  "Type": "SendMessageToUser",
  "Parameters": {
    "Event": "FlowError",
    "Data": {
      "Message": "Failed to retrieve types",
      "Status": "Failed",
      "Error": "${error}"
    }
  },
  "NextStepId": null
}
```