# Distributed URL Shortener

A modern distributed URL shortener built with Spring Boot, PostgreSQL, Redis, Docker, and React.

## Features

* Short URL generation
* Custom aliases
* Link expiration
* Analytics dashboard
* Rate limiting
* Redis caching
* Modern React frontend

## Tech Stack

### Backend

* Java 17
* Spring Boot 3.5.4
* Spring Data JPA
* PostgreSQL 16
* Redis 7
* Maven

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* Framer Motion

### Infrastructure

* Docker
* Docker Compose

---

# Project Structure

```
distributed-url-shortener/

├── backend/
│
├── frontend/
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

## Start Backend

```bash
cd backend

mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

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

* [x] Initial Spring Boot setup
* [x] PostgreSQL integration
* [x] Redis infrastructure
* [ ] URL generation service
* [ ] Redirect service
* [ ] Redis caching
* [ ] Analytics system
* [ ] Rate limiting
* [ ] React dashboard
* [ ] Deployment setup
