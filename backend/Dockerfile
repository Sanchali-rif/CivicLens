FROM php:8.2-apache

# Install PostgreSQL + Python
RUN apt-get update && apt-get install -y \
    libpq-dev \
    python3 \
    python3-pip \
    && docker-php-ext-install pdo pdo_pgsql

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy backend PHP files
COPY backend/ /var/www/html/

# Copy python scripts
COPY python-scripts/ /var/www/html/python-scripts/

# Create uploads directory + permissions
RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html
