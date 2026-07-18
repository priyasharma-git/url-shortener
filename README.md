# Distributed URL Shortener

A modern distributed URL shortening platform built with Spring Boot, React, PostgreSQL, Redis, and Docker.

The application supports creating short URLs, redirecting users, tracking analytics, custom aliases, rate limiting, and expiring links.

---

# Features

* Short URL generation
* Custom aliases
* Link expiration
* Analytics dashboard
* Rate limiting
* Redis caching
* Modern React frontend

---

# Tech Stack

## Backend

* Java 17
* Spring Boot 3.5.4
* Spring Data JPA
* PostgreSQL 16
* Redis 7
* Maven

## Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* Framer Motion

## Infrastructure

* Docker
* Docker Compose

---

# Project Structure

```
distributed-url-shortener/

├── backend/
│   ├── src/
│   └── README.md
│
├── frontend/
│   ├── src/
│   └── README.md
│
├── docker-compose.yml
│
└── README.md
```

---

# Running Locally

## Start Infrastructure

From the project root:

```bash
docker compose up -d
```

This starts:

* PostgreSQL on port 5432
* Redis on port 6379
* pgAdmin on port 5050
* Redis Insight on port 5540

---

## Start Backend

```bash
cd backend

mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

---

## Start Frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# Development Tools

## PostgreSQL UI

Open:

```
http://localhost:5050
```

Login:

```
Email:
admin@urlshortener.com

Password:
admin
```

Database connection:

```
Host: postgres
Port: 5432
Database: url_shortener
Username: postgres
Password: postgres
```

---

## Redis UI

Redis Insight:

```
http://localhost:5540
```

Connection:

```
Host: redis
Port: 6379
```

---

# Architecture

```
React Frontend

        |
        |

Spring Boot API

        |
 -----------------
 |               |
PostgreSQL     Redis
```

---

# Development Roadmap

## Backend

* [x] Initial Spring Boot setup
* [x] PostgreSQL integration
* [x] Redis infrastructure
* [ ] URL generation service
* [ ] Base62 short code generation
* [ ] Redirect service
* [ ] Redis caching
* [ ] Analytics system
* [ ] Rate limiting
* [ ] Expiration handling

## Frontend

* [ ] React setup
* [ ] Dashboard UI
* [ ] URL creation interface
* [ ] Analytics visualization
* [ ] Animations
* [ ] Responsive design

## Deployment

* [ ] Docker production setup
* [ ] CI/CD pipeline
* [ ] Cloud deployment