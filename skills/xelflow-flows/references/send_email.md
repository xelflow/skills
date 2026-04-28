# Send Email

This section provides guidance on sending emails within Xelflow flows. 

## Structure
Sends an email via the configured SMTP server. The `AuthenticationId` is mandatory.

| Parameter              | Description                             |
|:-----------------------|:----------------------------------------|
| **To** (req, var)      | Recipient of the email.                 |
| **From** (req, var)    | Sender of the email.                    |
| **Subject** (req, var) | Subject of the email.                   |
| **Body** (req, var)    | Content (supports HTML and variables).  |
| **IsHtml** (opt)       | Set to `true` to send the body as HTML. |
req = required, var = variable, opt = optional

## Examples
### Send error email
```
"error-step": {
  "Id": "error-step",
  "Type": "SendEmail",
  "Parameters": {
    "To": "info@wimmen.nl",
    "From": "info@xelflow.com",
    "Subject": "Notification Failed",
    "Body": "Failed to send notification ${error}"
  },
  "NextStepId": null,
  "AuthenticationId": 2
}
```
### Send delete email
```
"send-email": {
  "Id": "send-email",
  "Type": "SendEmail",
  "Parameters": {
    "To": "info@wimmen.nl",
    "From": "info@xelflow.com",
    "Subject": "Verzoek Account Verwijderen",
    "Body": "De volgende gebruiker heeft verzocht om zijn account te verwijderen:\n\nNaam: ${UserInfo.0.FirstName} ${UserInfo.0.LastName}\nEmail: ${UserInfo.0.Email}\nOid: ${principal.userId}"
  },
  "NextStepId": "success-to-user-step",
  "AuthenticationId": 2
},
```