FROM python:3.7
ENV PYTHONUNBUFFERED 1

WORKDIR /demo/backend

# Install dependencies
RUN pip install -U pip pipenv
COPY ./demo/backend/Pipfile ./demo/backend/Pipfile.lock ./
COPY ./django-app /django-app

RUN pipenv install --deploy --system

COPY ./demo/backend /demo/backend

# Create empty env-file to avoid warnings
RUN touch ./demo/.env

EXPOSE 8000

CMD ["./run_backend.sh", "loadfixtures"]
