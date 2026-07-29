# Comspace API Documentation 🏡

Welcome to the Comspace API reference. This document provides a complete guide to all available API endpoints, request schemas, authentication scopes, validation rules, and response payloads.

---

## 🏛️ General API Guidelines

### Base URL
All API requests in local development are routed to:
```text
http://localhost:8000/api
```

### JSON Envelope Format
All responses are formatted in JSON.
* **Success Envelope (Standard Resources):** Eager-loaded resources use Laravel's standard `data` wrapper:
  ```json
  {
    "data": {
      "id": 1,
      "title": "Minimalist Studio",
      ...
    }
  }
  ```
* **Success Envelope (Custom payloads):** Authentication and custom actions return direct structured envelopes:
  ```json
  {
    "success": true,
    "message": "Action succeeded."
  }
  ```
* **Error Envelope:**
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Human readable error description."
    }
  }
  ```

### Financial Calculations
All prices, subtotals, cleaning fees, service fees, and total amounts are calculated and stored strictly as **integers in cents** (e.g. `$120.00` is represented as `12000`) to eliminate floating-point precision issues.

---

## 🔑 Authentication

Comspace uses **Laravel Sanctum** token-based authentication.
For endpoints marked with `Scope: Authenticated`, you must send the API token in the request header:
```http
Authorization: Bearer {your_api_token}
```

---

## 🗺️ Endpoint Map

* [Public Authentication](#1-public-authentication)
  * `POST /auth/register`
  * `POST /auth/login`
  * `GET /auth/google/redirect`
  * `GET /auth/google/callback`
* [Authenticated Account Operations](#2-authenticated-account-operations)
  * `POST /auth/logout`
  * `GET /auth/me`
  * `PUT /auth/profile`
  * `PUT /auth/password`
  * `POST /auth/become-host`
* [Properties Discovery (Public)](#3-properties-discovery-public)
  * `GET /properties`
  * `GET /properties/{property}`
  * `GET /properties/{property}/reviews`
  * `GET /properties/{property}/price-preview`
* [Properties Host Operations (Authenticated)](#4-properties-host-operations-authenticated)
  * `POST /properties`
  * `PUT /properties/{property}`
  * `DELETE /properties/{property}`
  * `POST /properties/{property}/images`
  * `PATCH /properties/{property}/publish`
  * `POST /properties/{property}/availability`
  * `DELETE /availability/{availability_block}`
* [Bookings Operations (Authenticated)](#5-bookings-operations-authenticated)
  * `GET /bookings`
  * `POST /properties/{property}/bookings`
  * `GET /bookings/{booking}`
  * `PATCH /bookings/{booking}/cancel`
  * `PATCH /bookings/{booking}/confirm`
* [Reviews & Host Replies (Authenticated)](#6-reviews--host-replies-authenticated)
  * `POST /bookings/{booking}/reviews`
  * `POST /reviews/{review}/reply`
* [Host Dashboard Stats (Authenticated)](#7-host-dashboard-stats-authenticated)
  * `GET /host/stats`
* [Webhooks (Public)](#8-webhooks-public)
  * `POST /webhooks/stripe`

---

## 1. Public Authentication

### `POST /auth/register`
Creates a new guest or host account and issues an API token.

* **Headers:** `Accept: application/json`
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | string | required, max:255 | The user's full name. |
  | `email` | string | required, email, max:255, unique:users | Email address. |
  | `password` | string | required, min:8, confirmed | Account password. |
  | `password_confirmation` | string | required | Confirmation password matching `password`. |
  | `role` | string | optional, in:guest,host | Default: `guest`. Role of the registering user. |
* **Response Example (201 Created):**
  ```json
  {
    "user": {
      "id": 1,
      "name": "Jane Guest",
      "email": "jane@example.com",
      "role": "guest",
      "avatar": null,
      "phone": null,
      "country": null,
      "created_at": "2026-07-29T12:00:00.000000Z"
    },
    "token": "1|abcdef1234567890..."
  }
  ```

---

### `POST /auth/login`
Authenticates user credentials and issues an API token.
> [!NOTE]
> Rate limited to **5 attempts per minute**. Returns a `429 Too Many Requests` code on violation.

* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | string | required, email | Account email. |
  | `password` | string | required | Account password. |
* **Response Example (200 OK):**
  ```json
  {
    "user": {
      "id": 2,
      "name": "John Host",
      "email": "john@example.com",
      "role": "host",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      "phone": "+123456789",
      "country": "Japan",
      "bio": "Minimalist architecture enthusiast.",
      "is_verified_host": true,
      "host_since": "2023-01-15T00:00:00.000000Z",
      "response_rate": 98,
      "response_time": "within an hour",
      "created_at": "2023-01-15T00:00:00.000000Z"
    },
    "token": "2|ghijk789012345..."
  }
  ```
* **Response Example (401 Unauthorized):**
  ```json
  {
    "success": false,
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "Invalid credentials."
    }
  }
  ```

---

### `GET /auth/google/redirect`
Redirects the client browser to the Google OAuth consent page.

---

### `GET /auth/google/callback`
Handles the Google OAuth authentication redirect callback from Google.
* **Flow:**
  * Checks/creates the user account via Google email.
  * Generates a Sanctum token.
  * Redirects the user's browser back to the frontend SPA route:
    * **Success:** Redirects to `{FRONTEND_URL}/auth/callback?token={token}`
    * **Failure:** Redirects to `{FRONTEND_URL}/auth/callback?error={errorMessage}`

---

## 2. Authenticated Account Operations

### `POST /auth/logout`
* **Scope:** Authenticated
* **Response Example (200 OK):**
  ```json
  {
    "message": "Logged out successfully."
  }
  ```

---

### `GET /auth/me`
* **Scope:** Authenticated
* **Response Example (200 OK):**
  ```json
  {
    "id": 1,
    "name": "Jane Guest",
    "email": "jane@example.com",
    "role": "guest",
    "avatar": null,
    "phone": null,
    "country": null,
    "created_at": "2026-07-29T12:00:00.000000Z"
  }
  ```

---

### `PUT /auth/profile`
Updates the profile information of the authenticated user.
* **Scope:** Authenticated
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | string | required, max:255 | The updated name. |
  | `email` | string | required, email, max:255, unique:users (except current) | The updated email. |
* **Response Example (200 OK):**
  ```json
  {
    "message": "Profile updated successfully.",
    "user": {
      "id": 1,
      "name": "Jane Updated Name",
      "email": "jane_updated@example.com",
      "role": "guest",
      "avatar": null,
      "phone": null,
      "country": null,
      "created_at": "2026-07-29T12:00:00.000000Z"
    }
  }
  ```

---

### `PUT /auth/password`
* **Scope:** Authenticated
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `current_password` | string | required | Current account password. |
  | `password` | string | required, min:8, confirmed | New account password. |
  | `password_confirmation` | string | required | Confirm new password. |
* **Response Example (200 OK):**
  ```json
  {
    "message": "Password changed successfully."
  }
  ```

---

### `POST /auth/become-host`
Promotes a user account from `guest` to `host` role.
* **Scope:** Authenticated
* **Response Example (200 OK):**
  ```json
  {
    "message": "Role updated to host successfully.",
    "user": {
      "id": 1,
      "name": "Jane Guest",
      "email": "jane@example.com",
      "role": "host",
      "avatar": null,
      "phone": null,
      "country": null,
      "bio": null,
      "is_verified_host": false,
      "host_since": "2026-07-29T12:43:00.000000Z",
      "response_rate": null,
      "response_time": null,
      "created_at": "2026-07-29T12:00:00.000000Z"
    }
  }
  ```

---

## 3. Properties Discovery (Public)

### `GET /properties`
Retrieves a paginated list of published properties matching optional query filters.

* **Query Parameters:**
  | Parameter | Type | Description |
  | :--- | :--- | :--- |
  | `location` | string | Filter properties where city or country matches input (case-insensitive ILIKE). |
  | `guests` | integer | Filter properties supporting at least this number of guests. |
  | `check_in` | date (YYYY-MM-DD) | Filter properties available for this date range (requires `check_out`). |
  | `check_out` | date (YYYY-MM-DD) | Filter properties available for this date range (requires `check_in`). |
  | `min_price` | integer | Filter properties with price per night (cents) greater than or equal to this. |
  | `max_price` | integer | Filter properties with price per night (cents) less than or equal to this. |
  | `amenities` | array (ints) | Filter properties possessing all of these amenity IDs. |
  | `type` | string | Filter by property type: `apartment`, `house`, `villa`, `cabin`, etc. |
  | `instant_book`| boolean | Filter by instant book eligibility. |
  | `sort` | string | Sort column. Options: `price_per_night`, `average_rating`, `created_at`. Default: `created_at`. |
  | `dir` | string | Sort direction. Options: `asc`, `desc`. Default: `desc`. |
  | `my_properties`| boolean | Returns the authenticated host's own properties (requires auth token). |
* **Response Example (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "Linen & Oak Studio",
        "description": "A beautifully designed minimalist studio apartment in the heart of Tokyo. Perfect for remote work...",
        "type": "apartment",
        "location": {
          "address": "3-15-2 Shinjuku",
          "city": "Tokyo",
          "state": "Tokyo Prefecture",
          "country": "Japan",
          "postal_code": "160-0022",
          "latitude": 35.6905,
          "longitude": 139.7049
        },
        "capacity": {
          "max_guests": 2,
          "bedrooms": 1,
          "beds": 1,
          "bathrooms": 1
        },
        "pricing": {
          "price_per_night": 12000,
          "price_formatted": "$120",
          "cleaning_fee": 3000,
          "service_fee_percent": 10
        },
        "rules": {
          "min_nights": 2,
          "max_nights": 14,
          "instant_book": true
        },
        "stats": {
          "average_rating": 4.9,
          "review_count": 24
        },
        "is_published": true,
        "host": {
          "id": 2,
          "name": "John Host",
          "email": "john@example.com",
          "role": "host"
        },
        "images": [
          {
            "id": 101,
            "url": "http://localhost:8000/storage/properties/1/cover.jpg",
            "caption": "Living Space",
            "sort_order": 1,
            "is_cover": true
          }
        ],
        "amenities": [
          {
            "id": 1,
            "name": "High-speed Wifi",
            "icon": "wifi",
            "category": "Connectivity"
          }
        ],
        "created_at": "2026-07-25T12:00:00.000000Z",
        "updated_at": "2026-07-29T12:00:00.000000Z"
      }
    ],
    "links": {
      "first": "http://localhost:8000/api/properties?page=1",
      "last": "http://localhost:8000/api/properties?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 12,
      "to": 1,
      "total": 1
    }
  }
  ```

