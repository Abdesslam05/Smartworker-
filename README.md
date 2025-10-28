# SmartWorker Connect

SmartWorker Connect is a full-stack platform that matches homeowners and businesses with vetted electrical and smart-home
professionals across Morocco. The solution combines a modern React/Next.js frontend with a secure Node.js/Express API and
MongoDB database layer.

## Features

- 🔐 JWT authentication with role-based access for clients, workers, and administrators
- 📍 Location-aware matching using geocoded addresses and a configurable scoring algorithm
- 💬 Real-time messaging via Socket.io plus email-style activity notifications
- ⭐ Review and rating workflows that feed directly into worker reputation scoring
- 🗂️ Worker portfolio management with optional S3 uploads
- 📊 Admin dashboard to monitor growth, verify professionals, and moderate content
- 🧭 Responsive, mobile-first UI inspired by Upwork/Houzz marketplaces

## Project structure

```
.
├── backend/   # Express + TypeScript API, Socket.io, Swagger docs
├── frontend/  # Next.js 14 app router, Tailwind UI
└── docs/      # ERD diagram & REST API reference
```

## Getting started locally

1. Clone the repository and install dependencies in both apps:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Copy environment examples and fill secrets (MongoDB URI, JWT keys, AWS credentials, Google Maps key, etc.).
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Start the API:
   ```bash
   cd backend
   npm run dev
   ```
4. In a new terminal start the Next.js frontend:
   ```bash
   cd frontend
   npm run dev
   ```
5. Open `http://localhost:3000` and log in or register as a client/worker. Swagger docs are available at
   `http://localhost:5000/docs`.

### Docker Compose (optional)

A production-friendly Docker Compose stack is included:

```bash
docker compose up --build
```

This launches the API, frontend, and MongoDB containers with hot reload for development.

## Matching algorithm

Workers are scored using a weighted formula that prioritises ratings, experience, and proximity. Fine-tune weights inside
`backend/src/utils/matching.ts` to adjust marketplace behaviour.

```
score = 0.5 * rating + 0.3 * experienceYears + 0.2 * (1 / distanceKm)
```

## Documentation

- [Entity relationship diagram](docs/ERD.md)
- [REST API reference](docs/API.md)

## Publishing to GitHub

If you received this project as a code bundle and want to publish it to a new GitHub repository, follow these steps:

1. [Create an empty repository](https://github.com/new) on GitHub without initialising it with a README or `.gitignore`.
2. In your local project directory, initialise Git and set the default branch (replace `main` with your preferred branch name):
   ```bash
   git init
   git checkout -b main
   ```
3. Add all files and commit them:
   ```bash
   git add .
   git commit -m "Initial commit"
   ```
4. Point the local repository to the GitHub remote you created earlier:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   ```
5. Push the branch to GitHub:
   ```bash
   git push -u origin main
   ```

After the push completes, refresh the repository page on GitHub to see the project files. From there you can enable pull requests, branch protections, or CI/CD workflows as needed.

## Roadmap

- Worker subscription tiers (free, pro, verified)
- In-app payments and dispute management
- AI-assisted skill matching with natural-language project parsing
- Analytics dashboard for marketplace insights
