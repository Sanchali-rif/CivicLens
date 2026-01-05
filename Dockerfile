FROM php:8.2-apache

# Install PostgreSQL + Python
RUN apt-get update && apt-get install -y \
    libpq-dev \
    python3 \
    python3-pip \
    && docker-php-ext-install pdo pdo_pgsql

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy backend files
COPY backend/ /var/www/html/

# Copy Python scripts
COPY python-scripts/ /var/www/python-scripts/

# Create uploads directory and fix permissions
RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html /var/www/python-scripts \
    && chmod -R 755 /var/www/html /var/www/python-scripts

# Set working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80