---

### `GET /properties/{property}`
Fetches the detailed object for a single property, including all images, reviews, host profiles, and blocked dates.
* **Response Example (200 OK):**
  ```json
  {
    "data": {
      "id": 1,
      "title": "Linen & Oak Studio",
      "description": "A beautifully designed minimalist studio apartment in the heart of Tokyo...",
      "type": "apartment",
      "location": {
        "address": "3-15-2 Shinjuku",
        "city": "Tokyo",
        "state": "Tokyo Prefecture",
        "country": "Japan",
        "postal_code": "160-0022",
        "latitude": 35.6905,
        "longitude": 139.7049
      },
      "capacity": {
        "max_guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1
      },
      "pricing": {
        "price_per_night": 12000,
        "price_formatted": "$120",
        "cleaning_fee": 3000,
        "service_fee_percent": 10
      },
      "rules": {
        "min_nights": 2,
        "max_nights": 14,
        "instant_book": true
      },
      "stats": {
        "average_rating": 4.90,
        "review_count": 24
      },
      "is_published": true,
      "host": {
        "id": 2,
        "name": "John Host",
        "email": "john@example.com",
        "role": "host",
        "host_since": "2023-01-15T00:00:00.000000Z"
      },
      "images": [...],
      "amenities": [...],
      "reviews": [
        {
          "id": 50,
          "rating": 5,
          "ratings": {
            "cleanliness": 5,
            "accuracy": 5,
            "communication": 5,
            "location": 5,
            "value": 5
          },
          "comment": "An absolute dream workspace. Super clean, fast WiFi, great vibes.",
          "host_reply": "Thanks Jane! Glad you liked it.",
          "host_replied_at": "2026-07-29T12:00:00.000000Z",
          "guest": {
            "id": 1,
            "name": "Jane Guest",
            "email": "jane@example.com"
          },
          "created_at": "2026-07-28T10:00:00.000000Z"
        }
      ],
      "availability_blocks": [
        {
          "id": 5,
          "property_id": 1,
          "blocked_from": "2026-08-15",
          "blocked_to": "2026-08-20",
          "reason": "AC Repair",
          "created_at": "2026-07-29T12:00:00.000000Z"
        }
      ],
      "created_at": "2026-07-25T12:00:00.000000Z",
      "updated_at": "2026-07-29T12:00:00.000000Z"
    }
  }
  ```

