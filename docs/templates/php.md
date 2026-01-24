# php

PHP, Composer, and Laravel Artisan

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `php --version` | Check PHP version |
| `php -v` | Check PHP version |
| `php -i` | Show PHP info |
| `php -m` | List PHP modules |
| `php --ini` | Show PHP ini files |
| `composer --version` | Check Composer version |
| `composer -V` | Check Composer version |
| `composer show` | Show packages |
| `composer info` | Show package info |
| `composer search` | Search Packagist |
| `composer outdated` | List outdated packages |
| `composer licenses` | Show licenses |
| `composer depends` | Show dependencies |
| `composer prohibits` | Show blockers |
| `composer suggests` | Show suggestions |
| `composer validate` | Validate composer.json |
| `composer config --list` | List config |
| `php artisan --version` | Check Laravel version |
| `php artisan list` | List Artisan commands |
| `php artisan help` | Artisan help |
| `php artisan route:list` | List routes |
| `php artisan about` | Show application info |
| `php artisan config:show` | Show config |
| `php artisan env` | Show environment |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `composer dump-autoload` | Regenerate autoloader |
| `composer dumpautoload` | Regenerate autoloader |
| `php artisan serve` | Start dev server |
| `php artisan tinker` | Start Tinker REPL |
| `php artisan make:controller` | Create controller |
| `php artisan make:model` | Create model |
| `php artisan make:migration` | Create migration |
| `php artisan make:seeder` | Create seeder |
| `php artisan make:factory` | Create factory |
| `php artisan make:middleware` | Create middleware |
| `php artisan make:command` | Create command |
| `php artisan make:event` | Create event |
| `php artisan make:listener` | Create listener |
| `php artisan make:job` | Create job |
| `php artisan make:mail` | Create mail |
| `php artisan make:notification` | Create notification |
| `php artisan make:policy` | Create policy |
| `php artisan make:request` | Create request |
| `php artisan make:resource` | Create resource |
| `php artisan make:test` | Create test |
| `php artisan migrate:status` | Migration status |
| `php artisan queue:listen` | Listen for jobs |
| `php artisan queue:work` | Process jobs |
| `phpunit` | Run PHPUnit tests |
| `php artisan test` | Run Laravel tests |
| `php-cs-fixer fix` | Fix code style |
| `pest` | Run Pest tests |
| `php` | Run PHP script |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `composer install` | Install packages |
| `composer update` | Update packages |
| `composer require` | Add package |
| `composer remove` | Remove package |
| `composer global require` | Install global package |
| `composer clear-cache` | Clear Composer cache |
| `composer create-project` | Create new project |
| `php artisan migrate` | Run migrations |
| `php artisan migrate:rollback` | Rollback migrations |
| `php artisan migrate:reset` | Reset migrations |
| `php artisan migrate:refresh` | Refresh migrations |
| `php artisan migrate:fresh` | Fresh migrations |
| `php artisan db:seed` | Seed database |
| `php artisan db:wipe` | Wipe database |
| `php artisan cache:clear` | Clear cache |
| `php artisan config:clear` | Clear config cache |
| `php artisan config:cache` | Cache config |
| `php artisan route:clear` | Clear route cache |
| `php artisan route:cache` | Cache routes |
| `php artisan view:clear` | Clear view cache |
| `php artisan view:cache` | Cache views |
| `php artisan optimize` | Optimize application |
| `php artisan optimize:clear` | Clear optimizations |
