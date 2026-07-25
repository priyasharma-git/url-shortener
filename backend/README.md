# URL Shortener Backend

Spring Boot backend service for the distributed URL shortener.

## Tech Stack

* Java 17
* Spring Boot 3.5.4
* PostgreSQL 16
* Redis 7
* Maven

---

# Requirements

Install:

* Java 17
* Maven
* Docker Desktop

---

# Database Configuration

PostgreSQL:

```
Host: localhost
Port: 5432
Database: url_shortener
Username: postgres
Password: postgres
```

Redis:

```
Host: localhost
Port: 6379
```

---

# Running the Application

Start infrastructure from project root:

```bash
docker compose up -d
```

Move into backend:

```bash
cd backend
```

Run:

```bash
mvn spring-boot:run
```

For a clean build:

```bash
mvn clean spring-boot:run
```

---

# API

## Create Short URL

```
POST /api/url/shorten
```

Current request:

```
https://example.com
```

---

# Project Structure

```
backend/

src/main/java/com/urlShortner/backend/

├── controller
├── service
├── repository
├── entity
└── dto
```