---

### `GET /properties/{property}/reviews`
Fetch a paginated list of reviews for a property (10 items per page).
* **Response Example (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 50,
        "rating": 5,
        "ratings": {
          "cleanliness": 5,
          "accuracy": 5,
          "communication": 5,
          "location": 5,
          "value": 5
        },
        "comment": "An absolute dream workspace. Super clean, fast WiFi, great vibes.",
        "host_reply": null,
        "host_replied_at": null,
        "guest": {
          "id": 1,
          "name": "Jane Guest",
          "email": "jane@example.com"
        },
        "created_at": "2026-07-28T10:00:00.000000Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 10,
      "total": 1
    }
  }
  ```

---

### `GET /properties/{property}/price-preview`
Calculates a detailed quote breakdown for booking dates without committing a reservation.
* **Query Parameters:**
  | Parameter | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `check_in` | date | required, after_or_equal:today | Check in date. |
  | `check_out` | date | required, after:check_in | Check out date. |
* **Response Example (200 OK):**
  ```json
  {
    "nights": 4,
    "price_per_night": 12000,
    "subtotal": 48000,
    "cleaning_fee": 3000,
    "service_fee": 4800,
    "total_amount": 55800
  }
  ```

---

## 4. Properties Host Operations (Authenticated)

> [!IMPORTANT]
> The endpoints in this section are protected. They require an `Authorization` token of a user possessing the `host` role. The host must be the creator/owner of the resource to execute mutations.

### `POST /properties`
Registers a new property listing.
* **Scope:** Authenticated (Hosts only)
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `title` | string | required, max:255 | Property name. |
  | `description` | string | required, min:50 | Property long description. |
  | `type` | string | required, in:apartment,house,villa,cabin,studio,loft,condo,other | Property category. |
  | `address` | string | required | Address line. |
  | `city` | string | required | City. |
  | `state` | string | optional | State / Province. |
  | `country` | string | required | Country. |
  | `postal_code` | string | optional | Postal/Zip code. |
  | `latitude` | numeric | optional, between:-90,90 | GPS latitude. |
  | `longitude` | numeric | optional, between:-180,180 | GPS longitude. |
  | `max_guests` | integer | required, min:1, max:50 | Maximum number of guests allowed. |
  | `bedrooms` | integer | required, min:0 | Bedrooms count. |
  | `beds` | integer | required, min:1 | Beds count. |
  | `bathrooms` | integer | required, min:1 | Bathrooms count. |
  | `price_per_night`| integer | required, min:100 | Cost per night in cents. |
  | `cleaning_fee` | integer | optional, min:0 | Cleaning fee in cents. |
  | `service_fee_percent` | integer | optional, min:0, max:50 | Host platform service fee percentage. |
  | `min_nights` | integer | optional, min:1 | Minimum stay requirement. |
  | `max_nights` | integer | optional, min:1, max:365 | Maximum stay limit. |
  | `instant_book` | boolean | optional | Can booking bypass host confirmation. |
  | `amenity_ids` | array | optional | List of amenity IDs to attach. |
* **Response Example (201 Created):** Returns a standard `PropertyResource` block with the generated ID.

---

### `PUT /properties/{property}`
Updates attributes of an existing property listing.
* **Scope:** Authenticated (Host Owner only)
* **Request Body:** Accepts any of the fields in `POST /properties` (all fields become `sometimes`/optional).
* **Response Example (200 OK):** Returns the updated `PropertyResource`.

---

### `DELETE /properties/{property}`
Deletes a property listing.
* **Scope:** Authenticated (Host Owner only)
* **Response Example (200 OK):**
  ```json
  {
    "message": "Property deleted."
  }
  ```

---

### `POST /properties/{property}/images`
Uploads files to serve as property photos.
* **Scope:** Authenticated (Host Owner only)
* **Content-Type:** `multipart/form-data`
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `images` | array (files) | required, max:10 items total, image type (jpg, png, webp) | The photo assets to upload. |
  | `captions` | array (strings)| optional | Captions indexed corresponding to the images. |
  | `cover_index` | integer | optional | Index in the current upload array to set as the cover image. |
* **Response Example (201 Created):**
  ```json
  {
    "data": [
      {
        "id": 101,
        "url": "http://localhost:8000/storage/properties/1/living.jpg",
        "caption": "Living Area",
        "sort_order": 1,
        "is_cover": true
      }
    ]
  }
  ```

---

### `PATCH /properties/{property}/publish`
Sets the visibility status of the property on search queries.
* **Scope:** Authenticated (Host Owner only)
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `published` | boolean | required | True to publish, false to unpublish. |
* **Response Example (200 OK):**
  ```json
  {
    "is_published": true,
    "message": "Property published."
  }
  ```

---

### `POST /properties/{property}/availability`
Blocks off a range of dates for personal usage or maintenance.
* **Scope:** Authenticated (Host Owner only)
* **Validation Guards:**
  * Cannot block dates overlapping with active bookings (`pending` or `confirmed`).
  * Cannot block dates that are already blocked.
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `blocked_from` | date | required, date, after_or_equal:today | Start of block date. |
  | `blocked_to` | date | required, date, after:blocked_from | End of block date. |
  | `reason` | string | optional, max:255 | Description of the block reason. |
* **Response Example (201 Created):**
  ```json
  {
    "id": 5,
    "property_id": 1,
    "blocked_from": "2026-08-15",
    "blocked_to": "2026-08-20",
    "reason": "AC Repair",
    "created_at": "2026-07-29T12:00:00.000000Z",
    "updated_at": "2026-07-29T12:00:00.000000Z"
  }
  ```

---

### `DELETE /availability/{availability_block}`
Unblocks a blocked date range by deleting the availability block.
* **Scope:** Authenticated (Host Owner only)
* **Response Example (200 OK):**
  ```json
  {
    "message": "Availability block deleted."
  }
  ```

---

## 5. Bookings Operations (Authenticated)

### `GET /bookings`
Retrieves a paginated list of bookings created by the authenticated guest.
* **Scope:** Authenticated (Guest)
* **Response Example (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 500,
        "check_in": "2026-08-01",
        "check_out": "2026-08-05",
        "guest_count": 2,
        "pricing": {
          "nights": 4,
          "price_per_night": 12000,
          "subtotal": 48000,
          "cleaning_fee": 3000,
          "service_fee": 4800,
          "total_amount": 55800,
          "total_formatted": "$558.00"
        },
        "status": "pending",
        "payment_status": "unpaid",
        "guest_note": "Quiet stay requested.",
        "cancelled_at": null,
        "property": {
          "id": 1,
          "title": "Linen & Oak Studio",
          "pricing": {
            "price_per_night": 12000
          }
        },
        "created_at": "2026-07-29T12:00:00.000000Z"
      }
    ]
  }
  ```

