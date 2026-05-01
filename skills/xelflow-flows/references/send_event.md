# Send Event

This flow step sends a event that can be used to trigger other flows.

## Structure

| Parameter                        | Description                                                                                                                                                        |
|:---------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Name** (req, var)              | Name of the event triggered on the server.                                                                                                                         |
| **Version** (req, var)           | Version of the event triggered on the server.                                                                                                                      |
| **List** (opt, var)              | For sending multiple events, a list can be specified, e.g. `${subscriptions}`. The list is also used for retrieving variables, e.g. `${subscriptions.*.Endpoint}`. |
| **ContinuationEvent** (opt, var) | Event sent back from the started flow. Data is added to the context.                                                                                               |
| **CorrelationId** (opt, var)     | Combination of GUID and index identifying which flow and list id this event belongs to.                                                                            |
| **MaxConcurrency** (opt)         | Number of events sent simultaneously (Default 1, range `1` to `5`).                                                                                                |
| **ContinueOnFailure** (opt)      | If `false`, the flow stops if an event fails. If `true`, the flow continues to the next event (Default `false`).                                                   |
| **Error** (opt, var)             | Error message if the flow failed and the parent flow must be notified                                                                                              |
| **Data** (req, var)              | Object with the payload sent with the event.                                                                                                                       |
req=required, var=variable, opt=optional

## Cases
### Start flow fire and forget
Only specify the `Name` and `Version` parameters and optionally the `Data` parameter.
### Start flow wait for response
Specify the `Name`, `Version` and `ContinuationEvent` parameters and optionally the `Data` and `ContinueOnFailure` parameter.
The flow is paused until the `ContinuationEvent` is received. The `ContinuationEvent` must be added to the events list of the flow with `Continuation` = `true`.
The childflow that is started with the Event must return with a SendEvent step with the `Name` and `Version` of the `ContinuationEvent` the correlation id must be set to `@@{event.correlationId}`, optional `Data` and `Error` parameters.
When the childflow returns with a `ContinuationEvent` with an error, the flow is stopped unless `ContinueOnFailure` is set to `true`.
## Start flow with list
Specify the `Name`, `Version`, `List` and `ContinuationEvent` parameters and optionally the `Data`, `ContinueOnFailure` and `MaxConcurrency` parameters.
The flow is paused until all the `ContinuationEvent` are received. The `ContinuationEvent` must be added to the events list of the flow with `Continuation` = `true`.
The childflow that is started with the Event must return with a SendEvent step with the `Name` and `Version` of the `ContinuationEvent` the correlation id must be set to `@@{event.correlationId}`, optional `Data` and `Error` parameters.
When the childflow returns with a `ContinuationEvent` with an error, the flow is stopped unless `ContinueOnFailure` is set to `true`.

## Examples
### Simple event
```
  "log-event": {
    "Id": "log-event",
    "Type": "SendEvent",
    "Parameters": {
      "Name": "log-event",
      "Version": "1.0",
      "Data": {
        "id": ${tiems.0.id},
        "status": "completed"
      }
    },
    "NextStepId": null
  },
```
### Event with List
```
"send-notifications-step": {
    "Id": "send-notifications-step",
    "Type": "SendEvent",
    "Parameters": {
        "Name": "send-push",
        "Version": "1.0",
        "List": "${subscriptions}",
        "ContinuationEvent": "send-push-completed",
        "MaxConcurrency": "5",
        "ContinueOnFailure": "true",
        "Data": {
            "endpoint": "${subscriptions.*.Endpoint}",
            "p256dh": "${subscriptions.*.P256dh}",
            "auth": "${subscriptions.*.Auth}",
            "title": "Nieuwe meting: ${typeInfo.0.Name}",
            "body": "Er is een nieuwe waarde ingevoerd: ${event.data.Value} ${typeInfo.0.Unit}",
            "icon": "/assets/icons/icon-72x72.png",
            "badge": "/assets/icons/icon-72x72.png",
            "data": "${event.data.TypeId}"
        }
    },
    "NextStepId": null
},
```
### Continuation event
```
  "new-notification-completed": {
    "Id": "new-notification-completed",
    "Type": "SendEvent",
    "Parameters": {
      "Name": "new-notification-completed",
      "Version": "1.0",
      "CorrelationId": "${event.correlationId}",
      "Error": "${error}"
    },
    "NextStepId": null,
    "AuthenticationId": 0
  },
```

