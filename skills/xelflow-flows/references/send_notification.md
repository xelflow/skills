# Send Notification

This flow step sends a notification to a specified recipient using the VAPID protocol. It can be used to notify users about important events or updates within your application.

## Structure

| Parameter               | Description                                 |
|:------------------------|:--------------------------------------------|
| **Endpoint** (req, var) | Endpoint of the client.                     |
| **P256dh** (req, var)   | P256dh of the client.                       |
| **Auth** (req, var)     | Auth of the client.                         |
| **Message** (req, var)  | Object with the payload sent to the client. |
req=required, var=variable, opt=optional

for variable usage see [Reference: Variables](variables.md) for details.

## Example
```
"send-notification": {
    "Id": "send-notification",
    "Type": "SendNotification",
    "Parameters": {
      "Endpoint": "${event.data.endpoint}",
      "P256dh": "${event.data.p256dh}",
      "Auth": "${event.data.auth}",
      "Message": {
        "Title": "${event.data.title}",
        "Body": "${event.data.body}",
        "Icon": "${event.data.icon}",
        "Badge": "${event.data.badge}",
        "Data": "${event.data.data}"
      }
    },
    "NextStepId": "new-notification-completed",
    "AuthenticationId": 1
  },
```
