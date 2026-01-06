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

# Create Python virtual environment
RUN python3 -m venv /opt/venv

# Install Google Vision SDK in venv
RUN /opt/venv/bin/pip install --no-cache-dir google-cloud-vision

# Use venv python globally
ENV PATH="/opt/venv/bin:$PATH"

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy backend files
COPY . /var/www/html/

# Create uploads directory + permissions
RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html
