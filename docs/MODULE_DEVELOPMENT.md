# Module Development Guide

## Overview

This guide walks you through creating a new agricultural module for Aduanefie. Each module is a self-contained Laravel package-like structure that plugs into the platform.

## Prerequisites

- Familiarity with Laravel service providers, routes, controllers, and Eloquent models
- Understanding of the module directory structure (see MODULES.md)

## Step 1: Create Module Directory

Create the module directory under `soft/modules/`:

```bash
mkdir -p soft/modules/<ModuleName>/{
    Providers,
    Config,
    Entities,
    Http/Controllers/Api/Provider,
    Http/Controllers/Api/Public,
    Http/Controllers/Web/Admin,
    Routes/api/v1/provider,
    Routes/api/v1/public,
    Routes/web/admin,
    Routes/web/vendor,
    Resources/lang/en,
    Resources/views,
    Database/Migrations,
    public,
    Resources/assets/js,
    Resources/assets/sass
}
```

Replace `<ModuleName>` with your module name (e.g., `Equipment`, `Inputs`, `Consulting`).

## Step 2: Create module.json

Create `soft/modules/<ModuleName>/module.json`:

```json
{
    "name": "<ModuleName>",
    "alias": "<modulename>",
    "description": "Description of your module",
    "keywords": ["keyword1", "keyword2"],
    "priority": 0,
    "providers": [
        "Modules\\<ModuleName>\\Providers\\<ModuleName>ServiceProvider"
    ],
    "aliases": {},
    "files": [],
    "requires": []
}
```

Key fields:
- `name` - Human-readable name (e.g., "Equipment Rental")
- `alias` - URL-friendly lowercase alias (e.g., "equipment")
- `providers` - Must reference your ServiceProvider class

## Step 3: Create ServiceProvider

Create `soft/modules/<ModuleName>/Providers/<ModuleName>ServiceProvider.php`:

```php
<?php

namespace Modules\<ModuleName>\Providers;

use Illuminate\Support\ServiceProvider;

class <ModuleName>ServiceProvider extends ServiceProvider
{
    protected $moduleName = '<ModuleName>';
    protected $moduleNameLower = '<modulename>';

    public function boot()
    {
        $this->registerTranslations();
        $this->registerConfig();
        $this->registerViews();
        $this->loadMigrationsFrom(module_path($this->moduleName, 'Database/Migrations'));
    }

    public function register()
    {
        $this->app->register(RouteServiceProvider::class);
    }

    protected function registerConfig()
    {
        $this->publishes([
            module_path($this->moduleName, 'Config/config.php') => config_path($this->moduleNameLower . '.php'),
        ], 'config');
        $this->mergeConfigFrom(
            module_path($this->moduleName, 'Config/config.php'), $this->moduleNameLower
        );
    }

    public function registerViews()
    {
        $viewPath = resource_path('views/modules/' . $this->moduleNameLower);
        $sourcePath = module_path($this->moduleName, 'Resources/views');
        $this->publishes([$sourcePath => $viewPath], ['views', $this->moduleNameLower . '-module-views']);
        $this->loadViewsFrom(array_merge($this->getPublishableViewPaths(), [$sourcePath]), $this->moduleNameLower);
    }

    public function registerTranslations()
    {
        $langPath = resource_path('lang/modules/' . $this->moduleNameLower);
        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $this->moduleNameLower);
        } else {
            $this->loadTranslationsFrom(module_path($this->moduleName, 'Resources/lang'), $this->moduleNameLower);
        }
    }

    public function provides()
    {
        return [];
    }

    private function getPublishableViewPaths(): array
    {
        $paths = [];
        foreach (config('view.paths') as $path) {
            if (is_dir($path . '/modules/' . $this->moduleNameLower)) {
                $paths[] = $path . '/modules/' . $this->moduleNameLower;
            }
        }
        return $paths;
    }
}
```

## Step 4: Create RouteServiceProvider

Create `soft/modules/<ModuleName>/Providers/RouteServiceProvider.php`:

```php
<?php

namespace Modules\<ModuleName>\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    protected $moduleNamespace = 'Modules\<ModuleName>\Http\Controllers';

    public function boot()
    {
        parent::boot();
    }

    public function map()
    {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
    }

    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->prefix('admin')
            ->as('admin.')
            ->namespace($this->moduleNamespace)
            ->group(module_path('<ModuleName>', '/Routes/web/admin/admin.php'));
    }

    protected function mapApiRoutes()
    {
        Route::prefix('api/v1')
            ->middleware('api')
            ->namespace($this->moduleNamespace)
            ->group(module_path('<ModuleName>', '/Routes/api/v1/provider/api.php'));

        Route::prefix('api/v1')
            ->middleware('api')
            ->namespace($this->moduleNamespace)
            ->group(module_path('<ModuleName>', '/Routes/api/v1/public/api.php'));
    }
}
```

## Step 5: Create Config

Create `soft/modules/<ModuleName>/Config/config.php`:

