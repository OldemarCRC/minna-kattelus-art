# Minna Kattelus Art Gallery

## 📖 Description
- Brief project description
- Purpose (portfolio + e-commerce for Finnish artist)
- Main features

## ✨ Key Features
- Art portfolio showcase
- User authentication system
- Administrative dashboard
- Contact form
- Gallery with category filters
- Artwork management system (CRUD)
- Multilingual support (EN/ES/FI/SV)
- Responsive design with Scandinavian aesthetics

## 🛠️ Tech Stack

### Frontend
- React + Vite
- React Router
- Axios
- CSS3 (Scandinavian minimalist design)
- i18n for multilingual support

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Multer for file uploads
- Nodemailer for email notifications

### DevOps
- Git + GitHub
- Oracle Cloud Infrastructure (OCI)
- npm/concurrently

## 🔐 Security Implementation

### Advanced Security Features
- **Unique Session Management**: One active session per user
- **Session Cleanup Job**: Automatic cleanup of inactive sessions (every 10 min)
- **Heartbeat System**: Frontend activity sync with backend (every 5 min)
- **Auto-logout**: Automatic logout after 15 minutes of inactivity
- **Session Invalidation**: Previous sessions closed on new login
- **Detailed Security Logs**: Login, logout, and session tracking

### Backend Security
- **Helmet.js**: HTTP security headers
- **CSRF Protection**: Protection against Cross-Site Request Forgery
- **Rate Limiting**: Request limits per IP (contact form, authentication)
- **Password Hashing**: Bcrypt for passwords
- **JWT with httpOnly cookies**: Secure tokens with sessionToken validation
- **Email Verification**: Account verification via email
- **Input Validation & XSS Sanitization**: Data validation and sanitization in controllers
- **MongoDB Injection Protection**: Query sanitization

### Frontend Security
- **Honeypots**: Anti-bot traps in public forms (login, contact)
- **CSRF Token Management**: Automatic tokens in requests
- **Centralized Axios**: Single instance with interceptors
- **Form Validation**: Client-side validation before submission
- **Minimum Form Time**: Anti-bot timing protection (3 seconds minimum)
- **Inactivity Detection**: Monitors user activity and triggers auto-logout

### Security Features
- Password change with email notification
- Role-based system (admin/editor/viewer)
- Authentication and authorization middleware
- Session tracking with lastActivity timestamps
- Administrative route protection
- One session per user enforcement
- Automatic session cleanup for abandoned sessions

### Pending Security Features (Roadmap)
- Security logs for failed login attempts
- Account lockout after multiple failed attempts
- Two-Factor Authentication (2FA) - Optional

## 🛒 E-commerce System

### Current Features
- **Artwork Display**: Featured works on homepage
- **Dynamic Modals**: Detailed artwork view with specifications
- **Availability Status**: Visual indicators for sold/available pieces
- **Contact Integration**: Pre-filled contact form for artwork inquiries
- **Dynamic CTA Buttons**: 
  - "Add to Cart" for available artworks
  - "Contact for Availability" for sold pieces

### Planned E-commerce Features

#### Phase 1: Foundation (In Progress)
- [ ] Shopping Cart System
  - Add/remove artworks
  - Persistent cart (localStorage + DB sync)
  - Cart counter badge in navbar
  - Cart page with summary
- [ ] Shop Page
  - Grid of available artworks
  - Advanced filters (category, price range, size)
  - Search functionality
- [ ] Wishlist/Favorites
  - Save favorite artworks
  - Wishlist page
  - Badge counter

#### Phase 2: Checkout & Payments
- [ ] Multi-step Checkout Process
  - Contact information
  - Shipping address
  - Shipping method selection
  - Payment method
  - Order review and confirmation
- [ ] Payment Integration
  - Stripe payment processing
  - PayPal integration (optional)
  - Secure payment webhooks
- [ ] Order Management System
  - Order model with status tracking
  - Unique order numbers
  - Order states (pending, paid, shipped, delivered, cancelled)

#### Phase 3: Shipping & Logistics
- [ ] Shipping System
  - Multiple shipping options
  - Region-based cost calculation
  - Shipping carrier integration (DHL, FedEx)
  - Tracking number management
- [ ] Inventory Management
  - Stock tracking
  - Temporary cart reservation
  - Low stock notifications

#### Phase 4: Communication
- [ ] Email Notifications
  - Order confirmation
  - Payment confirmation
  - Shipping updates
  - Delivery notification
- [ ] In-app Notifications
  - Real-time notifications
  - Notification history
  - Unread badge counter

#### Phase 5: Advanced Features
- [ ] Coupon/Discount System
  - Percentage and fixed-amount discounts
  - Free shipping coupons
  - Expiration dates
  - Single-use and multi-use codes
- [ ] Tax Management
  - Region-based tax rates
  - Automatic tax calculation
- [ ] Gift Cards
  - Purchase and redeem gift cards
  - Unique code generation
  - Balance tracking
- [ ] Review System
  - Post-purchase reviews
  - Star ratings
  - Admin moderation

#### Phase 6: Analytics & Management
- [ ] Sales Dashboard
  - Sales graphs (daily/weekly/monthly/yearly)
  - Top-selling artworks
  - Revenue tracking
  - Pending/completed orders overview
- [ ] Order Management (Admin)
  - Complete order list with filters
  - Status updates
  - Invoice generation (PDF)
  - Refund processing
- [ ] Purchase History (User)
  - Order tracking
  - Invoice downloads
  - Refund requests

