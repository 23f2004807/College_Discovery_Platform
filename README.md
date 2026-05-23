# CampusDiscovery — College Discovery Platform

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the **MVP (Model–View–Presenter)** structure.

## Database: PostgreSQL (required for production)

All college data lives in **PostgreSQL**. The frontend only calls the API — no dummy college data in React.

### 1. Start PostgreSQL (Docker)

```bash
docker compose up -d
```

### 2. Initialize & seed database

```bash
cd Back_end
pip install -r requirements.txt
copy .env.example .env
python init_db.py
```

This creates tables and seeds **10 colleges** with cutoffs and reviews.

### 3. Run backend

```bash
cd Back_end
python app.py
```

API: `http://localhost:5000/api`

### 4. Run frontend

```bash
cd Front_end/college
npm install
npm run dev
```

App: `http://localhost:5173`

---

## Auth

| Role | Sign in at `/auth` | Credentials (auto-created on app start) |
|------|---------------------|----------------------------------------|
| User | → redirects to `/colleges` | `user@college.com` / `UserPass123!` |
| Admin | → redirects to `/admin` | `admin@college.com` / `AdminPass123!` |

**College data** lives only in `Back_end/seed_data/colleges_seed_data.py` and is loaded into the database automatically when the app starts (if the colleges table is empty). The frontend fetches everything from the API — no dummy college data in React.

**Registration fields:** Full name, phone, email, password, School vs College, field (Engineering, Medical, Arts, etc.)

**Admin dashboard** (`/admin`): Add, edit, delete colleges and cutoffs — all saved to PostgreSQL.

---

## SQLite fallback (dev only)

If PostgreSQL is unavailable, add to `Back_end/.env`:

```
USE_SQLITE=true
```

Then run `python init_db.py` again.
