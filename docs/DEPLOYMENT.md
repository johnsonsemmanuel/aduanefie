# Deployment Guide

## Overview

This guide covers deploying the Aduanefie Agricultural Marketplace platform to production.

## Prerequisites

- PHP 8.1+
- Composer 2.x
- Node.js 18+ & NPM
- SQLite, MySQL 8.0+, or PostgreSQL 14+
- Web server: Nginx or Apache
- Redis (optional, for caching and queues)

## Server Preparation

### 1. Install PHP Extensions

Required PHP extensions:
- `bcmath`
- `ctype`
- `fileinfo`
- `filter`
- `hash`
- `mbstring`
- `openssl`
- `pdo`
- `pdo_sqlite` (for SQLite) or `pdo_mysql` / `pdo_pgsql`
- `tokenizer`
- `xml`
- `zip`

```bash
# Ubuntu/Debian example
sudo apt-get install php8.1-{bcmath,ctype,fileinfo,filter,hash,mbstring,openssl,pdo,tokenizer,xml,zip}
```

### 2. Install Composer

```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
```

### 3. Install Node.js

```bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Application Deployment

### 1. Clone the Repository

```bash
git clone <repository-url> /var/www/aduanefie
cd /var/www/aduanefie
```

### 2. Install PHP Dependencies

```bash
cd soft
composer install --optimize-autoloader --no-dev
```

### 3. Install Node Dependencies

```bash
npm install
npm run production
```

### 4. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```env
APP_NAME=Aduanefie
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aduanefie
DB_USERNAME=aduanefie
DB_PASSWORD=your-password

BROADCAST_DRIVER=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=public
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=hello@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Run Migrations

```bash
php artisan migrate --force
```

### 7. Seed Database (Optional)

```bash
php artisan db:seed --force
```

### 8. Cache Configuration

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 9. Set Up Storage Link

```bash
php artisan storage:link
```

### 10. Set File Permissions

```bash
sudo chown -R www-data:www-data /var/www/aduanefie/soft
sudo chmod -R 755 /var/www/aduanefie/soft/storage
sudo chmod -R 775 /var/www/aduanefie/soft/bootstrap/cache
```

## Web Server Configuration

### Nginx Example

Create `/etc/nginx/sites-available/aduanefie`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/aduanefie/soft/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/aduanefie /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Apache Example

Create `/etc/apache2/sites-available/aduanefie.conf`:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    DocumentRoot /var/www/aduanefie/soft/public

    <Directory /var/www/aduanefie/soft/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/aduanefie_error.log
    CustomLog ${APACHE_LOG_DIR}/aduanefie_access.log combined
</VirtualHost>
```

Enable the site:
```bash
sudo a2ensite aduanefie
sudo a2enmod rewrite
sudo systemctl reload apache2
```

## SSL / HTTPS

Use Let's Encrypt for free SSL certificates:

```bash
sudo apt-get install certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Or for Apache:
```bash
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

## Queue Worker (Production)

Set up a systemd service for the queue worker:

```ini
# /etc/systemd/system/aduanefie-worker.service
[Unit]
Description=Aduanefie Laravel Queue Worker
After=network.target

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/aduanefie/soft/artisan queue:work --sleep=3 --tries=3
StartLimitBurst=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable aduanefie-worker
sudo systemctl start aduanefie-worker
```

## Scheduler

Add to crontab:
```bash
* * * * * cd /var/www/aduanefie/soft && php artisan schedule:run >> /dev/null 2>&1
```

## Backup

### Database Backup

```bash
# MySQL
mysqldump -u aduanefie -p aduanefie > backup_$(date +%Y%m%d).sql

# SQLite
cp soft/database.sqlite backup_$(date +%Y%m%d).sqlite
```

### File Backup

```bash
tar -czf backup_files_$(date +%Y%m%d).tar.gz soft/storage/app/public/
```

## Monitoring

- Health check endpoint: `GET /` (returns application status)
- Laravel logs: `soft/storage/logs/laravel.log`
- Web server logs: Nginx/Apache error logs
- Queue logs: Check systemd journal for `aduanefie-worker`

## Maintenance

### Clearing Caches

```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

### Running Migrations (Production)

```bash
php artisan migrate --force
```

### Updating the Application

```bash
git pull origin master
cd soft
composer install --optimize-autoloader --no-dev
npm install
npm run production
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 500 Error | Check `soft/storage/logs/laravel.log` |
| Permission Denied | Run `chown -R www-data:www-data` on storage/ and bootstrap/cache/ |
| Migration Fails | Check database credentials in `.env` |
| Assets Not Loading | Run `php artisan storage:link` and `npm run production` |
| Queue Not Processing | Check `systemctl status aduanefie-worker` |