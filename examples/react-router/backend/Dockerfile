FROM gitlab.ambient-innovation.com:443/ai/dependency_proxy/containers/python:3.7
ENV PYTHONUNBUFFERED 1

WORKDIR /examples/react-router/backend

# Install dependencies
RUN pip install -U pip pipenv
COPY ./examples/react-router/backend/Pipfile ./examples/react-router/backend/Pipfile.lock ./
COPY ./django-app /django-app

RUN pipenv install --deploy --system

COPY ./examples/react-router/backend .

# Create empty env-file to avoid warnings
RUN touch ./.env

EXPOSE 8000

CMD ["./run_backend.sh", "loadfixtures"]
