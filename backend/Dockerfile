# Stage 1: Base PHP & Nginx Environment
FROM php:8.3-fpm-alpine AS base

WORKDIR /var/www/html

# Install runtime libraries, compile PHP extensions using virtual build deps, and purge build tools in a single layer
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpq \
    libpng \
    libjpeg-turbo \
    freetype \
    libzip \
    curl \
    oniguruma \
 && apk add --no-cache --virtual .build-deps \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    zip \
    unzip \
    git \
    $PHPIZE_DEPS \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
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
        opcache \
 && pecl install redis \
 && docker-php-ext-enable redis \
 && apk del .build-deps \
 && rm -rf /tmp/pear /var/cache/apk/*

# Copy Nginx & Supervisord configurations
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Stage 2: Build Production Composer Dependencies
FROM composer:2 AS composer-prod
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Stage 3: Production Target (Default)
FROM base AS prod
ENV APP_ENV=production
COPY --chown=www-data:www-data . .
COPY --chown=www-data:www-data --from=composer-prod /app/vendor ./vendor
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
 && find /var/www/html/storage /var/www/html/bootstrap/cache -type d -exec chmod 775 {} + \
 && find /var/www/html/storage /var/www/html/bootstrap/cache -type f -exec chmod 664 {} +
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]

# Stage 4: Build Development Composer Dependencies
FROM composer:2 AS composer-dev
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Stage 5: Development Target
FROM base AS dev
ENV APP_ENV=local
COPY . /var/www/html
COPY --from=composer-dev /app/vendor /var/www/html/vendor
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
