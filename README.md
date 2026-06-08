# ✂️ ClipLink — URL Shortener

> A full-stack URL shortening application built with **React + Vite** (frontend) and **Spring Boot + H2** (backend).  
> Paste a long URL, get a short link instantly. Simple, fast, and free.

---

## 📸 Preview

| Section | Description |
|---|---|
| 🌑 Dark glassmorphism UI | Animated orb background, grid overlay, and blur effects |
| ⚡ Instant shortening | Sub-100ms response after backend warmup |
| 📋 One-click copy | Copy the short link to clipboard with a toast notification |
| ⏳ Custom expiry | Pick a custom expiry date/time or use the 5-minute default |

---

## 🏗️ Project Structure

```
URL-Shortener-main/
│
├── src/                                  # Spring Boot Backend
│   └── main/
│       ├── java/com/java/urlshortener/
│       │   ├── UrlShortenerApplication.java   # Entry point
│       │   ├── config/
│       │   │   ├── CorsConfig.java            # CORS filter (allows localhost:3000)
│       │   │   └── StartupWarmup.java         # Pre-warms Hibernate on startup
│       │   ├── controller/
│       │   │   └── UrlShorteningController.java  # REST endpoints
│       │   ├── model/
│       │   │   ├── Url.java                   # JPA entity
│       │   │   ├── UrlDTO.java                # Request body
│       │   │   ├── UrlResponseDTO.java        # Success response
│       │   │   └── UrlErrorResponseDTO.java   # Error response
│       │   ├── repository/
│       │   │   └── UrlRepo.java               # JPA repository
│       │   └── services/
│       │       ├── Urlservices.java           # Service interface
│       │       └── UrlServicesImpl.java       # Business logic
│       └── resources/
│           └── application.properties        # App configuration
│
├── frontend/                             # React Frontend (Vite)
│   ├── index.html                        # HTML entry point
│   ├── vite.config.js                    # Vite + proxy config
│   └── src/
│       ├── main.jsx                      # React root
│       ├── App.jsx                       # Root component
│       ├── index.css                     # Global design system
│       └── components/
│           ├── UrlForm.jsx               # URL input + expiry picker
│           ├── ResultCard.jsx            # Success / error result
│           └── Toast.jsx                 # Notification toasts
│
├── pom.xml                              # Maven dependencies
└── README.md                            # This file
```

---

## ⚙️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Java 17** | Core language |
| **Spring Boot 3.1.5** | Web framework |
| **Spring Data JPA** | Database access layer |
| **Hibernate 6** | ORM |
| **H2 Database** | In-memory database (no setup needed) |
| **HikariCP** | Connection pooling |
| **Google Guava (Murmur3)** | URL hashing algorithm |
| **Apache Commons Lang** | String utilities |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Vanilla CSS** | Styling (no Tailwind) |
| **Inter + JetBrains Mono** | Fonts (Google Fonts) |
| **Fetch API** | HTTP requests to backend |

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** installed
- **Node.js 18+** and **npm** installed
- No database setup needed (H2 runs in memory)

---

### 1. Start the Backend (Spring Boot)

Open a terminal in the project root and run:

```bash
# Windows
mvnw.cmd spring-boot:run

# Mac / Linux
./mvnw spring-boot:run
```

> ⚠️ **If port 8080 is already in use** (e.g. by Apache), the backend uses **port 8081** by default.

Wait for the startup log:
```
Started UrlShortenerApplication in ~7 seconds
Warmup complete — DB reachable, 0 URLs stored.
```

The backend is ready at: `http://localhost:8081`

---

### 2. Start the Frontend (React + Vite)

Open a **second terminal** in the `frontend/` folder:

```bash
cd frontend
npm install       # first time only
npm run dev
```

