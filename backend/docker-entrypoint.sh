
set -e


if [ -f /etc/secrets/service-account.json ]; then
  cp /etc/secrets/service-account.json /tmp/service-account.json
  chmod 644 /tmp/service-account.json
fi

export GOOGLE_APPLICATION_CREDENTIALS=/tmp/service-account.json

# Start Apache
exec apache2-foreground
