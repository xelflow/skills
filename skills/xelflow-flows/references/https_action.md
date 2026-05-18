# HTTPS Action
This section provides guidance on sending an HTTP request to an external API. The `AuthenticationId` parameter is used to specify the authentication method to be used and is required for this action.

## Structure

| Parameter              | Description                                                             |
|:-----------------------|:------------------------------------------------------------------------|
| **Endpoint** (req)     | URL of the API.                                                         |
| **Method** (req)       | HTTP method (GET, POST, PUT, DELETE).                                   |
| **Headers** (opt, var) | Headers for the HTTP request.                                           |
| **Body** (opt, var)    | Body for the HTTP request.                                              |
| **ContentType** (opt)  | Content type of the HTTP request.                                       |
| **Stream** (opt)       | Response is a stream (`true` or `false`).                               |
| **StreamEvent** (opt)  | Event and Version sent per chunk of the stream, e.g. `StreamChunk@1.0`. |
req=required, opt=optional, var=variable

for variable usage see [Reference: Variables](variables.md) for details.

## Examples
### Send a request to an external API
```
"get-chat-result": {
    "Id": "get-chat-result",
    "Type": "HttpsAction",
    "Parameters": {
        "Endpoint": "https://openrouter.ai/api/v1/chat/completions",
        "Method": "POST",
        "Body": {
            "model": "openrouter/free",
            "messages": "${CONCAT(SystemPrompt,FILTER(event.data.messages,'item', NOT(EQUALS(item.user,'system'))))}"
        }
    },
    "Alias": "chat",
    "NextStepId": "send-user-step",
    "AuthenticationId": 1
},
```
### Send a request to an external API with streaming response
```
"get-chat-result": {
    "Id": "get-chat-result",
    "Type": "HttpsAction",
    "Parameters": {
        "Endpoint": "https://openrouter.ai/api/v1/chat/completions",
        "Method": "POST",
        "Body": {
            "model": "openrouter/free",
            "messages": "${CONCAT(SystemPrompt,FILTER(event.data.messages,'item', NOT(EQUALS(item.user,'system'))))}",
            "stream": true
        },
        "Stream": true,
        "StreamEvent": "SendChunk"
    },
    "Alias": "chat",
    "NextStepId": "send-user-step",
    "AuthenticationId": 1
},
```