# Minna Kattelus Art Gallery

> Professional art gallery and e-commerce platform for Finnish artist Minna Kattelus

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-green)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)

---

## 📸 Screenshots

> TODO: Add screenshots when migration is complete
> - Homepage with featured works
> - Gallery with filters
> - Artwork detail modal
> - Admin dashboard

---

## 🔄 Migration Notice

**This project was migrated from React (Vite) to Next.js 14**

### Why We Migrated
- ✅ **SEO Requirements** - Art galleries need search engine visibility
- ✅ **Image Optimization** - Built-in Next.js optimization for art images
- ✅ **Internationalization** - Native support for 4 languages (EN/ES/FI/SV)
- ✅ **Performance** - Server-side rendering for better UX
- ✅ **Production Ready** - Better architecture for scaling

### Lesson Learned
> 💡 **For future projects:** Evaluate framework requirements (SEO, i18n, images) at the start to avoid mid-project migrations. Choose Next.js upfront for public-facing, image-heavy, multilingual applications.

---

## ✨ Features

### Current Features
- 🎨 Art portfolio showcase with professional gallery
- 🔐 User authentication with advanced session management
- 👨‍💼 Admin dashboard for artwork management (CRUD)
- 🖼️ Artwork detail modals with dynamic call-to-action
- 📧 Contact form with anti-bot protection
- 🌍 Multilingual support (English, Spanish, Finnish, Swedish)
- 📱 Responsive Scandinavian minimalist design
- 🔍 SEO optimized with server-side rendering

### E-commerce Features (In Development)
- [ ] Shopping cart system
- [ ] Multi-step checkout process
- [ ] Stripe payment integration
- [ ] Order management
- [ ] Shipping calculations
- [ ] Email notifications
- [ ] Coupon/discount system
- [ ] Sales analytics dashboard

---

## 🛠️ Tech Stack

**Architecture:** Next.js 14 + Express.js + MongoDB

### Frontend
- **Next.js 14** - App Router, SSR, Image Optimization
- **React 18+** - UI components
- **next-intl** - Internationalization with automatic routing
- **Axios** - HTTP client with CSRF/auth interceptors
- **CSS3** - Scandinavian minimalist design

### Backend
- **Express.js** - REST API
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication with httpOnly cookies
- **Nodemailer** - Email notifications
- **Helmet.js** - Security headers
- **Node-cron** - Background jobs (session cleanup)

### Security
- Unique session management (one active session per user)
- Heartbeat system (5-min intervals)
- Auto-logout (15 min inactivity)
- CSRF protection (double-submit cookie pattern)
- Honeypot anti-bot traps
- XSS sanitization
- Rate limiting

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18.17.0 or higher
- **MongoDB** v5.0+ (local or MongoDB Atlas)
- **Git** latest version
- **npm** (comes with Node.js)

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/minna-kattelus-art.git
cd minna-kattelus-art
```

### 2. Checkout migration branch
```bash
git checkout migration/nextjs
```

### 3. Install dependencies

**Root:**
```bash
npm install
```

**Frontend (Next.js):**
```bash
cd client-next
npm install
```

**Backend (Express):**
```bash
cd ../server
npm install
```

### 4. Configure environment variables

**Backend** (`server/.env`):
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/minna-kattelus-art
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=30d
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLIENT_URL=http://localhost:5001
```
> **Note:** For network access from other devices, replace `localhost` with your machine's local IP (e.g., `http://192.168.x.x:5001`)

