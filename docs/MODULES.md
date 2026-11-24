# Module System

## Overview

Aduanefie uses a modular architecture where each agricultural vertical is a self-contained module. Modules can be enabled, disabled, or developed independently without affecting the core platform.

## Enabled Modules

| Module | Alias | Status | Description |
|--------|-------|--------|-------------|
| Service | `service` | Active | Agro Services & Mechanization - verified providers offer mechanization, spraying, harvesting, irrigation, and skilled farm labor |
| Grocery | `grocery` | Active | Fresh farm produce and grocery staples |
| Food | `food` | Active | Processed foods and value-added agricultural products |
| Pharmacy | `pharmacy` | Active | Veterinary medicines, animal feed, fertilizers, agro-chemicals |
| Parcel | `parcel` | Active | Farm-to-market transport, cold-chain logistics, produce delivery |

## Module Configuration

Module status is managed in `soft/modules_statuses.json`:

```json
{
    "Gateways": true,
    "Rental": true,
    "service": true,
    "grocery": true,
    "food": true,
    "pharmacy": true,
    "parcel": true
}
```

Setting a module to `false` disables it across the platform.

## Module Configuration Types

Each module can declare a `module_type` in its manifest that determines platform behavior:

| Type | Description |
|------|-------------|
| `service` | Service-based booking (no physical inventory) |
| `grocery` | Physical product with inventory |
| `food` | Physical product with inventory |
| `pharmacy` | Physical product with inventory |
| `parcel` | Logistics/service hybrid |
| `rental` | Equipment rental |
| `ecommerce` | General e-commerce |

The `service` type is described as: *"verified agro-service providers offer mechanization, spraying, harvesting, irrigation, and skilled farm labor without physical product inventory, managed as scheduled service bookings."*

## Module Manifest (`module.json`)

Each module requires a `module.json` file:

```json
{
    "name": "ModuleName",
    "alias": "modulename",
    "description": "Human-readable description",
    "keywords": ["keyword1", "keyword2"],
    "priority": 0,
    "providers": [
        "Modules\\ModuleName\\Providers\\ModuleNameServiceProvider"
    ],
    "aliases": {},
    "files": [],
    "requires": []
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Human-readable module name |
| `alias` | Yes | URL-friendly module alias (lowercase) |
| `description` | Yes | Module description |
| `keywords` | No | Search/SEO keywords |
| `priority` | No | Display priority (lower = higher priority) |
| `providers` | Yes | List of service provider classes |
| `aliases` | No | Facade aliases |
| `files` | No | Additional files to auto-load |
| `requires` | No | Dependency module aliases |

## Module Directory Convention

```
modules/<ModuleName>/
├── module.json
├── composer.json
├── package.json
├── webpack.mix.js
├── Config/config.php
├── Providers/
│   ├── <ModuleName>ServiceProvider.php
│   └── RouteServiceProvider.php
├── Entities/
├── Http/Controllers/Api/Provider/
├── Http/Controllers/Api/Public/
├── Http/Controllers/Web/Admin/
├── Routes/api/v1/provider/api.php
├── Routes/api/v1/public/api.php
├── Routes/web/admin/
├── Routes/web/vendor/
├── Resources/lang/en/
├── Resources/views/
├── Database/Migrations/
├── public/
└── Resources/assets/
```

## Adding a New Module

See [MODULE_DEVELOPMENT.md](./MODULE_DEVELOPMENT.md) for step-by-step instructions.