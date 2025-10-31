# Store Rating Platform

Welcome to the Store Rating Platform — a small full-stack application for managing stores, store owners, and user ratings. This README will get new (and returning) contributors set up quickly and show the main features.

---

## ⚡ What this project includes

- Client: React + Vite + Tailwind CSS + DaisyUI
- Server: Express.js + Sequelize (Postgres) + JWT auth
- Roles: Admin, Store Owner, User
- Features:
  - Admin dashboard: manage users and stores
  - Create store owners and stores (admin flow)
  - Users can view stores and submit ratings
  - Store owners have a dashboard to manage their store
  - Authentication and protected routes (JWT)

---

## 🚀 Quick start (development)

This repo contains two separate apps — `client` and `server`. You'll run both during development.

Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node)
- PostgreSQL database (or a hosted Postgres instance)

1) Clone the repo

```bash
# from your workspace (example path)
cd C:\Users\<you>\path\to\store-rating-platform
```

2) Install dependencies for client and server

```bash
# client
cd client
npm install

# in a separate terminal: server
cd ../server
npm install
```

3) Configure environment variables

Create a `.env` file in the `server` folder (copy `.env.example` if provided). At a minimum set:

```
PORT=5000
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret_here
```

If you need to run Postgres locally, create a database and point `DATABASE_URL` to it.

4) Start the backend and frontend

```bash
# in server folder
npm run dev

# in client folder
npm run dev
```

- By default the client uses `http://localhost:5000/api` as the API base URL (see `client/src/services/api.js`).
- The client dev server runs at `http://localhost:5173` (Vite default) unless changed.

---

## 🧩 Scripts

Client (`client/package.json`)
- `npm run dev` — start Vite dev server
- `npm run build` — build production bundle
- `npm run preview` — preview built app

Server (`server/package.json`)
- `npm run dev` — start server with nodemon
- `npm start` — start server with node

---

## 🧭 API Endpoints (high level)

Important admin endpoints (server expects Bearer token from admin account):

- `GET /api/admin/dashboard` — dashboard stats
- `POST /api/admin/users` — create a user (body: `{name,email,password,address,role}`)
- `POST /api/admin/stores` — create a store (body: `{name,email,address,ownerId}`)
- `GET /api/admin/users` — list users
- `GET /api/admin/stores` — list stores

Auth endpoints (public):
- `POST /api/auth/signup` — create an account
- `POST /api/auth/login` — login and receive token

Client services use `client/src/services/api.js` which attaches the JWT token from `localStorage` automatically.

---

## 🧪 How to test the main flows

1. Create an admin account (manually via DB or Signup + elevate role in DB). The backend protects admin routes with a role check.
2. Login in the client UI, the token is stored in `localStorage`.
3. Go to Admin Dashboard (top-right -> Dashboard) and create a new Store Owner and Store from the "Stores" tab.
4. Log in as the store owner to verify ownership and access to owner dashboard.
5. As a regular user, browse stores and add ratings.

---

## ✅ Notes & tips

- If the UI shows blank text in inputs: Tailwind/DaisyUI theme or custom CSS may be overriding input text color. Add classes like `px-3 py-2 text-gray-900 placeholder-gray-500` to inputs, or inspect `client/src/index.css` / `client/src/App.css` for global overrides.
- The client expects the API at `http://localhost:5000/api`. If your server runs on a different host/port, change `client/src/services/api.js`.
- Database migrations and seeding are not included by default — use Sequelize CLI or run the app with an empty DB; the models sync in code if configured.

---

## ✨ Features (made awesome)

- Clean admin UI with quick actions for user & store management
- Two-step store creation: admin creates a store owner and then the store is linked to that owner
- Role-based access control (admin / store_owner / user)
- Responsive UI built with Tailwind + DaisyUI components

---

## 📸 Screenshots / demo

Below are a few screenshots from the app (click to enlarge). Images were added to the project root — if you move them, update the paths accordingly.

<div style="display:flex;flex-wrap:wrap;gap:12px">

![Admin Dashboard](./Screenshot%202025-10-31%20112850.png){width="400" height="250"}
<div style="max-width:400px"><strong>Admin Dashboard</strong><br/>Overview cards and quick access to Users / Stores.</div>

![Add Store (owner step)](./Screenshot%202025-10-31%20112935.png){width="400" height="250"}
<div style="max-width:400px"><strong>Add Store (Owner)</strong><br/>Create a store owner and link a store to them.</div>

![Store List](./Screenshot%202025-10-31%20113019.png){width="400" height="250"}
<div style="max-width:400px"><strong>Store List</strong><br/>List of stores with ratings and owner info.</div>

![User Management](./Screenshot%202025-10-31%20113100.png){width="400" height="250"}
<div style="max-width:400px"><strong>User Management</strong><br/>Create and edit users, change roles.</div>

</div>

If you prefer the screenshots inside `client/public/` (served by Vite) move them there and update paths to `/Screenshot%20...`.

---

## 🛠 Troubleshooting

- Backend 500 errors: check server logs (console) for stack traces. Ensure database connection string is correct.
- 401 / unauthorized: ensure `localStorage.token` is set (client automatically stores it after login). If token expired, log in again.
- Port conflicts: change the server `PORT` env var or the Vite dev port via `vite.config.js`.

---

## 🙌 Contributing

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description

---



