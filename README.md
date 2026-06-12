<div align="center">
  <h1>☕ OmahKopi78</h1>
  <p><strong>Modern Cafe Website & Management Dashboard</strong></p>
  <p>
    <a href="#overview">Overview</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

<hr/>

## 📖 Overview

**OmahKopi78** is a comprehensive web application built for a modern cafe. It provides a beautiful public-facing website for customers to explore menus, facilities, and make reservations, alongside a secure administrative dashboard for staff to manage cafe operations and content dynamically.

---

## ✨ Features

### 🌐 Public Website
- **Dynamic Menu Showcase:** Customers can browse food and beverage menus categorized logically.
- **Facility & Gallery Exploration:** View cafe facilities and aesthetic spots.
- **Online Reservations:** A seamless booking system for reserving tables.
- **Blog & Contact:** Keep customers updated with news and provide easy ways to reach out.

### 🛡️ Admin Dashboard (CMS)
- **Secure Authentication:** Protected admin routes powered by Clerk.
- **Menu Management:** Complete CRUD operations for menu items and menu categories.
- **Facility & Spot Management:** Add, edit, and manage cafe facilities and gallery images.
- **Reservation Handling:** Manage available reservation tables and bookings.
- **Media Uploads:** Built-in file upload API for managing images dynamically.

---

## 🗂️ Project Structure

The project follows an organized Astro architecture with API endpoints and React integrations:

```text
📦 omahkopi78
 ┣ 📂 public/           # Static assets (images, fonts, CSS, Sass, JS)
 ┣ 📂 src/
 ┃ ┣ 📂 components/     # Astro & React UI components (Public & Admin)
 ┃ ┣ 📂 layouts/        # Shared layouts (BaseLayout, AdminLayout, LoginLayout)
 ┃ ┣ 📂 lib/            # Utility functions (MySQL DB connection setup)
 ┃ ┣ 📂 pages/          # Astro pages routing
 ┃ ┃ ┣ 📂 admin/        # Protected admin dashboard pages
 ┃ ┃ ┣ 📂 api/          # Backend API routes (upload, menu, facility, reservation)
 ┃ ┃ ┗ 📂 ...           # Public pages (index, menu, facility, reservation, blog)
 ┃ ┗ 📜 middleware.ts   # Clerk authentication middleware
 ┣ 📜 astro.config.mjs  # Astro configuration
 ┣ 📜 package.json      # Project dependencies
 ┗ 📜 .env              # Environment variables
```

---

## 🛠️ Tech Stack

| Category         | Technology                                                                |
| ---------------- | ------------------------------------------------------------------------- |
| **Framework**    | [Astro](https://astro.build/)                                             |
| **UI Library**   | [React](https://react.dev/)                                               |
| **Database**     | [MySQL](https://www.mysql.com/) (via `mysql2`)                            |
| **Authentication**| [Clerk](https://clerk.com/)                                              |
| **Styling**      | Custom CSS / Sass                                                         |
| **SEO**          | `astro-seo`, `@astrojs/sitemap`                                           |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- **Node.js** (v18 or above recommended)
- **MySQL** Database running locally or remotely
- **npm** or **pnpm** installed globally

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manry-hub/omahkopi78.git
   cd omahkopi78
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

### Environment Variables

Create a `.env` file in the root of your project and configure your Database and Clerk API keys:

```env
# Database Configuration
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Clerk Authentication Keys
PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Running Locally

Start the Astro development server:

```bash
npm run dev
# or
pnpm dev
```

- **Public Site:** Navigate to [http://localhost:4321](http://localhost:4321) (default Astro port)
- **Admin Panel:** Navigate to `http://localhost:4321/admin`

---

<p align="center">
  &copy; 2026 OmahKopi78 
</p>
