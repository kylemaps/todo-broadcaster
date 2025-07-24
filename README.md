# Todo Broadcaster Service

This repository contains the source code for the `broadcaster` microservice.

## Purpose

This service acts as a notification bridge. It listens for events published by the `todo-backend` and forwards them as formatted messages to an external platform (e.g., Discord).

This creates a decoupled, event-driven architecture where the core backend does not need to know about the notification system.

## Technology

*   **Framework**: Node.js
*   **Eventing**: Subscribes to the `todos.events` subject on a NATS server.

### Key Environment Variables

*   `NATS_URL`: The URL of the NATS messaging server.
*   `DISCORD_WEBHOOK_URL`: The webhook URL for the Discord channel to post notifications to.

### Staging Mode

If the `DISCORD_WEBHOOK_URL` environment variable is not set, the service will automatically run in a **log-only mode**. In this mode, it will print the events it receives to the console instead of sending them to Discord, which is ideal for staging and testing environments.

---

*This is an application source code repository. The Kubernetes configuration for this service is managed in the central `todo-config` repository.*