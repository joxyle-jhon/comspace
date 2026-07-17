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

---

## Local Development Setup

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
