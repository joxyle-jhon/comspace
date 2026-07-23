#!/bin/sh
set -e

if [ "$APP_ENV" = "production" ]; then
    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true
    find /var/www/html/storage /var/www/html/bootstrap/cache -type d -exec chmod 775 {} + 2>/dev/null || true
    find /var/www/html/storage /var/www/html/bootstrap/cache -type f -exec chmod 664 {} + 2>/dev/null || true

    php artisan package:discover --ansi
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
else
    # In development mode, discover packages dynamically without modifying host file permissions
    if [ -f "artisan" ]; then
        php artisan package:discover --ansi
    fi
fi

# Execute supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
