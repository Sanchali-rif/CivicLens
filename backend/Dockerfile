FROM php:8.2-apache

# Install system deps + Python + Postgres PDO
RUN apt-get update && apt-get install -y \
    libpq-dev \
    python3 \
    python3-pip \
    && docker-php-ext-install pdo pdo_pgsql
    RUN pip3 install google-cloud-vision

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy ALL backend files (we are already in backend context)
COPY . /var/www/html/

# Create uploads dir + permissions
RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html
