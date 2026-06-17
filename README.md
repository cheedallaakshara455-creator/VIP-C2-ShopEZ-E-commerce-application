# 🛍️ ShopEZ — Full-Stack E-Commerce Platform

A complete MERN stack (MongoDB, Express.js, React.js, Node.js) e-commerce application.

## 🎨 Tech Stack
- **Frontend**: React.js (Vite), React Router, Axios, Recharts, React Icons
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Styling**: Vanilla CSS with custom design system (Royal Blue #2563EB palette)

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local `mongodb://localhost:27017` or Atlas URI)

### 1. Clone & Setup Server
```bash
cd server
npm install
# Edit .env if needed (default: mongodb://localhost:27017/shopez)
npm run seed      # Seeds 16 products + admin + demo user
npm run dev       # Starts server on http://localhost:5000
```

### 2. Setup Client (new terminal)
```bash
cd client
npm install
npm run dev       # Starts React app on http://localhost:5173
```

## 🔐 Demo Credentials
| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@shopez.com    | admin123  |
| User  | user@shopez.com     | user123   |

## 📁 Project Structure
```
ShopEZ/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Navbar, Footer, ProductCard, etc.
│       ├── context/        # AuthContext, CartContext
│       ├── pages/          # All page components
│       │   └── admin/      # Admin dashboard pages
│       └── utils/          # Axios API instance
│
└── server/                 # Express backend
    ├── config/             # MongoDB connection
    ├── controllers/        # Business logic
    ├── middleware/         # JWT auth
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    └── seed.js             # Database seeder
```

## 🗺️ API Endpoints
| Method | Endpoint                  | Description           | Auth      |
|--------|---------------------------|-----------------------|-----------|
| POST   | /api/users/register       | Register user         | Public    |
| POST   | /api/users/login          | Login                 | Public    |
| GET    | /api/products             | Get all products      | Public    |
| GET    | /api/products/:id         | Get single product    | Public    |
| POST   | /api/cart                 | Add to cart           | User      |
| POST   | /api/orders               | Create order          | User      |
| GET    | /api/orders/my            | My orders             | User      |
| GET    | /api/admin/stats          | Dashboard stats       | Admin     |
| GET    | /api/admin/orders         | All orders            | Admin     |
| PUT    | /api/admin/orders/:id     | Update order status   | Admin     |

## ✨ Features
- 🔐 JWT Authentication (User + Admin roles)
- 🛍️ Product catalog with search, filter, pagination
- ⭐ Product reviews & star ratings
- 🛒 Persistent cart (synced with backend)
- 📦 3-step checkout (Address → Payment → Review)
- ✅ Order confirmation with timeline
- 👤 User profile with order history
- 📊 Admin dashboard with revenue charts
- 📱 Fully responsive design
