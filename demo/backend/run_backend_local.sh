#!/bin/bash
echo "django shell commands for local execution"
python ./manage.py migrate                                             # Apply database migrations
# python ./manage.py loaddata test_data

echo "Starting django server on 0.0.0.0:8000"
exec python ./manage.py runserver 0.0.0.0:8000                         # Start development web server
