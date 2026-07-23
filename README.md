# Comspace

Comspace is a modern, full-stack property booking platform (Airbnb-style) built with a focus on premium UI/UX, robust backend architecture, and safe concurrency handling.

## Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom design system, no default grays/blues)
- **State Management:** Zustand (Auth persistence) & TanStack React Query (Data fetching & caching)
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend

- **Framework:** Laravel 11 (API-only)
- **Language:** PHP 8.3
- **Database:** PostgreSQL
- **Cache/Queue:** Redis
- **Authentication:** Laravel Sanctum
- **Testing:** Pest (Feature & Unit tests)

## Architecture Highlights

- **Concurrency Safety:** The `BookingService` utilizes PostgreSQL row-level locking (`SELECT FOR NO KEY UPDATE`) within atomic transactions to guarantee that overlapping bookings (race conditions) are impossible.
- **Financial Accuracy:** All monetary values are stored and calculated in cents to prevent floating-point errors.
- **API Contracts:** Consistent JSON responses via Laravel API Resources.
- **Design System:** A distinct, warm neutral color palette with custom typography (Outfit and Inter) for a premium, non-templated feel.

## Docker Setup (Containerized)

### Prerequisites

- Docker & Docker Compose

### 1. Development Setup (Hot Reloading & Local Debugging)

```bash
# Copy template env file
cp .env.example .env

# Generate a unique APP_KEY and set required secrets in .env
# Set DB_PASSWORD=secretpassword (or your preferred dev password)
# Set APP_KEY (e.g. run: php -r 'echo "APP_KEY=base64:".base64_encode(random_bytes(32))."\n";')

# Launch stack with development overrides (hot-reloading Next.js, dev Laravel tools, Mailpit)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# Run database migrations
docker compose exec backend php artisan migrate
```

- **Frontend Application (Hot Reloading)**: `http://localhost:3000`
- **Backend API & Health Check**: `http://localhost:8000/up`
- **Mailpit Web UI (Email Testing)**: `http://localhost:8025`

### 2. Production Deployment

```bash
# Set production secrets inside .env (APP_ENV=production, APP_DEBUG=false, unique APP_KEY & DB_PASSWORD)
cp .env.example .env

# Build and launch immutable production stack
docker compose up -d --build

# Run production database migrations
docker compose exec backend php artisan migrate --force

# Verify container health status
docker compose ps
```

---

## Local Development Setup (Native Host)

### Prerequisites

- PHP 8.3+
- Node.js 18+
- PostgreSQL
- Redis
- Composer

### 1. Backend Setup (Laravel API)

```bash
cd backend

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Configure your database inside .env:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=comspace_db
# DB_USERNAME=your_user
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Start the server (runs on port 8000)
php artisan serve
```

### 2. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Make sure NEXT_PUBLIC_API_URL points to your backend (http://localhost:8000/api)

# Start the development server (runs on port 3000)
npm run dev
```

## Running Tests

The backend features an extensive test suite using Pest, specifically ensuring that the booking conflict logic holds up under various scenarios.

```bash
cd backend
php artisan test
```

## License

MIT
