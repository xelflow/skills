---
name: xelflow-sse-debug
description: "Debugging xelflow events"
version: 1.0.0
license: MIT
---

# Xelflow SSE Debug Skill
This skill will help you understand how to debug xelflow events.

## Workflow
Debugging xelflow events is different than debugging a regular api call. It requires understanding of server-sent events (SSE).
Follow these steps to debug Xelflow Server communication errors:
1. Open the developer console in your browser.
2. Open the network tab.
3. Look for a POST request to the `events` endpoint.
4. The response should be 200 'Accepted'. When there is another response, look for the error message in the body.
5. Look for the SSE Stream in the network tab. `stream?connectionId=<<connectionId>>`
6. See the EventStream in the developer console. There is 1 event per SSE message. The type is the event name, Data is the event payload.
7. If the correct event is not being received, check the flow.
8. If the correct event is being received, check if the listener for that event is added to the eventSource in code.
