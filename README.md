<div align="center">
  <img src="./public/cloak-mark.svg" alt="Cloak Logo" width="80" height="80" />

# Cloak

**Self-Destructing Ephemeral 1-on-1 Private Messaging**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![ElysiaJS](https://img.shields.io/badge/Elysia-1.4-F50057?style=flat&logo=bun&logoColor=white)](https://elysiajs.com/)
[![Upstash Redis](https://img.shields.io/badge/Upstash_Redis-1.37-00E9A3?style=flat&logo=upstash&logoColor=white)](https://upstash.com/)
[![License](https://img.shields.io/badge/License-MIT-red?style=flat)](./LICENSE)
</div>

---

## System Overview

**Cloak** is an ultra-private, self-destructing 1-on-1 chat application. It allows two people to open an ephemeral conversation with custom expiration timers (5 min, 10 min, 30 min, 1 hour). When the timer expires or the room is destroyed, all chat history and metadata are permanently purged with zero server persistence.

---

## Application Video Walkthrough

<div align="center">

https://github.com/user-attachments/assets/YOUR-VIDEO-LINK-HERE

  <p align="center">
    <em>Demonstration of instant room creation, private link invitation, real-time WebSocket messaging, and auto-destruction cleanup.</em>
  </p>
</div>

---

## Technology Stack

### Frontend Architecture

- **Framework**: Next.js 16.2.3 (App Router, Turbopack)
- **UI Library**: React 19.2.4
- **Language**: TypeScript 5.0 (Strict Mode Enabled)
- **Styling**: Tailwind CSS 4.0 (`@theme` variables, CSS module isolation)
- **Icons & Theme**: Custom SVG Icons, Dark & Light Mode Support

### Server & Realtime Infrastructure

- **Backend API**: ElysiaJS 1.4.28 with Eden RPC client integration
- **Database & Storage**: Upstash Redis 1.37.0 (Ephemeral key-value & TTL timers)
- **Realtime Messaging**: Upstash Realtime 1.0.3 (Serverless WebSocket channels)
- **Runtime**: Bun 1.1+ / Node.js 20+

### Quality Assurance & Tooling

- **Code Formatting & Linting**: ESLint 9 (Flat Config), Next.js ESLint Plugin
- **Validation**: Zod 4.3 schema validation
- **State Management**: TanStack Query 5.99

---

## Key Features

- **Strict 2-Person Limit** — Rooms strictly enforce a maximum of 2 participants for true 1-on-1 privacy.
- **Custom Room Lifetimes** — Choose room expiration timers (5 min, 10 min, 30 min, or 1 hour).
- **Instant WebSockets** — Low-latency real-time chat powered by Upstash Realtime channels.
- **Zero Persistence Auto-Destruction** — All room data and messages are erased automatically when time runs out.
- **Anonymous Aliases & Avatars** — Custom usernames and customizable avatar color themes.
- **Mobile Optimized** — Clean, responsive user experience tailored for desktop and mobile viewports.

---

## Getting Started

### Prerequisites

- **Bun**: `v1.1.0`+ (Recommended) or **Node.js**: `v20.9.0`+
- **Upstash Redis Account**: Free database instance from [Upstash](https://upstash.com)

### Installation & Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/kuldeeprajput-dev/cloak-space.git
   cd cloak-space
   ```

2. **Install Dependencies**:

   ```bash
   bun install
   # or npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:

   ```bash
   cp .env.example .env.local
   ```

4. **Launch Development Server**:
   ```bash
   bun run dev
   # or npm run dev
   ```
   Access the workspace at `http://localhost:3000`.

---

## Environment Configuration

Configure server-side environment variables inside `.env.local`:

```env
# Upstash Redis & Realtime Credentials
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here
```

### Key Resolution Matrix

| Variable | Scope | Primary Purpose | Required |
| :--- | :--- | :--- | :--- |
| `UPSTASH_REDIS_REST_URL` | Server-only | REST API endpoint for Upstash Redis database. | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Server-only | Authentication token for Redis read/write & WebSockets. | Yes |

---

## License

This project is licensed under the [MIT License](./LICENSE) - see the [`LICENSE`](./LICENSE) file for details.

---

## Support & Feedback

If you find this project helpful, please consider giving it a ⭐ star on GitHub!
