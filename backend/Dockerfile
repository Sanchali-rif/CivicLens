FROM php:8.2-apache

# Install PostgreSQL PDO driver
RUN apt-get update && apt-get install -y \
    libpq-dev \
    python3 \
    python3-pip \
    && docker-php-ext-install pdo pdo_pgsql

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy PHP backend files (Dockerfile is already in backend/)
COPY . /var/www/html/

# Copy python scripts from repo root
COPY ../python-scripts /var/www/python-scripts

# Create uploads directory and fix permissions
RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www

WORKDIR /var/www/html
