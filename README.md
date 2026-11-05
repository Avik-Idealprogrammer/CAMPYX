# DDUGU Smart Campus

A public-facing landing page for the DDUGU Smart Campus pilot. The page contains no room availability, booking records, floor plans, or private notices.

## Run locally

Open `index.html` in a browser, or serve this directory with any static file server. No build step is required.

Install the locked test dependencies with `npm ci`, then run all syntax, HTML, and interaction checks with `npm run validate`. Build and run the container with:

```sh
docker build -t ddugu-smart-campus .
docker run --rm -p 8080:80 ddugu-smart-campus
```

Then open `http://localhost:8080`. The health endpoint is `http://localhost:8080/health` and the separate demo admin route is `http://localhost:8080/admin/login/`.

## Public content API

The landing page reads these same-origin, read-only endpoints:

- `GET /public/announcements?limit=5` returns only public notices with `title`, `body`, and `published_at`.
- `GET /public/news?limit=6` returns `headline`, `image_url`, `body`, and `published_at`.
- `GET /public/activities?limit=6` returns `title`, `image_url`, and `description`.

Configure the backend to enforce `is_public = true` on announcements, return only the listed public fields, and apply server-side rate limiting and caching. The page does not request buildings or operational data. When the API is unavailable, clearly labeled demo preview content is shown; empty successful responses get their own empty state.

## Content and assets

Replace the sample image assets in `assets/` with university-approved photographs before an official launch. The supplied hero image is only 259×194 pixels; use a high-resolution original for launch and confirm permission to use it. Activity and news imagery in this prototype is illustrative demo content. The DDU text mark is not an official logo; replace it with an approved logo after confirming permission. The campus diagram is a simple, non-interactive schematic, not an official map. The footer identifies the project as an independent developer prototype pending DDUGU approval.

## Authentication

Student and Faculty entry buttons open clearly labeled demo previews. Connect them to authenticated portals before deployment. Admin access is intentionally absent from the public landing page; hiding a link is not a security control. Enforce roles, rate limits, and audit logging on the backend.

## Student portal preview

`student-portal.html` is a front-end demonstration with fictional CSE Year 2 sample data. It has no login, session, API, or report submission. The interactive location view is a schematic reconstructed from labels in the supplied problem statement, not an official floor-plan asset; it flags discrepancies between the drawing and written room list. Confirm those against the university's full-resolution blueprints and room register before using the map operationally. Real student schedules, examination notices, issue reports, and notifications require authenticated APIs with server-side RBAC and group filtering.

## Faculty portal preview

`faculty-portal.html` demonstrates room search, a local natural-language parser, ranked recommendations, alternative slots, and booking create/cancel/reschedule flows against clearly labeled in-memory test records. Booking confirmation rechecks room overlap, capacity, permitted purpose, and the demo teaching schedule. This is not a reservation service: there is no authentication, database transaction, cross-user concurrency protection, or persistent audit trail. Production booking writes must enforce ownership and RBAC server-side and use an atomic database constraint/transaction to prevent concurrent overlaps.

## Admin portal preview

Open `/admin/login/` in a static-site server to enter the separate admin demo. It includes local room and building configuration, CSV import preview, faculty permission controls, booking management, schedule conflict review, announcement drafts and explicit publish review, issue resolution, simulated analytics, session audit history, and local booking-policy settings. The admin demo is not secured by its entry screen; do not use real records or treat client-side controls as authorization.

## CI, container, and operations

The GitHub Actions workflow runs syntax checks, booking-rule unit tests, HTML validation, and a Docker build. `Dockerfile` serves the static pages with Nginx, security headers, static-request limiting, and a `/health` endpoint. There is no deployment target configured, so CI does not publish or deploy an image. See [SECURITY-OPS.md](SECURITY-OPS.md) for production requirements and the PostgreSQL backup/restore procedure; database backups cannot run until a real database is configured.