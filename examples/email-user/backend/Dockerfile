ARG DOCKER_IMAGE_PREFIX=""
FROM ${DOCKER_IMAGE_PREFIX}python:3.9
ENV PYTHONUNBUFFERED 1

WORKDIR /examples/email-user/backend

# Install dependencies
RUN pip install -U pip pipenv
COPY ./examples/email-user/backend/Pipfile ./examples/email-user/backend/Pipfile.lock ./
COPY ./django-app /django-app

RUN pipenv install --deploy --system

COPY ./examples/email-user/backend .

# Create empty env-file to avoid warnings
RUN touch ./demo/.env

EXPOSE 8000

CMD ["./run_backend.sh", "loadfixtures"]
