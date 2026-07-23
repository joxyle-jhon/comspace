# Stage 1: Build Composer Dependencies
FROM composer:2 AS composer-build
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Stage 2: Final Production Runtime Image
FROM php:8.3-fpm-alpine

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    oniguruma-dev \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        opcache

# Install Redis PHP extension via PECL
RUN pecl install redis && docker-php-ext-enable redis

# Remove build-only OS packages
RUN apk del $PHPIZE_DEPS

# Copy custom Nginx configuration
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Copy custom Supervisord configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy application files
COPY --chown=www-data:www-data . .

# Copy vendor directory from composer-build stage
COPY --chown=www-data:www-data --from=composer-build /app/vendor ./vendor

# Set permissions for storage and bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose HTTP port
EXPOSE 80

# Start container via entrypoint
ENTRYPOINT ["/entrypoint.sh"]
