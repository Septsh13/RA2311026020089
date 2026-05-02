# Notification System Design

## Architecture Overview

The frontend is a Next.js App Router application located in `notification_app_fe`.
It uses TypeScript for type safety and Material UI for all interface elements.
Pages are server-rendered so private environment values, including `ACCESS_CODE`,
remain on the server and are not exposed in browser UI or client bundles.

Main modules:

- `src/app/page.tsx`: all notifications page.
- `src/app/priority/page.tsx`: priority-sorted notifications page.
- `src/components/NotificationCard.tsx`: reusable notification display card.
- `src/components/FilterBar.tsx`: reusable type filter controls.
- `src/services/api.ts`: registration, authentication, token storage, and notification fetching.
- `src/services/logger.ts`: mandatory frontend logging middleware.

## API Flow

On page load, the application runs the following server-side flow:

1. `register()` posts the configured access code to the evaluation service.
2. `getAuthToken()` requests an auth token and stores it in module memory.
3. `fetchNotifications(limit, page, type)` calls the notifications API with pagination and optional type filter.
4. The page renders the returned notifications using Material UI components.

The API base URL is:

```text
http://20.207.122.201/evaluation-service
```

The auth token is stored only in memory inside `src/services/api.ts`. It is not written to local storage, session storage, cookies, or the UI.

## Logging Design

The logging middleware is implemented in `src/services/logger.ts` as:

```ts
Log(level, packageName, message)
```

It sends logs to:

```text
POST /evaluation-service/logs
```

Every log includes:

- `stack: "frontend"`
- `level`
- `package`
- `message`

The project does not use `console.log`. Logging failures are swallowed so that telemetry issues do not break the user experience.

## Filters And Pagination

Both pages support filtering by:

- Placement
- Result
- Event

Pagination is implemented through URL query parameters and API parameters:

- `limit`
- `page`
- `type`

This keeps the page state shareable and makes refresh behavior predictable.

## Priority Logic

The priority page sorts notifications by business importance first:

1. Placement
2. Result
3. Event

When two notifications have the same type, they are sorted by timestamp with the latest notification first.