---

### `POST /properties/{property}/bookings`
Places a booking request. 
> [!CAUTION]
> **Race-Condition Safety:** This endpoint executes a PostgreSQL row lock (`SELECT FOR NO KEY UPDATE`) during creation to guarantee that two concurrent guests cannot double-book overlapping dates.

* **Scope:** Authenticated (Guest)
* **Validation Guards:**
  * Guest cannot book their own hosted property.
  * Dates must not overlap with existing confirmed or pending bookings.
  * Dates must not overlap with host availability blocks.
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `check_in` | date | required, after_or_equal:today | Start date. |
  | `check_out` | date | required, after:check_in | End date. |
  | `guest_count`| integer | required, min:1 | Guest count. |
  | `guest_note` | string | optional, max:1000 | Custom notes for the host. |
* **Response Example (201 Created):** Returns a `BookingResource` detailing the created reservation (status defaults to `pending`).

---

### `GET /bookings/{booking}`
Gets details for a specific booking.
* **Scope:** Authenticated (Guest who booked, or Host owner of the property)
* **Response Example (200 OK):** Returns a detailed `BookingResource`.

---

### `PATCH /bookings/{booking}/cancel`
Cancels an upcoming booking.
* **Scope:** Authenticated (Guest who booked, or Host owner of the property)
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `reason` | string | optional, max:500 | Cancellation reason comment. |
* **Response Example (200 OK):**
  ```json
  {
    "message": "Booking cancelled.",
    "booking": {
      "id": 500,
      "status": "cancelled",
      "payment_status": "unpaid",
      "cancelled_at": "2026-07-29T12:45:00.000000Z",
      ...
    }
  }
  ```