**Frontend** (`client-next/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_CLIENT_URL=http://localhost:5001
```
> **Note:** For network access from other devices, replace `localhost` with your machine's local IP (e.g., `http://192.168.x.x:3000`)

### 5. Start MongoDB
```bash
mongod
```

### 6. Run the application

**Option A - Run all at once (from root):**
```bash
npm run dev
```

**Option B - Run separately:**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client-next
npm run dev
```

### 7. Access the application
- **Frontend:** http://localhost:5001
- **Backend API:** http://localhost:3000

> **Network Access:** To access from other devices on your local network, replace `localhost` with your machine's local IP address (e.g., `http://192.168.x.x:5001`). You may need to configure your router to assign a static IP to your development machine.

---

## 💻 Usage

### Admin Access
> TODO: Document how to create first admin user

### Available Scripts

**Root:**
```bash
npm run dev          # Run frontend + backend concurrently
```

**Frontend:**
```bash
npm run dev          # Development mode (port 5001)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
```

**Backend:**
```bash
npm run dev          # Development with nodemon
npm start            # Production mode
```

### Example: Creating a New Artwork
> TODO: Add code example or curl command

---

## 📂 Project Structure

```
minna-kattelus-art/
├── client-next/              # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   └── [locale]/     # Internationalized routes
│   │   │       ├── page.jsx  # Home
│   │   │       ├── gallery/
│   │   │       ├── shop/
│   │   │       ├── about-me/
│   │   │       ├── contact/
│   │   │       ├── dashboard/
│   │   │       └── (auth)/   # Login, Register
│   │   ├── components/       # React components
│   │   ├── lib/              # Utils (axios, inactivityDetector)
│   │   └── styles/           # CSS files
│   ├── messages/             # i18n translations
│   └── public/               # Static assets
│
├── server/                   # Express.js Backend
│   └── src/
│       ├── controllers/      # Business logic
│       ├── middleware/       # Auth, CSRF, rate limiting
│       ├── models/           # MongoDB models
│       ├── routes/           # API routes
│       └── utils/            # Helpers
│
└── docs/                     # Project documentation
    ├── PROJECT_STATUS.md
    └── MIGRATION_CHECKLIST.md
```

---

## 🔐 Security Features

- **Unique Session Management**: One active session per user with sessionToken
- **Heartbeat System**: Frontend pings backend every 5 minutes
- **Auto-logout**: 15 minutes of inactivity triggers automatic logout
- **Session Cleanup**: Backend cron job cleans stale sessions every 10 minutes
- **CSRF Protection**: Double-submit cookie pattern on all mutations
- **Honeypots**: 3 hidden fields in public forms to trap bots
- **XSS Sanitization**: All user inputs sanitized while preserving multilingual structure
- **Rate Limiting**: IP-based limits on contact form and authentication endpoints

---

## 🌐 Internationalization

Supported languages with automatic routing:
- 🇬🇧 English (`/en/*`)
- 🇪🇸 Spanish (`/es/*`)
- 🇫🇮 Finnish (`/fi/*`)
- 🇸🇪 Swedish (`/sv/*`)

All artwork content (title, description, technique) stored in multilingual format.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login and create session
- `POST /api/auth/logout` - Logout and clear session
- `POST /api/auth/heartbeat` - Update lastActivity (session keep-alive)
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/verify-email/:token` - Verify email

### Artworks
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/featured` - Get featured artworks
- `GET /api/artworks/:id` - Get single artwork
- `POST /api/artworks` - Create artwork (admin/editor)
- `PUT /api/artworks/:id` - Update artwork (admin/editor)
- `DELETE /api/artworks/:id` - Delete artwork (admin only)

### Contact
- `POST /api/contact` - Send contact message (rate limited)

> TODO: Document e-commerce endpoints when implemented

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login/logout flow
- [ ] Session management (heartbeat, auto-logout)
- [ ] Multi-browser session invalidation
- [ ] CSRF protection on mutations
- [ ] Honeypots blocking bot submissions
- [ ] Contact form with query parameters
- [ ] Artwork modal with dynamic CTAs
- [ ] Language switching
- [ ] Protected routes (dashboard)

### Browser Compatibility
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)
- ⏳ Safari (pending)

> TODO: Implement automated tests (Jest, Playwright)

---

## 📦 Deployment

### Development
```bash
# Backend runs on http://localhost:3000
# Frontend runs on http://localhost:5001
```

### Production (Oracle Cloud Infrastructure)
> TODO: Complete deployment documentation
> - Server setup (Ubuntu 22.04)
> - Nginx reverse proxy
> - SSL with Let's Encrypt
> - PM2 process manager
> - MongoDB backup strategy

---

## 🤝 Contributing

This is a private project for Minna Kattelus. Contributions are welcome through pull requests.

### Commit Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code formatting
refactor: Code refactoring
test: Add/update tests
chore: Maintenance
```

---

## 📄 License

Proprietary - All rights reserved © Minna Kattelus

---

## 👥 Authors

**Developer:** José Oldemar Chaves Urbina
**Artist:** Minna Kattelus (Finnish artist and art teacher)

---

## 📞 Contact

- **Website:** [To be added]
- **Email:** [To be added]
- **Instagram:** [To be added]

---

## 🗺️ Roadmap

### Completed ✅
- [x] Next.js 14 migration setup
- [x] Advanced session management
- [x] CSRF and security implementations
- [x] Artwork modal with dynamic CTAs
- [x] Contact form integration
- [x] Multilingual support

### In Progress 🚧
- [ ] Complete Next.js page migrations
- [ ] i18n configuration with next-intl
- [ ] Test all security features in Next.js

### Upcoming 📅
- [ ] Shopping cart system
- [ ] Stripe payment integration
- [ ] Order management
- [ ] Shipping calculations
- [ ] Email notifications
- [ ] Sales analytics dashboard

---

## 📚 Documentation

- [Project Status](docs/PROJECT_STATUS.md) - Current progress and task tracking
- [Migration Checklist](docs/MIGRATION_CHECKLIST.md) - Detailed migration steps
- README.md - This file (project overview)

---

**Last Updated:** January 13, 2025  
**Current Version:** 2.0.0-migration  
**Branch:** migration/nextjs
