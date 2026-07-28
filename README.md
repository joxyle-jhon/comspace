# Comspace 🏡

**Comspace** is a modern, full-stack property booking platform (Airbnb-style) built with a focus on editorial nomad luxury design, robust backend architecture, and bulletproof concurrency handling for property reservations.

---

## 🎨 Design Identity — Warm Editorial & Nomad Luxury

Comspace features a custom-crafted design system moving away from generic default UI templates:
- **Palette:** Warm Terracotta (`#FF5A1F`) primary accents paired with Warm Linen (`#FDFBF9`) backgrounds and refined neutral surface tones.
- **Typography:** Modern pairing using **Outfit** for editorial display headlines and **Inter** for crisp UI body copy.
- **Motion & Micro-interactions:** Smooth physics-based inertia scrolling powered by **Lenis**, visual animation effects with **GSAP** and **Framer Motion**, and dynamic visual feedback.
- **Responsive Layout:** Adaptive split-screen auth flows, mobile navigation drawers with backdrop blur, and desktop-optimized multi-column property grids.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router with React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (Custom design tokens, custom select dropdowns, zero default grays)
- **State Management:** Zustand (Auth persistence & global app state)
- **Data Fetching & Caching:** TanStack React Query v5
- **Animations:** Framer Motion, GSAP & Lenis smooth scroll
- **Charts & Data Viz:** Recharts (Host revenue analytics)
- **Payment Integration:** Stripe Elements (`@stripe/stripe-js`, `@stripe/react-stripe-js`)
- **Notifications:** React Hot Toast
- **Icons:** Lucide React

### Backend
- **Framework:** Laravel 13 (API-only architecture)
- **Language:** PHP 8.3
- **Database:** PostgreSQL (with SQLite support for rapid local testing)
- **Cache & Queue:** Redis (`predis/predis`)
- **Authentication:** Laravel Sanctum (Token-based API auth)
- **API Querying:** Spatie Laravel Query Builder
- **Payments & Webhooks:** Stripe PHP SDK (`stripe/stripe-php`)
- **Testing:** Pest 4 (Feature & Unit test suite)
- **Code Quality:** Laravel Pint (PSR-12 / Laravel code standards)

---

## ✨ Key Features & Implementation Modules

### 👤 Authentication & User Management
- **Token Auth:** Secure registration, login, and token storage via Laravel Sanctum & Zustand.
- **Security & Rate Limiting:** Login route protected by Laravel `ThrottleRequests` (max 5 attempts/min).
- **Form Validation:** Dedicated FormRequest classes ensuring email uniqueness and strong passwords.
- **OAuth Ready:** Google OAuth integration flow ("Continue with Google").
- **User Profile:** Dedicated profile management page (`/profile`) for updating personal info and passwords.

### 🔍 Property Search & Discovery
- **Advanced Filtering:** Query properties by location (ILIKE search), date range, guest count, property type, price range (min/max), amenities, and instant booking availability.
- **Optimized Queries:** Efficient pagination (12 items/page) with eager loading (`images`, `amenities`, `host`) to eliminate N+1 database queries.
- **Interactive UI:** Category filter pills, custom accessible dropdowns, and responsive search bar overlays.

### 🏡 Property Detail & Price Preview
- **Editorial Layout:** 5-photo CSS grid presentation, detailed host information card, and category-grouped amenities list.
- **Live Price Preview:** Real-time calculation API (`GET /api/properties/{id}/price-preview`) detailing nightly breakdown, subtotal, cleaning fee, service fee, and total in cents.
- **Booking Widget:** Interactive check-in/check-out date picker with guest count adjustment.

### 💳 Multi-Step Checkout & Bookings
- **Checkout Stepper:** 3-step checkout flow (`/bookings/new`): Review Booking → Stripe Elements Payment → Instant Confirmation.
- **Guest Bookings List:** Comprehensive view (`/bookings`) with status badges (*Pending*, *Confirmed*, *Cancelled*, *Completed*).
- **Interactive Reviews:** Integrated review modal allowing guests to submit 1-5 star ratings alongside sub-ratings (Cleanliness, Accuracy, Communication, Location, Value).

