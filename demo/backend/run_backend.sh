#!/bin/bash

./manage.py migrate # Apply database migrations

# Load fixtures if argument was passed like ./run_backend.sh loadfixtures
if [ "$1" = "loadfixtures" ]
then
  ./manage.py loaddata test_data
fi

# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn apps.config.wsgi:application --bind 0.0.0.0:8000 --workers 3
