#!/bin/bash

# Site configuration options
SITE_URL="http://localhost:8080"
SITE_TITLE="Hide Block on Mobile Plugin"
ADMIN_USER=admin
ADMIN_PASS=password
ADMIN_EMAIL="admin@localhost.com"
DB_HOST="db"
DB_NAME="wordpress"
DB_USER="wp_user"
DB_PASS="wp_pass"

# Space-separated list of plugin ID's to install and activate
PLUGINS=""

# Set to true to wipe out and reset your wordpress install (on next container rebuild)
WP_RESET=false

############################################ DO NOT EDIT BELOW THIS LINE ############################################
echo "Setting up WordPress..."

# Get the directory of this script
DEVDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd /var/www/html;

if [ ! -f /var/www/html/xmlrpc.php ]; then 
    echo "Wordpress is not installed"
    exit 1
fi

# Check if we need to reset WordPress
if $WP_RESET ; then
    echo "Resetting WP"
    wp plugin delete $PLUGINS
    wp db reset --yes
    rm wp-config.php;
fi

if [ ! -f wp-config.php ]; then     
    echo "Configuring";
    wp config create --dbhost="$DB_HOST" --dbname="$DB_NAME" --dbuser="$DB_USER" --dbpass="$DB_PASS" --skip-check;
    wp core install --url="$SITE_URL" --title="$SITE_TITLE" --admin_user="$ADMIN_USER" --admin_email="$ADMIN_EMAIL" --admin_password="$ADMIN_PASS" --skip-email;
    #wp plugin install $PLUGINS --activate

    # Data import
    cd $DEVDIR/data/
    for f in *.sql; do
        wp db import $f
    done

    # Update WP with languages
    wp core update
    wp core update-db
    wp plugin update --all
    wp language theme update --all
    wp language plugin update --all
    echo "Finished :)"

else
    echo "Already configured :)"
fi