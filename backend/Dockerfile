FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpq-dev \
    python3 \
    && docker-php-ext-install pdo pdo_pgsql

RUN a2enmod rewrite

# Copy backend PHP files
COPY backend/ /var/www/html/

# Copy python scripts
COPY python-scripts/ /var/www/python-scripts/

# Create uploads directory and fix permissions
RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www

