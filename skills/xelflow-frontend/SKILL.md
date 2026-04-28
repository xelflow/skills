---
name: xelflow-frontend
description: "Create SSE connection with the Xelflow Server and send events."
version: 1.0.0
license: MIT
---

# Xelflow Frontend Skill

This skill helps you work with Xelflow Server events and SSE.

## Workflow
1.  **Get ConnectionId**: Get a unique identifier for the SSE connection.
2.  **Create SSE stream**: Setup the SSE stream.
3.  **Send Event**: Send an event to the Xelflow Server.
4.  **Get Data**: React to events on the SSE stream.

## Usage
### Get ConnectionId
Start with a call to `/api/connections`. This will return a unique identifier, the connectionId.
One special case: If the call returns a 202, it means that the user is not yet known to the server.
Usually this means that the user needs to register before continuing.

### Create SSE stream
To create an SSE stream, make a GET request to `this.XELFLOW_API_URL + /api/events/stream?connectionId=${connectionId}`. This will return an SSE stream that you can listen to.
When the SSE stream gets an error, get a new connectionId and setup the SSE stream again.

### Send Event
To send an event to the Xelflow Server, make a POST request to `/api/events`. The body of the request should be a JSON object with the event data.
If the response is not successful, check for validation errors in the response.
The event starts a new flow.

### Get Data
To get data from the SSE stream, register a listener for the expected server event.
The flow normally has a server event for the success and failure of the flow, add a listener for both events.

##Examples
### Angular 21+
A typescript framework like Angular 21+ will use a service to manage the connection to the Xelflow Server. See [angular-connection-service.md](references/connection.service.ts) for an example.

### JavaScript
When using JavaScript without a framework.
Get connectionId:
`
async function initConnection() {
  try {
    const res = await fetch(```${BASE_URL}/connections```);
    if (res.ok || res.status === 202) {
      state.connectionId = await res.json();
      connectSSE();
      if (res.status === 202) { 
        handleNewConnection();
      } else {
        requestInitialData();
      }
    } else {
      console.error('Connection failed', res);
      setTimeout(initConnection, 3000);
    }
  } catch (e) {
    console.error('Connection failed', e);
    setTimeout(initConnection, 3000);
  }
}
`
Create SSE stream:
`
function connectSSE() {
  const eventSource = new EventSource(```${SSE_URL}?connectionId=${state.connectionId}```);
  eventSource.onopen = () => {
    console.log('Connection opened');
  };
  eventSource.addEventListener('FlowError', (e) => {
    const data = JSON.parse(e.data);
    if (data && data.Error && data.Error.includes('already subscribed')) {
       showToast("Dit emailadres is al aangemeld.", "error");
    } else {
       showToast("Er is iets misgegaan via de server", "error");
    }
  });

  eventSource.addEventListener('FlowData', (e) => {
    const data = JSON.parse(e.data);
    showToast("Flow succesvol!", "success");
    // DO something with the data
  });
}
`

Send event:
`
async function sendEvent(eventName, data) {
  const payload = {
    connectionId: state.connectionId,
    event: eventName,
    version: '1.0',
    data: data
  };

  const response = await fetch(`${BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    showToast(errorText, "error");
  }
}
`

