# System Architecture

## Overview

Aduanefie is a modular Laravel-based agricultural marketplace platform. The architecture follows a **plug-and-play module system** where each agricultural vertical (service, grocery, food, pharmacy, parcel) is a self-contained module with its own routes, controllers, entities, and views.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Framework | Laravel | PHP 8.1+ |
| Database | SQLite (dev), MySQL/PostgreSQL (prod) | — |
| Cache | Redis / File | — |
| Session | Database / File | — |
| Queue | Database / Redis | — |
| Frontend | Blade Templates + Vanilla JS | — |
| Assets | Laravel Mix / Vite | — |
| Real-time | Laravel Echo + Pusher (optional) | — |

## Directory Structure

```
soft/                          # Laravel application root
├── app/                       # Core application code
│   ├── Http/Controllers/      # HTTP controllers (API, Admin, Vendor)
│   ├── Models/                # Eloquent models
│   ├── Services/              # Business logic services
│   ├── CentralLogics/         # Helper functions and utilities
│   └── Providers/             # Service providers
├── config/                    # Configuration files
├── database/                  # Migrations, seeders, factories
├── modules/                   # Pluggable agricultural modules
│   ├── service/               # Agro Services & Mechanization
│   ├── grocery/               # Fresh produce & staples
│   ├── food/                  # Processed foods
│   ├── pharmacy/              # Veterinary & farm supplies
│   └── parcel/                # Logistics & cold chain
├── public/                    # Public web assets
├── resources/                 # Views, languages, assets
│   ├── views/                 # Blade templates
│   │   ├── components/        # Shared UI components
│   │   │   ├── ui/            # Generic UI components
│   │   │   └── auth/          # Authentication components
│   │   └── auth/              # Authentication views
│   └── lang/                  # Language files
├── routes/                    # Route definitions
│   ├── api/v1/api.php         # Customer API routes
│   ├── admin.php              # Admin web routes
│   └── web.php                # Public web routes
└── tests/                     # Test suites
```

## Module System

Each module follows a consistent structure:

```
modules/<ModuleName>/
├── module.json                # Module manifest (name, providers, etc.)
├── composer.json              # Module Composer autoload
├── package.json               # Module NPM dependencies
├── webpack.mix.js             # Asset compilation config
├── Config/
│   └── config.php             # Module configuration
├── Providers/
│   ├── <ModuleName>ServiceProvider.php   # Module boot/register
│   └── RouteServiceProvider.php           # Route registration
├── Entities/                  # Eloquent models
├── Http/
│   ├── Controllers/
│   │   ├── Api/Provider/      # Provider panel API controllers
│   │   ├── Api/Public/        # Customer-facing API controllers
│   │   └── Web/               # Web panel controllers (Admin, Provider)
├── Routes/
│   ├── api/v1/provider/api.php   # Provider API routes
│   ├── api/v1/public/api.php     # Public API routes
│   ├── web/admin/                  # Admin web routes
│   └── web/vendor/                 # Vendor panel web routes
├── Resources/
│   ├── lang/en/               # Language files
│   └── views/                 # Blade templates
├── Database/
│   └── Migrations/            # Module database migrations
├── public/                    # Module public assets
└── Resources/assets/          # Module source assets (JS, Sass)
```

### Module Registration

1. Create module directory under `soft/modules/<ModuleName>/`
2. Add `module.json` with provider class reference
3. Create `Providers/<ModuleName>ServiceProvider.php`
4. Create `Providers/RouteServiceProvider.php`
5. Add module alias to `soft/modules_statuses.json`
6. Module is automatically loaded by the Laravel application

## Key Domain Models

### Item (Product)
Represents any product or service listed on the marketplace.

**Key agricultural fields:**
- `farming_status` — `farming`, `harvest_ready`, or `in_stock`
- `is_backyard` — Boolean, indicates backyard-grown produce
- `planting_date` — Date when crop was planted
- `expected_harvest_date` — Expected harvest date
- `crop_cycle_days` — Typical crop cycle length
- `pre_order_enabled` — Whether pre-orders are allowed
- `cold_chain_required` — Whether cold-chain transport is needed
- `seasonality` — Seasonal availability information

### Store (Vendor)
Represents a farm, agro-service provider, or vendor.

**Key agricultural fields:**
- `farm_type` — `commercial` or `backyard`
- `is_backyard` — Boolean, backyard farm flag
- `farm_size_acres` — Farm size in acres
- `primary_crops` — Primary crops grown
- `cultivation_status` — `active` or `inactive`
- `next_harvest_date` — Next expected harvest
- `marketer_verified` — Whether marketer has verified the farm

### CropCycleAnalyticsService
Computes derived agricultural data:
- `effective_farming_status` — Auto-promotes `farming` → `harvest_ready` when harvest date passes
- `days_to_harvest` — Remaining days until harvest
- `cultivation_progress_pct` — Cultivation progress percentage
- `pre_order_available` — Whether pre-orders can be placed
- `status_label` — Human-readable status label

## Authentication & Authorization

- **Admin Login** — `/admin-login` with sliding 2FA panel (no page redirect)
- **Store/Vendor Login** — Dynamic URL based on `store_login_url` setting
- **Customer Auth** — API-based authentication with guest support
- **Role-Based Access** — Admin, Vendor, Vendor Employee, Customer roles

## API Design

All customer-facing API routes are under `/api/v1/` with the `apiGuestCheck` middleware for guest access.

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Format
```json
{
  "success": false,
  "errors": { "field": ["Error message"] },
  "message": "Error description"
}
```

## Security

- CSRF protection on all state-changing requests
- SQL injection prevention via Eloquent ORM and parameter binding
- XSS protection via Blade auto-escaping
- Rate limiting on authentication endpoints
- Input validation on all API endpoints
- No secrets committed to repository (`.env` is gitignored)

## Caching Strategy

- Module names and statuses cached
- Category translations cached
- Product listings cached with tag-based invalidation
- Configuration cached in production (`php artisan config:cache`)