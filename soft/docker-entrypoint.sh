#!/bin/bash
set -e

# Replace nginx port with PORT env if set by Railway
PORT="${PORT:-8080}"
sed -i "s/listen 8080/listen ${PORT}/g" /etc/nginx/conf.d/default.conf

# Ensure storage link exists
ln -sfn /app/storage/app/public /app/public/storage 2>/dev/null || true

# Symlink public/public -> public as extra fallback
ln -sfn /app/public /app/public/public 2>/dev/null || true

# Fix permissions
chown -R www-data:www-data /app/storage /app/bootstrap/cache /app/public 2>/dev/null || true
chmod -R 775 /app/storage /app/bootstrap/cache 2>/dev/null || true

# Ensure Laravel Passport keys exist with strict 600 permissions for www-data
if [ ! -f /app/storage/oauth-private.key ] || [ ! -f /app/storage/oauth-public.key ]; then
    php artisan passport:keys --no-interaction 2>/dev/null || true
fi
chown www-data:www-data /app/storage/oauth-*.key 2>/dev/null || true
chmod 600 /app/storage/oauth-*.key 2>/dev/null || true

# Cache static configuration to avoid per-request config bootstrap overhead
php artisan config:cache 2>/dev/null || true

# Start php-fpm in background
php-fpm -D

# Start nginx in foreground
echo "Starting Nginx on port ${PORT}..."
exec nginx -g "daemon off;"
