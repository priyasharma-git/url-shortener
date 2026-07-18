# URL Shortener Backend

A Spring Boot backend for a URL Shortener application.

## Tech Stack

* Java 17
* Spring Boot 3.5.4
* PostgreSQL 16
* Redis 7
* Maven
* Docker

---

## Prerequisites

Make sure the following are installed:

* Java 17
* Maven
* Docker Desktop

---

## Starting the Infrastructure

From the project root (where `docker-compose.yml` is located):

```bash
docker compose up -d
```

This starts:

* PostgreSQL (Port 5432)
* Redis (Port 6379)

To verify:

```bash
docker ps
```

To stop the containers:

```bash
docker compose down
```

---

## Running the Backend

Navigate to the backend project:

```bash
cd backend
```

Run the application:

```bash
mvn spring-boot:run
```

If you want a clean build first:

```bash
mvn clean spring-boot:run
```

---

## Default Configuration

### PostgreSQL

* Host: `localhost`
* Port: `5432`
* Database: `url_shortener`
* Username: `postgres`
* Password: `postgres`

### Redis

* Host: `localhost`
* Port: `6379`

---

## Verify the Application

When the application starts successfully, you should see logs similar to:

```
Tomcat started on port 8080
Started BackendApplication
```

The backend will be available at:

```
http://localhost:8080
```

---

## Stopping the Backend

Press:

```
Ctrl + C
```

Then stop Docker containers if needed:

```bash
docker compose down
```