```php
<?php

return [
    'name' => '<ModuleName>',
];
```

## Step 6: Create Routes

### Provider API Routes

Create `soft/modules/<ModuleName>/Routes/api/v1/provider/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use Modules\<ModuleName>\Http\Controllers\Api\Provider\<ModuleName>Controller;

Route::group(['prefix' => '<modulename>', 'as' => '<modulename>.', 'middleware' => ['localization']], function () {
    Route::group(['prefix' => 'provider', 'middleware' => ['vendor.api']], function () {
        Route::get('items/list', [<ModuleName>Controller::class, 'itemList']);
        // Add more routes as needed
    });
});
```

### Public API Routes

Create `soft/modules/<ModuleName>/Routes/api/v1/public/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use Modules\<ModuleName>\Http\Controllers\Api\Public\<ModuleName>Controller;

Route::group(['prefix' => '<modulename>', 'as' => '<modulename>.', 'middleware' => ['localization']], function () {
    Route::group(['middleware' => 'module-check'], function () {
        Route::get('items/list', [<ModuleName>Controller::class, 'itemList']);
        // Add more routes as needed
    });
});
```

### Web Admin Routes

Create `soft/modules/<ModuleName>/Routes/web/admin/admin.php`:

```php
<?php

use Modules\<ModuleName>\Http\Controllers\Web\Admin\<ModuleName>DashboardController;

Route::group(['prefix' => '<modulename>', 'as' => '<modulename>.<|constrain|>'], function () {
    Route::get('/dashboard', [<ModuleName>DashboardController::class, 'index'])->name('dashboard');
    // Add more web routes as needed
});
```

## Step 7: Create Controllers

### Provider API Controller

Create `soft/modules/<ModuleName>/Http/Controllers/Api/Provider/<ModuleName>Controller.php`:

```php
<?php

namespace Modules\<ModuleName>\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class <ModuleName>Controller extends Controller
{
    public function itemList(Request $request)
    {
        // Your logic here
        return response()->json(['items' => []], 200);
    }
}
```

### Public API Controller

Create `soft/modules/<ModuleName>/Http/Controllers/Api/Public/<ModuleName>Controller.php`:

```php
<?php

namespace Modules\<ModuleName>\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class <ModuleName>Controller extends Controller
{
    public function itemList(Request $request)
    {
        // Your logic here
        return response()->json(['items' => []], 200);
    }
}
```

### Web Admin Controller

Create `soft/modules/<ModuleName>/Http/Controllers/Web/Admin/<ModuleName>DashboardController.php`:

```php
<?php

namespace Modules\<ModuleName>\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;

class <ModuleName>DashboardController extends Controller
{
    public function index()
    {
        return view('<modulename>::admin.dashboard.index');
    }
}
```

## Step 8: Create Models (Entities)

Create Eloquent models in `soft/modules/<ModuleName>/Entities/`:

```php
<?php

namespace Modules\<ModuleName>\Entities;

use Illuminate\Database\Eloquent\Model;

class <EntityName> extends Model
{
    protected $table = '<table_name>';
    protected $fillable = ['field1', 'field2'];
    protected $casts = ['id' => 'integer'];
}
```

## Step 9: Create Migrations

Create database migrations in `soft/modules/<ModuleName>/Database/Migrations/`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('<table_name>', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('<table_name>');
    }
};
```

## Step 10: Create Language File

Create `soft/modules/<ModuleName>/Resources/lang/en/<modulename>.php`:

```php
<?php

return [
    'name' => '<ModuleName>',
    'description' => 'Module description',
    'created' => 'Created successfully.',
    'updated' => 'Updated successfully.',
    'deleted' => 'Deleted successfully.',
    'not_found' => 'Not found.',
];
```

## Step 11: Register Module

Add the module to `soft/modules_statuses.json`:

```json
{
    "Gateways": true,
    "Rental": true,
    "service": true,
    "<ModuleName>": true
}
```

## Step 12: Run Migrations

```bash
cd soft
php artisan migrate
```

## Best Practices

1. **Naming Convention** - Use PascalCase for class names, lowercase for aliases and database tables
2. **Middleware** - Always wrap provider routes with `vendor.api` middleware and public routes with `module-check` middleware
3. **Localization** - Wrap route groups with `['middleware' => ['localization']]`
4. **Validation** - Use Laravel's request validation for all API inputs
5. **Responses** - Return consistent JSON format: `{ success, data, errors, message }`
6. **Assets** - Use `webpack.mix.js` to compile module-specific JS and CSS
7. **Testing** - Add tests under `soft/tests/` for module functionality

## Example: Creating a "Equipment Rental" Module

1. `mkdir -p soft/modules/Equipment/...`
2. Create `module.json` with alias `equipment`
3. Create `EquipmentServiceProvider.php` and `RouteServiceProvider.php`
4. Create routes for equipment listing, booking, and management
5. Create `Equipment` model and migration
6. Add `"Equipment": true` to `modules_statuses.json`
7. Run `php artisan migrate`