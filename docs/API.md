# SmartWorker Connect API

Base URL: `http://localhost:5000/api`

## Authentication

### POST /auth/register
Create a user account (client or worker).

Request body:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "client|worker",
  "languages": ["Arabic"],
  "location": { "address": "Casablanca" }
}
```

### POST /auth/login
Returns access and refresh tokens with user profile.

---

## Worker resources

### GET /workers
List worker profiles sorted by rating.

### GET /workers/:id
Retrieve a specific worker profile.

### PUT /workers/me
Create or update the authenticated worker profile.

### POST /workers/me/portfolio
Upload a portfolio media asset (multipart/form-data `file`).

## Project resources

### POST /projects
Create a new project. Requires client or admin token.

### GET /projects
List projects filtered by the requester role.

### PATCH /projects/:id/assign
Assign a worker to a project.

### PATCH /projects/:id/status
Update project workflow status.

## Matching

### POST /match
Return ranked professionals for a project or coordinates.

Request body:
```json
{
  "projectId": "string",
  "location": { "lat": 33.6, "lng": -7.6 },
  "specialization": ["Smart Home"]
}
```

## Messaging & Reviews

- `GET /messages/:chatId` – fetch chat history.
- `POST /messages` – send a message between two users.
- `POST /reviews` – submit a worker review after a project.
- `GET /reviews/worker/:workerId` – list worker feedback.

## Admin

- `GET /admin/stats` – high-level metrics.
- `GET /admin/users` – list users (admin only).
- `GET /admin/workers` – review worker profiles.

Swagger UI: `http://localhost:5000/docs`