The frontend is ready at: **[http://localhost:3000](http://localhost:3000)**

---

## 🔌 API Reference

### `POST /generate` — Shorten a URL

**Request Body:**
```json
{
  "url": "https://your-very-long-url.com/with/many/parts",
  "expirationDate": "2026-06-08T18:00"   // optional (ISO datetime-local format)
}
```

**Success Response:**
```json
{
  "originalUrl": "https://your-very-long-url.com/with/many/parts",
  "shortLink": "a1b2c3d4",
  "expirationDate": "2026-06-08T18:00:00"
}
```

**Error Response:**
```json
{
  "status": "404",
  "error": "There was an error processing your request. please try again."
}
```

---

### `GET /{shortLink}` — Redirect to Original URL

```
GET http://localhost:8081/a1b2c3d4
```

- ✅ If valid and not expired → **302 redirect** to the original URL
- ❌ If expired → JSON error response
- ❌ If not found → JSON error response

---

## 🧠 How It Works

```
User enters URL
      │
      ▼
React Frontend (localhost:3000)
      │  POST /generate
      ▼
Spring Boot Controller
      │
      ▼
UrlServicesImpl
  ├── Hashes URL + timestamp using Murmur3 → 8-char short code
  ├── Sets expiration (custom or default: now + 5 minutes)
  └── Saves to H2 in-memory database via JPA
      │
      ▼
Returns { shortLink, originalUrl, expirationDate }
      │
      ▼
React displays result + Copy button
```

When someone visits the short link:
```
Browser → GET /a1b2c3d4 → Spring Boot
  ├── Looks up short code in DB
  ├── Checks expiration date
  │     ├── Expired? → Delete from DB, return error
  │     └── Valid?   → HTTP 302 redirect to original URL
```

---

## 🎨 Frontend Features

| Feature | Detail |
|---|---|
| **Dark glassmorphism design** | Deep navy background with blurred glass cards |
| **Animated orb background** | 3 floating gradient orbs (purple, cyan, pink) |
| **Grid overlay** | Subtle CSS grid pattern for depth |
| **URL validation** | Client-side check before hitting the API |
| **Optional expiry date** | `datetime-local` picker, defaults to 5 minutes |
| **Copy to clipboard** | One-click copy with animated toast feedback |
| **Loading spinner** | Shown on the button during API call |
| **Error handling** | User-friendly error card with description |
| **Responsive design** | Works on mobile, tablet, and desktop |

---

## ⚡ Performance Optimizations

| Optimization | Effect |
|---|---|
| `spring.mvc.servlet.load-on-startup=1` | DispatcherServlet loads at startup, not on first request |
| `StartupWarmup.java` | Hibernate EntityManager pre-warmed via `count()` on startup |
| `HikariCP minimum-idle=2` | 2 DB connections kept alive and ready |
| `spring.jpa.open-in-view=false` | Prevents unnecessary DB session holding |
| `@CrossOrigin` on controller | Eliminates CORS preflight round-trip delays |

---

## 🗃️ Database

ClipLink uses **H2** — an embedded in-memory database.  
- **No installation required**
- Data is **reset on every backend restart**
- H2 Console available at: `http://localhost:8081/h2-console`
  - JDBC URL: `jdbc:h2:mem:Url`
  - Username: `sa`
  - Password: *(leave blank)*

---

## 🔧 Configuration

All settings are in [`src/main/resources/application.properties`](src/main/resources/application.properties):

```properties
# Server port (changed from 8080 to avoid conflicts)
server.port=8081

# Default link expiry: 5 minutes (set in UrlServicesImpl.java)
# Change plusMinutes(5) to your preferred value

# H2 Console (for inspecting data)
spring.h2.console.enabled=true
```

---

## 🐛 Common Issues

| Problem | Cause | Fix |
|---|---|---|
| `Could not reach the server` | Backend not running | Run `mvnw.cmd spring-boot:run` |
| `Port 8080 already in use` | Apache/another app on 8080 | Backend already configured to use **8081** |
| Short link says "Expired" | Default expiry is 5 minutes | Generate a new link or set a custom expiry |
| First request is slow | Cold JVM start | Only happens once; backend warms up on startup |

---

## 👩‍💻 Development Notes

- **Backend changes** require a restart (`Ctrl+C` then re-run `mvnw.cmd spring-boot:run`)
- **Frontend changes** are hot-reloaded automatically by Vite
- The short code is generated using **Murmur3 hash** of `url + timestamp` — this ensures uniqueness even for the same URL shortened multiple times
- H2 data is **not persisted** between backend restarts — switch to MySQL/PostgreSQL for production

---

## 📄 License

This project is for educational purposes.

---

<div align="center">
  Built with ❤️ using React + Spring Boot
</div>
