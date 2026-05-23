# CampusDiscovery — MVP Architecture

This project follows **Model–View–Presenter (MVP)** on both backend and frontend.

## Backend (Flask)

```
Back_end/
├── app.py                 # App factory — wires extensions + routes
├── config.py              # Configuration
├── extensions.py          # Shared DB instance
├── decorators.py          # role_required, etc.
├── models/                # MODEL — entities & serialization
├── repositories/          # MODEL — data access (queries)
├── services/              # PRESENTER — business logic
├── controllers/           # VIEW — HTTP routes (thin)
├── routes/                # Blueprint registration
├── seeds.py / init_db.py
```

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **Model** | `models/`, `repositories/` | `College`, `UserRepository.find_by_id()` |
| **Presenter** | `services/` | `CollegeService.create()`, `AuthService.login()` |
| **View** | `controllers/` | Parse request → call service → return JSON |

**Request flow:**  
`HTTP Request` → `controller` → `service` → `repository` → `database`

## Frontend (React)

```
Front_end/college/src/
├── models/                # MODEL — constants, domain helpers
├── services/              # MODEL — API & local data access
├── presenters/            # PRESENTER — hooks & auth orchestration
├── views/                 # VIEW — presentational components
├── pages/                 # Route containers (presenter + view)
├── components/            # Shared UI (navbar, buttons)
├── context/               # Global auth presenter state
```

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **Model** | `services/`, `models/` | `collegeService.list()`, `compareService` |
| **Presenter** | `presenters/`, `context/` | `useCollegeListPresenter()`, `AuthProvider` |
| **View** | `views/`, `components/` | `CollegeListView`, `AuthView` |

**UI flow:**  
`Page` → `useXPresenter()` → `XView` (props only, no API calls in views)

## Page mapping

| Route | Page | Presenter | View |
|-------|------|-----------|------|
| `/` | `pages/Home.jsx` | `useHomePresenter` | `views/home/HomeView` |
| `/auth` | `pages/Auth.jsx` | `useAuthPagePresenter` | `views/auth/AuthView` |
| `/colleges` | `pages/CollegeList.jsx` | `useCollegeListPresenter` | `views/colleges/CollegeListView` |
| Other routes | `pages/*.jsx` | logic in page (migrate to presenters as needed) | inline UI |

## Rules

1. **Views** never call `fetch` or `apiClient` directly.
2. **Services** never render UI.
3. **Controllers** never contain business rules — delegate to services.
4. **Repositories** never return HTTP responses.
