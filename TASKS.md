===========================================================
  COMSPACE — REMAINING TASKS FOR TEAM COLLABORATION
  Branch naming convention: feature/<task-name>
  Commit convention: type(scope): short description
    types: feat, fix, style, docs, test, refactor, chore
  Always refer to SKILL.md at the root for all coding rules.
===========================================================


============================
  DEVELOPER 1 — BACKEND
============================

BRANCH: fix/backend-tests
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Fix failing Pest tests (SQLite driver missing)
    - Enable pdo_sqlite extension in php.ini (Laragon)
    - OR switch phpunit.xml to use pgsql with a test database
    - Ensure all 7 BookingConflictTest cases pass
    - File: backend/phpunit.xml, backend/tests/Pest.php

BRANCH: feature/backend-auth-hardening
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Add request validation to AuthController (login, register)
    - Use FormRequest classes (e.g. LoginRequest, RegisterRequest)
    - Add email uniqueness rule on register
    - File: backend/app/Http/Controllers/Api/AuthController.php
[x] Add rate limiting to /api/auth/login route (max 5/min)
    - Use Laravel's ThrottleRequests middleware
    - File: backend/routes/api.php
[x] Return structured error responses on all endpoints
    - Format: { success: false, error: { code, message } }
    - See SKILL.md Error Handling section for the required format
    - File: backend/app/Http/Controllers/Api/*.php

BRANCH: feature/backend-google-oauth
PRIORITY: 1
------
[ ] Implement Google OAuth authentication with Laravel Socialite
    - Install package: composer require laravel/socialite
    - Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI to .env
    - Create GET /api/auth/google/redirect endpoint
    - Create GET /api/auth/google/callback endpoint
    - Find or create user by google_id / email and return Sanctum plainTextToken
    - File: backend/config/services.php, backend/app/Http/Controllers/Api/AuthController.php

BRANCH: test/backend-auth-api
PRIORITY: 2
------
[ ] Write Pest feature test: AuthApiTest
    - Test: register with valid data returns token
    - Test: login with invalid credentials returns 401
    - Test: login with invalid payload returns 422
    - Test: rate limiting returns 429 after 5 failed logins
    - Test: logout invalidates token
    - File: backend/tests/Feature/AuthApiTest.php

BRANCH: feature/backend-property-search
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Implement full property search in PropertyController@index
    - Filter by: location (city/country ILIKE), check_in/check_out, guests
    - Filter by: type, min_price, max_price, amenities[], instant_book
    - Sort by: price_per_night, average_rating, created_at
    - Paginate: 12 per page
    - Avoid N+1 — eager load: images, amenities, host (see SKILL.md DB rules)
    - Validated with PropertySearchRequest and covered by feature tests
    - File: backend/app/Models/Property.php (scopes), PropertyController.php

BRANCH: feature/backend-price-preview
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Add GET /api/properties/{id}/price-preview endpoint
    - Accepts: check_in, check_out query params
    - Returns: nights, price_per_night, subtotal, cleaning_fee,
               service_fee, total_amount (all in cents)
    - Validate dates are not in the past and check_out > check_in
    - File: backend/routes/api.php, backend/app/Http/Controllers/Api/BookingController.php

BRANCH: feature/backend-image-upload
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Implement POST /api/properties/{id}/images endpoint
    - Accept multipart image uploads
    - Store in /storage/app/public/properties/{id}/ (or Supabase Storage)
    - Return public URL in response
    - Max 10 images per property, validate mime types (jpg, png, webp)
    - File: backend/app/Http/Controllers/Api/PropertyController.php

BRANCH: feature/backend-review-reply
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Implement POST /api/reviews/{id}/reply endpoint
    - Allow host to reply to guest reviews on their property
    - Update host_reply and host_replied_at columns
    - Only the property owner can reply; only once
    - File: backend/app/Http/Controllers/Api/ReviewController.php
    - File: backend/app/Policies/ReviewPolicy.php

BRANCH: feature/backend-host-dashboard-api
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Add GET /api/host/stats endpoint
    - Returns: total_properties, total_bookings, total_revenue (cents),
               pending_bookings, avg_rating, recent_bookings[]
    - Auth protected: host only
    - File: backend/routes/api.php, backend/app/Http/Controllers/Api/HostController.php

BRANCH: test/backend-booking-api
STATUS: DONE
------
[x] Write Pest feature test: BookingApiTest
    - Test: guest can create booking (returns 201)
    - Test: guest cannot book own property
    - Test: host can confirm booking
    - Test: guest can cancel booking (refund flow placeholder)
    - Test: unauthenticated user gets 401 on all protected endpoints
    - File: backend/tests/Feature/BookingApiTest.php

BRANCH: feature/backend-availability-blocks
PRIORITY: 4
------
[ ] Add POST /api/properties/{id}/availability endpoint (host only)
    - Allows hosts to block off dates (vacations, maintenance)
    - Connect AvailabilityBlock model to PropertyController/AvailabilityController
    - File: backend/routes/api.php, backend/app/Http/Controllers/Api/AvailabilityController.php

BRANCH: feature/backend-stripe-webhook
PRIORITY: 5
------
[ ] Add POST /api/webhooks/stripe endpoint
    - Verify Stripe signature using STRIPE_WEBHOOK_SECRET
    - Handle payment_intent.succeeded to mark booking as confirmed/paid
    - Handle payment_intent.payment_failed to update booking status
    - File: backend/routes/api.php, backend/app/Http/Controllers/Api/StripeWebhookController.php


============================
  DEVELOPER 2 — FRONTEND UI
============================

BRANCH: feature/frontend-auth-pages
STATUS: PARTIAL
------
[x] Build /app/auth/login/page.tsx
    - Email + password form with validation
    - Inline error messages
    - On success: store token in Zustand auth store, redirect to /
[x] Build /app/auth/register/page.tsx
    - Name, email, password, confirm password, role fields
    - Labelled inputs (A11Y compliance)
    - On success: store token, redirect to /
[ ] Add "Continue with Google" OAuth button to login & register pages
    - Redirects to GET /api/auth/google/redirect
    - File: app/auth/login/page.tsx, app/auth/register/page.tsx
[ ] Build /app/auth/layout.tsx
    - Centered card layout with branding on the left (split screen)

BRANCH: feature/frontend-property-detail
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Property details available via modal on card click
    - Opens PropertyDetailModal with gallery, host, amenities, reviews
    - Fetches GET /api/properties/{id}
[x] Build /app/properties/[id]/page.tsx
    - Fetch property with propertyApi.get(id)
    - Image gallery: 5-photo grid (CSS grid, first photo spans 2 rows)
    - Host card: avatar, name, host since, response rate, rating
    - Amenities grid: grouped by category (Wifi, Kitchen, etc.)
    - Reviews list with star ratings and pagination
    - Skeleton loaders for all sections

BRANCH: feature/frontend-ui-ux-redesign
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Full Comspace UI/UX Redesign — Direction 1 (Warm Editorial & Nomad Luxury)
    - Vector SVG Logo integration matching brand mark
    - Brand palette: Warm Terracotta (#FF5A1F) + Warm Linen (#FDFBF9)
    - Clean editorial hero header: "Find your next comfortable space"
    - Custom animated CustomSelect dropdown components
    - Dedicated Why Comspace & Story page (/app/about/page.tsx)
    - Vector SVG favicon (app/icon.svg) and metadata setup
    - Frictionless mobile responsiveness across views

BRANCH: feature/frontend-booking-widget
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Build BookingWidget component (shown on property detail page)
    - Date picker: check-in / check-out (inline calendar or date inputs)
    - Guest count selector with +/- buttons
    - Live price breakdown (call propertiesApi.previewPrice on date change)
    - Shows: x nights × $price, cleaning fee, service fee, total
    - "Reserve" button → if not logged in, redirect to /auth/login
    - On mobile: show as bottom sheet drawer
    - File: components/booking/BookingWidget.tsx

BRANCH: feature/frontend-checkout-flow
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Build /app/bookings/new/page.tsx
    - Multi-step flow: Review → Payment → Confirmation
    - Step 1: Show booking summary (property, dates, price breakdown)
    - Step 2: Payment form (Stripe Elements / Mock card UI)
    - Step 3: Confirmation screen with booking ID and check-in instructions
    - File: app/bookings/new/page.tsx, components/booking/CheckoutStepper.tsx

BRANCH: feature/frontend-bookings-list
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Build /app/bookings/page.tsx
    - List of guest's own bookings (use bookingsApi.list())
    - Show: property thumbnail, dates, status badge, total price
    - Status badges with distinct colors: pending, confirmed, cancelled, completed
    - "Cancel" button for upcoming bookings
    - "Leave a Review" button for completed bookings with no review yet
    - Empty state + skeleton loaders

BRANCH: feature/frontend-review-flow
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Build review modal/page triggered from bookings list
    - Star rating picker (1–5) with animated fill
    - Sub-ratings: Cleanliness, Accuracy, Communication, Location, Value
    - Text area for written review (min 20 chars)
    - Submit via reviewsApi.create()
    - File: components/booking/ReviewModal.tsx

BRANCH: feature/frontend-host-dashboard
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Build /app/host/dashboard/page.tsx
    - Stats cards: Total Revenue, Active Bookings, Properties Listed, Avg Rating
    - Revenue chart using recharts
    - Recent bookings table with status and quick actions
    - Upcoming arrivals list

BRANCH: feature/frontend-host-property-management
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Build /app/host/properties/page.tsx
    - List host properties with edit/delete/publish toggle
[x] Build /app/host/properties/new/page.tsx
    - Multi-step form: Details → Location → Photos → Pricing → Publish
[x] Build /app/host/properties/[id]/edit/page.tsx
    - Pre-populated property editing form

BRANCH: feature/frontend-profile-page
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Build /app/profile/page.tsx
    - Display and edit user name, email
    - Change password section
    - Connect to Laravel auth endpoints (PUT /api/auth/profile, PUT /api/auth/password)

BRANCH: feature/frontend-footer
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Build Footer component
    - Four columns: About Comspace, Support, Hosting, Legal
    - File: components/layout/Footer.tsx (imported in app/page.tsx)

BRANCH: feature/frontend-404-page
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Build /app/not-found.tsx
    - Friendly 404 message with link back to Browse
    - Use brand colors and heading typography

============================
  DEVELOPER 3 — INTEGRATION
============================

BRANCH: feature/integrate-auth-flow
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Wire Navbar to show correct state (guest vs host vs anonymous)
    - Uses useAuthStore from store/useAuthStore.ts
[x] Add route protection using Next.js middleware
    - Redirect unauthenticated users away from /bookings, /host/*, /profile
    - File: frontend/middleware.ts

BRANCH: feature/integrate-property-api
STATUS: <span style="color: #16a34a">DONE</span>
------
[x] Connect PropertyCard to real API data
    - Verify images load from backend / Supabase storage URLs
[x] Add search filters and pagination to /properties page

BRANCH: feature/integrate-stripe
PRIORITY: 1
------
[ ] Set up Stripe Elements on the checkout page
    - Install: npm install @stripe/react-stripe-js @stripe/stripe-js
    - Call backend to create PaymentIntent, pass client_secret to Elements
    - Handle payment success → call bookingsApi.confirm()
    - File: components/booking/PaymentForm.tsx

BRANCH: feature/frontend-toast-notifications
PRIORITY: 2
------
[ ] Implement global toast/notification system
    - Install: npm install react-hot-toast
    - Add <Toaster /> to root layout / providers
    - Use on: booking created, cancelled, review submitted, errors
    - File: app/providers.tsx

BRANCH: feature/frontend-responsive-audit
PRIORITY: 3
------
[ ] Audit and fix responsiveness on all pages
    - Test on: 375px (mobile), 768px (tablet), 1280px (desktop)
    - Fix: Navbar mobile drawer menu
    - Fix: SearchBar stacking layout on mobile


============================
  DEVOPS & INFRASTRUCTURE
============================

BRANCH: devops/docker-containerization
PRIORITY: 1
------
[ ] Create Docker containerization setup for full stack development & production
    - backend/Dockerfile: Multi-stage PHP 8.2-fpm + Nginx + Composer
    - frontend/Dockerfile: Multi-stage Node 20 runner for Next.js
    - docker-compose.yml: Orchestrate Laravel API, Next.js frontend, PostgreSQL, Redis, and Mailpit
    - Add .dockerignore for both frontend and backend

BRANCH: devops/cicd-pipeline
PRIORITY: 2
------
[ ] Build GitHub Actions CI/CD workflows (.github/workflows/)
    - ci-backend.yml: Run phpunit / pest tests, pint linting, and database migration checks on PR
    - ci-frontend.yml: Run npm run lint and npm run build on PR
    - cd-deploy.yml: Automated production deployment trigger (Render / Vercel / VPS)

BRANCH: devops/queue-and-stripe-listeners
PRIORITY: 3
------
[ ] Configure background Queue Workers and Webhook Listeners
    - Configure Supervisor / Docker container entrypoint for `php artisan queue:work`
    - Set up local Stripe CLI webhook listener forwarding (`stripe listen --forward-to localhost:8000/api/webhooks/stripe`)

BRANCH: chore/env-example-update
PRIORITY: 4
------
[ ] Update backend/.env.example with all required keys
    - DB_*, REDIS_*, SANCTUM_*, STRIPE_*, GOOGLE_*, SUPABASE_*
[ ] Create frontend/.env.example
    - NEXT_PUBLIC_API_URL, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, NEXT_PUBLIC_GOOGLE_CLIENT_ID

BRANCH: chore/database-seeder
PRIORITY: 5
------
[ ] Build DatabaseSeeder with realistic demo data
    - 2 host users, 1 guest user
    - 6 properties with Supabase/Unsplash image URLs, amenities, and reviews
    - 3 bookings in various statuses
    - File: backend/database/seeders/DatabaseSeeder.php

BRANCH: docs/api-documentation
PRIORITY: 6
------
[ ] Document all API endpoints in backend/API.md
    - Method, URL, Auth required, Request body, Response example
    - Include Google OAuth & Stripe Webhook contracts


===========================================================
  NOTES FOR ALL DEVELOPERS
===========================================================
- Always read SKILL.md (project root) before writing any code
- No hardcoded secrets, API keys, or tokens — use .env files
- Every input must have a visible <label> element
- No inline comments in code — top-of-function docblocks only
- Run linter before pushing: backend → ./vendor/bin/pint
  frontend → npm run lint
- Never push directly to main — always open a PR

GitHub Repo: https://github.com/joxyle-jhon/comspace
===========================================================
