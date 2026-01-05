FROM php:8.2-apache


RUN apt-get update && apt-get install -y \
    libpq-dev \
    python3 \
    python3-pip \
    && docker-php-ext-install pdo pdo_pgsql


RUN a2enmod rewrite

COPY . /var/www/html/


COPY ../python-scripts /var/www/html/python-scripts


RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html
