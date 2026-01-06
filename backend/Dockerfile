FROM php:8.2-apache

# Install system deps + Python + build tools
RUN apt-get update && apt-get install -y \
    libpq-dev \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    gcc \
    libffi-dev \
    libssl-dev \
    ca-certificates \
    && docker-php-ext-install pdo pdo_pgsql

# Install Google Vision SDK
RUN pip3 install --no-cache-dir google-cloud-vision

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy backend files
COPY backend/ /var/www/html/

# Ensure python scripts path exists
RUN ls -la /var/www/html/python-scripts

# Create uploads directory
RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html
