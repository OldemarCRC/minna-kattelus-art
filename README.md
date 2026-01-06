# Minna Kattelus Art Gallery

## Description
- Brief project description
- Purpose (portfolio + e-commerce for Finnish artist)
- Main features

## Key Features
- Art portfolio showcase
- User authentication system
- Administrative dashboard
- Contact form
- Gallery with category filters
- Artwork management system (CRUD)
- Multilingual support (EN/ES/FI/SV)
- Responsive design with Scandinavian aesthetics

## Tech Stack

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

## Security Implementation

### Backend Security
- **Helmet.js**: HTTP security headers
- **CSRF Protection**: Protection against Cross-Site Request Forgery
- **Rate Limiting**: Request limits per IP
- **Password Hashing**: Bcrypt for passwords
- **JWT with httpOnly cookies**: Secure tokens
- **Email Verification**: Account verification via email
- **Input Validation**: Data validation in controllers
- **MongoDB Injection Protection**: Query sanitization

### Frontend Security
- **Honeypots**: Anti-bot traps in public forms
- **CSRF Token Management**: Automatic tokens in requests
- **Centralized Axios**: Single instance with interceptors
- **Form Validation**: Client-side validation before submission
- **Minimum Form Time**: Anti-bot timing protection

### Security Features
- Password change with email notification
- Role-based system (admin/editor/viewer)
- Authentication and authorization middleware
- Access attempt logging
- Administrative route protection

## Project Structure
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

Installation
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

Configuration
Environment Variables - Backend (.env)

List of required variables
Explanation of each

Environment Variables - Frontend (.env)

List of required variables
Explanation of each

Design and UX

Color palette (Nordic-inspired)
Typography (Cormorant Garamond)
Scandinavian minimalist design principles

Responsive Design

Breakpoints used
Device support

Internationalization (i18n)

Supported languages
How to add new languages
Translation file structure

Database
Models

User
Artwork
(others if applicable)

Schemas

Brief description of each model

API Endpoints
Authentication

POST /api/auth/register
POST /api/auth/login
PUT /api/auth/change-password
GET /api/auth/verify-email/:token

Artworks

GET /api/artworks
POST /api/artworks
PUT /api/artworks/:id
DELETE /api/artworks/:id

Contact

POST /api/contact

Testing

(To be implemented)
Security testing performed

Deployment
Development

Instructions for running locally

Production on OCI

Server configuration
SSL/HTTPS with Let's Encrypt
Production environment variables
Backup strategy

Contributing

Contribution guidelines
Code of conduct

License

License type

Author

Oldemar (developer)
Minna Kattelus (artist)

Contact

Email
GitHub
Website

Acknowledgments

Libraries used
Resources

Changelog

Versions and major changes

Roadmap / Future Improvements

Planned features
Pending security enhancements
Optimizations