#### Phase 7: Additional Features
- [ ] Return/Refund System
  - Return request workflow
  - Approval process
  - Automatic refunds
- [ ] Performance Optimization
  - Image compression with Sharp
  - CDN integration
  - Product caching
  - Lazy loading

## 📂 Project Structure
```
minna-kattelus-art/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Main pages
│   │   ├── context/       # Context API (Auth, Language)
│   │   ├── locales/       # Translation files
│   │   ├── styles/        # Global styles
│   │   └── utils/         # Utilities (centralized axios)
│   └── public/
└── server/                # Node.js Backend
    ├── src/
    │   ├── config/        # DB configuration
    │   ├── controllers/   # Business logic
    │   ├── middleware/    # Authentication, rate limiting
    │   ├── models/        # MongoDB models
    │   ├── routes/        # API routes
    │   └── utils/         # Utilities (mailer, errors)
    └── uploads/           # Uploaded files
```

🚀 Installation
Prerequisites

Node.js v18+
MongoDB
Git

Installation Steps

Clone repository
Install dependencies (root, client, server)
Configure environment variables
Initialize database
Run in development mode

⚙️ Configuration
Environment Variables - Backend (.env)

List of required variables
Explanation of each

Environment Variables - Frontend (.env)

List of required variables
Explanation of each

🎨 Design and UX

Color palette (Nordic-inspired)
Typography (Cormorant Garamond)
Scandinavian minimalist design principles

📱 Responsive Design

Breakpoints used
Device support

🌐 Internationalization (i18n)

Supported languages
How to add new languages
Translation file structure

## 🗄️ Database

### Current Models

#### User
- Authentication and profile information
- Fields: sessionToken, isOnline, lastLogin, lastActivity
- Roles: admin, editor, viewer

#### Artwork
- Artwork information with multilingual support
- Fields: title, description, technique (EN/ES/FI/SV)
- Categories, dimensions, pricing
- Availability and featured status
- Display order for gallery

### Planned Models (E-commerce)

#### Order
- Customer orders with items and status
- Order states: pending, paid, processing, shipped, delivered, cancelled, refunded
- Payment and shipping information
- Total calculations (subtotal, tax, shipping, discounts)

#### OrderItem
- Individual items within an order
- Link to Artwork
- Quantity, price snapshot at purchase time

#### Cart
- Persistent shopping cart
- User reference
- Cart items with quantities

#### ShippingAddress
- User delivery addresses
- Multiple addresses per user
- Default address flag

#### Payment
- Payment transaction records
- Payment provider details (Stripe, PayPal)
- Payment states: pending, completed, failed, refunded

#### Coupon
- Discount codes
- Types: percentage, fixed amount, free shipping
- Expiration dates and usage limits

#### Review (Future)
- Artwork reviews post-purchase
- Rating system (1-5 stars)
- Moderation status

Schemas

Brief description of each model

## 🔌 API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/heartbeat (session activity tracking)
- PUT /api/auth/change-password
- GET /api/auth/verify-email/:token

### Artworks
- GET /api/artworks (all artworks)
- GET /api/artworks/featured (featured artworks)
- GET /api/artworks/:id (single artwork)
- POST /api/artworks (admin/editor)
- PUT /api/artworks/:id (admin/editor)
- DELETE /api/artworks/:id (admin only)
- PUT /api/artworks/display-order (update order)

### Contact
- POST /api/contact (with rate limiting and honeypots)

### E-commerce (Planned)
- Cart: GET, POST, PUT, DELETE /api/cart
- Orders: GET, POST /api/orders
- Payments: POST /api/payments/stripe, POST /api/payments/webhook
- Coupons: POST /api/coupons/validate

🧪 Testing

(To be implemented)
Security testing performed

📦 Deployment
Development

Instructions for running locally

Production on OCI

Server configuration
SSL/HTTPS with Let's Encrypt
Production environment variables
Backup strategy

🤝 Contributing

Contribution guidelines
Code of conduct

📄 License

License type

👤 Author

Oldemar (developer)
Minna Kattelus (artist)

📞 Contact

Email
GitHub
Website

🙏 Acknowledgments

Libraries used
Resources

📝 Changelog

Versions and major changes

## 🔮 Roadmap / Future Improvements

### Security (Pending)
- [ ] Security logs for failed login attempts and suspicious activity
- [ ] Account lockout mechanism after X failed attempts
- [ ] Two-Factor Authentication (2FA) with TOTP

### E-commerce (In Progress)
- [x] Artwork detail modal with dynamic CTAs
- [x] Contact form integration with artwork inquiries
- [ ] Complete shopping cart system (Phase 1)
- [ ] Full checkout flow with Stripe integration (Phase 2)
- [ ] Order management system (Phase 2)
- [ ] Shipping and logistics (Phase 3)
- [ ] Email notifications (Phase 4)
- [ ] Advanced features (coupons, taxes, reviews) (Phase 5-6)
- [ ] Sales analytics dashboard (Phase 6)

### UI/UX Improvements
- [ ] Dynamic hero images from database
- [ ] Responsive mobile menu (hamburger)
- [ ] Image optimization with Sharp (compression, WebP format)
- [ ] Lazy loading for gallery images
- [ ] CDN integration for static assets

### Performance
- [ ] Redis caching for frequently accessed data
- [ ] Database query optimization
- [ ] Image CDN
- [ ] Progressive Web App (PWA) features
