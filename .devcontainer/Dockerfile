FROM php:8.4-apache-trixie

# Set the PHP configuration to development mode
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

# Set memory limit to unlimited in the php.ini
RUN sed -i 's/memory_limit = .*/memory_limit = -1/' $PHP_INI_DIR/php.ini

# Enable .htaccess files & mod_rewrite
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride all/' /etc/apache2/apache2.conf
RUN a2enmod rewrite

# Most of this comes directly from the WordPress docker image
# We don't inherit from it becase it has a VOLUME that causes issues
RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends ghostscript git less ssh-client mariadb-client;

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - ; \
	apt-get install -y nodejs;

# Install the PHP extensions, including XDebug
RUN set -ex; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		libfreetype6-dev \
		libjpeg-dev \
		libmagickwand-dev \
		libpng-dev \
		libzip-dev \
	; \
	docker-php-ext-configure gd --with-freetype --with-jpeg; \
	docker-php-ext-install -j "$(nproc)" \
		bcmath \
		exif \
		gd \
		mysqli \
		opcache \
		zip \
	; \
	pecl install imagick; \
  	pecl install xdebug; \
	docker-php-ext-enable imagick xdebug;

# XDebug settings
RUN echo "[XDebug]\nxdebug.mode=debug\nxdebug.start_with_request=trigger\nxdebug.client_port=9003" > $PHP_INI_DIR/conf.d/xdebug.ini

# WP recommended PHP settings
RUN { \
	echo 'opcache.memory_consumption=128'; \
	echo 'opcache.interned_strings_buffer=8'; \
	echo 'opcache.max_accelerated_files=4000'; \
	echo 'opcache.revalidate_freq=2'; \
	echo 'opcache.fast_shutdown=1'; \
} > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Install WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Install Composer
WORKDIR /tmp
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
		&& php composer-setup.php --quiet --install-dir=/usr/local/bin --filename=composer

# Add vscode user
RUN useradd -ms /bin/bash vscode \
		&& usermod -aG www-data vscode

WORKDIR /var/www/html
USER www-data

# Download WordPress
RUN wp core download --version=latest --path=/var/www/html --debug

# add dirs for plugin and theme dev
RUN mkdir -p /var/www/html/wp-content/plugins/plugin-dev; \
	mkdir -p /var/www/html/wp-content/themes/theme-dev;

USER root

# Set permissions
RUN chown -R www-data:www-data /var/www/html/
RUN chmod g+w -R /var/www/html/
RUN find /var/www/html/ -type d -exec chmod g+s {} \;

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*