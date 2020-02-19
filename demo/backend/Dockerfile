FROM python:3.7
ENV PYTHONUNBUFFERED 1

# Install dependencies
RUN pip install -U pip pipenv
COPY Pipfile Pipfile.lock ./
COPY "django-ai-kit-auth-0.1.tar.gz" ./
RUN ls -laF
RUN pipenv install --deploy --system

RUN mkdir /src
WORKDIR /src
COPY . /src/

# Create empty env-file to avoid warnings
RUN touch ./demo/.env

EXPOSE 8000

CMD ["./run_backend.sh"]
