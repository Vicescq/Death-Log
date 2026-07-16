# Death Log

A local-first web app for logging and visualizing video game deaths. Create a game, add profiles and subjects (bosses, locations, etc.) within it, and log deaths as you go. Data lives on your device by default; sign in to unlock cloud backups and community-wide stats.

**Features:** death logging with profile groups and time tracking, a stats dashboard (bar/pie/line/calendar/graph charts), multi-tab sync, JSON export/import, cloud backups, opt-in global stats, and installable PWA support.

## Stack

- **`client/`** - React 19 + TypeScript + Vite, Zustand, IndexedDB (Dexie), ECharts, Tailwind/DaisyUI
- **`server/`** - ASP.NET Core minimal API (.NET 10), PostgreSQL via EF Core, Clerk auth