### 📊 Host Dashboard & Property Operations
- **Host Analytics:** Dashboard (`/host/dashboard`) presenting key stats (Total Revenue, Active Bookings, Listed Properties, Average Rating) with Recharts revenue graphs.
- **Property Management:** Full CRUD operations for host listings (`/host/properties`, `/host/properties/new`, `[id]/edit`).
- **Availability Date Blocking:** Endpoint (`POST /api/properties/{id}/availability`) allowing hosts to block calendar dates for maintenance or personal use.
- **Host Review Replies:** Endpoint (`POST /api/reviews/{id}/reply`) allowing hosts to post official replies to guest reviews.

---

## 🏛️ Architecture & Reliability Highlights

1. **Atomic Concurrency Control (Double-Booking Prevention):**
   The core `BookingService` executes PostgreSQL row-level locking (`SELECT FOR NO KEY UPDATE`) within atomic database transactions. This guarantees that concurrent booking requests for overlapping dates on the same property are safely handled without race conditions.
2. **Financial Accuracy:**
   All monetary amounts (nightly rates, cleaning fees, service fees, totals, payouts) are stored and calculated strictly as integers in **cents** to eliminate floating-point precision issues.
3. **Consistent API Envelope:**
   All API endpoints follow a standardized JSON envelope structure:
   - Success: `{ "success": true, "data": { ... } }`
   - Failure: `{ "success": false, "error": { "code": "ERR_CODE", "message": "Human readable message" } }`

---

## 📁 Repository Structure

```text
comspace/
├── backend/                  # Laravel 13 API Application
│   ├── app/
│   │   ├── Http/Controllers/ # Auth, Property, Booking, Review, Host Controllers
│   │   ├── Models/           # User, Property, Booking, Review, AvailabilityBlock
│   │   └── Services/         # Concurrency-safe BookingService
│   ├── database/
│   │   ├── migrations/       # Database schemas & indexes
│   │   └── seeders/          # DatabaseSeeder with realistic demo data
│   ├── routes/api.php        # API endpoint contracts & rate limiters
│   └── tests/                # Pest feature test suite (Auth, Booking, Conflict logic)
│
├── frontend/                 # Next.js 16 Web Application
│   ├── app/                  # App Router pages (auth, properties, bookings, host, profile)
│   ├── components/           # UI components (booking, layout, property, modal)
│   ├── store/                # Zustand global store (useAuthStore)
│   └── public/               # Static assets & brand vectors
│
├── TASKS.md                  # Team development task tracker
└── SKILL.md                  # Project engineering standards & guidelines
```

---

## 🚀 Local Development Setup

### Prerequisites
- **PHP** 8.3+
- **Node.js** 18+ & npm
- **Composer** 2.x
- **PostgreSQL** & **Redis**

---

### 1. Backend Setup (Laravel API)

```bash
cd backend

# Install PHP dependencies
composer install

# Environment configuration
cp .env.example .env
php artisan key:generate

# Configure your database connection in .env:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=comspace_db
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run database migrations and seed realistic demo data
php artisan migrate --seed

# Create storage symlink for uploaded property images
php artisan storage:link

# Start the Laravel development server (runs on http://localhost:8000)
php artisan serve
```

---

### 2. Frontend Setup (Next.js App)

```bash
cd frontend

# Install Node.js dependencies
npm install

# Environment configuration
cp .env.example .env.local

# Ensure NEXT_PUBLIC_API_URL points to the Laravel backend
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start the Next.js development server (runs on http://localhost:3000)
npm run dev
```

---

## 🧪 Testing & Code Standards

### Backend Tests
Execute the Pest test suite to verify booking conflict resolution, API contracts, and authentication:

```bash
cd backend
php artisan test
```

### Code Formatting & Linting

```bash
# Backend code style check (Laravel Pint)
cd backend
./vendor/bin/pint

# Frontend linting
cd frontend
npm run lint
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
