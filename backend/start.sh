#!/bin/sh

# Create Laravel directories
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Set permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Clear old caches
php artisan optimize:clear

# Cache configuration after Render injects environment variables
php artisan config:cache
php artisan route:cache
php artisan view:cache

# (Optional) Run migrations automatically
php artisan migrate --force

# Start PHP-FPM
php-fpm -D

# Start Nginx
nginx -g "daemon off;"