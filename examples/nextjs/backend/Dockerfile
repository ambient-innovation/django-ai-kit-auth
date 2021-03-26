FROM python:3.7
ENV PYTHONUNBUFFERED 1

WORKDIR /examples/nextjs/backend

# Install dependencies
RUN pip install -U pip pipenv
COPY ./examples/nextjs/backend/Pipfile ./examples/nextjs/backend/Pipfile.lock ./
COPY ./django-app /django-app

RUN pipenv install --deploy --system

COPY ./examples/nextjs/backend .

# Create empty env-file to avoid warnings
RUN touch ./.env

EXPOSE 8000

CMD ["./run_backend.sh", "loadfixtures"]