---

### `PATCH /bookings/{booking}/confirm`
Confirms a pending booking request.
* **Scope:** Authenticated (Host Owner only)
* **Response Example (200 OK):**
  ```json
  {
    "message": "Booking confirmed.",
    "booking": {
      "id": 500,
      "status": "confirmed",
      ...
    }
  }
  ```

---

## 6. Reviews & Host Replies (Authenticated)

### `POST /bookings/{booking}/reviews`
Allows a guest to review a property after their stay has concluded.
* **Scope:** Authenticated (Guest who booked only)
* **Validation Guards:**
  * Booking status must be `completed` or `confirmed` with check-out date in the past.
  * Can only submit one review per booking.
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `rating` | integer | required, between:1,5 | Overall rating. |
  | `cleanliness_rating` | integer | optional, between:1,5 | Cleanliness category rating. |
  | `accuracy_rating` | integer | optional, between:1,5 | Description accuracy rating. |
  | `communication_rating`| integer | optional, between:1,5 | Host communication rating. |
  | `location_rating` | integer | optional, between:1,5 | Location rating. |
  | `value_rating` | integer | optional, between:1,5 | Cost value rating. |
  | `comment` | string | required, min:20, max:2000 | Written review comment text. |
* **Response Example (201 Created):**
  ```json
  {
    "id": 50,
    "rating": 5,
    "ratings": {
      "cleanliness": 5,
      "accuracy": 5,
      "communication": 5,
      "location": 5,
      "value": 5
    },
    "comment": "An absolute dream workspace. Super clean, fast WiFi, great vibes.",
    "host_reply": null,
    "host_replied_at": null,
    "guest": {
      "id": 1,
      "name": "Jane Guest",
      "email": "jane@example.com"
    },
    "created_at": "2026-07-29T12:45:00.000000Z"
  }
  ```

---

### `POST /reviews/{review}/reply`
Allows a host to write a single public reply to a guest's review.
* **Scope:** Authenticated (Host Owner of reviewed property only)
* **Validation Guards:**
  * Host can only reply once to a review.
* **Request Body:**
  | Field | Type | Rules | Description |
  | :--- | :--- | :--- | :--- |
  | `reply` | string | required, max:1000 | The reply text. |
* **Response Example (200 OK):**
  ```json
  {
    "id": 50,
    "rating": 5,
    "comment": "An absolute dream workspace...",
    "host_reply": "Thank you for the kind words Jane! Welcome back anytime.",
    "host_replied_at": "2026-07-29T12:50:00.000000Z",
    "guest": {
      "id": 1,
      "name": "Jane Guest",
      "email": "jane@example.com"
    },
    "created_at": "2026-07-29T12:45:00.000000Z"
  }
  ```

---

## 7. Host Dashboard Stats (Authenticated)

### `GET /host/stats`
Fetches a high-level summary of metrics, revenues, ratings, and booking calendars for a host dashboard.
* **Scope:** Authenticated (Hosts only)
* **Response Example (200 OK):**
  ```json
  {
    "total_properties": 2,
    "total_bookings": 18,
    "total_revenue": 432000,
    "pending_bookings": 3,
    "avg_rating": 4.92,
    "recent_bookings": [
      {
        "id": 501,
        "check_in": "2026-08-01",
        "check_out": "2026-08-05",
        "status": "pending",
        "payment_status": "unpaid",
        "pricing": {
          "total_amount": 55800,
          "total_formatted": "$558.00"
        },
        "property": {
          "id": 1,
          "title": "Linen & Oak Studio"
        },
        "guest": {
          "id": 10,
          "name": "Jane Guest"
        }
      }
    ],
    "upcoming_arrivals": [
      {
        "id": 502,
        "check_in": "2026-08-10",
        "check_out": "2026-08-15",
        "status": "confirmed",
        "payment_status": "paid",
        "pricing": {
          "total_amount": 160000,
          "total_formatted": "$1,600.00"
        },
        "property": {
          "id": 2,
          "title": "Terracotta Sunset Villa"
        },
        "guest": {
          "id": 11,
          "name": "Marcus Vance"
        }
      }
    ]
  }
  ```

---

## 8. Webhooks (Public)

### `POST /webhooks/stripe`
Receives events from the Stripe Payment gateway.
* **Headers:** Must contain a valid `Stripe-Signature` header computed using the webhook endpoint secret.
* **Event Handlers:**
  * `payment_intent.succeeded`: Finds the booking containing matching `stripe_payment_intent_id` and marks its `status` as `confirmed`, `payment_status` as `paid`, and writes `stripe_charge_id`.
  * `payment_intent.payment_failed`: Finds the booking containing matching `stripe_payment_intent_id` and marks its `status` as `cancelled`, `payment_status` as `unpaid`, and sets cancellation reason as "Payment failed".
* **Response Example (200 OK):**
  ```json
  {
    "success": true
  }
  ```
* **Response Example (400 Bad Request - Invalid Signature/Payload):**
  ```json
  {
    "success": false,
    "error": {
      "code": "INVALID_SIGNATURE",
      "message": "Invalid Stripe signature."
    }
  }
  ```
