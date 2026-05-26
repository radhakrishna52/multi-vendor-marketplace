# DreamCart — Multi-Vendor Luxury E-Commerce Platform

> A full-stack, role-based multi-vendor marketplace built with **React + Node.js + MongoDB**.  
> Features a premium luxury design, real-time seller analytics, a buyer review & rating system, and a full admin control panel.

---

## Table of Contents

1. [What This Project Does](#1-what-this-project-does)
2. [Live Demo Accounts](#2-live-demo-accounts)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Prerequisites](#5-prerequisites)
6. [Installation & Setup](#6-installation--setup)
7. [Running the Project](#7-running-the-project)
8. [Seeding the Database](#8-seeding-the-database)
9. [Environment Variables](#9-environment-variables)
10. [API Reference](#10-api-reference)
11. [User Roles & Features](#11-user-roles--features)
12. [Pages Overview](#12-pages-overview)
13. [Key Features](#13-key-features)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. What This Project Does

**DreamCart** is a complete multi-vendor e-commerce platform where:

- 🛍️ **Buyers** can browse products across 6 fashion categories, add items to a persistent cart, place orders, manage a wishlist, and submit star ratings with written reviews on products.
- 🏪 **Sellers (Vendors)** get a merchant portal to publish product listings, track revenue, view order counts, and see detailed customer ratings and review analytics for their store.
- 🛡️ **Admins** have complete control — manage all users (edit name, email, role, password), view every order and product, create discount coupons, and see seller rating performance across the entire platform.

### What's inside:

| Feature | Description |
|---|---|
| 6 Product Categories | Women Fashion, Men Fashion, Kids Fashion, Beauty & Care, Home & Living, Accessories |
| 60+ Seeded Products | Luxury brands like Prada, Chanel, Rolex, Ray-Ban, Lakme, Mamaearth and more |
| 341 Seeded Reviews | Realistic ratings distributed across all products |
| 3 Role Dashboards | Separate UIs for Buyer, Seller, and Admin |
| Persistent Cart | Cart survives page refresh using localStorage |
| Dark Mode | Full dark/light theme toggle across all pages |
| Account Switcher | Floating widget to switch between roles instantly |
| JWT Authentication | Secure login with hashed passwords and token auth |
| Rating Analytics | Seller avg score, star breakdown, recent feedback feed |
| Admin Deep Dive | Per-user drawer with order ledger + rating panel |
| Discount Coupons | Admin can create site-wide or vendor-specific coupons |

---

## 2. Live Demo Accounts

These accounts are pre-seeded and ready to use:

| Role | Email | Password |
|---|---|---|
| 🛍️ **Buyer** | `arjun@buyer.in` | `Arjun123` |
| 🏪 **Seller** | `arjun@seller.in` | `Arjun123` |
| 🛡️ **Admin** | `arjun@admin.in` | `Arjun123` |

> You can also use the **floating gear icon (⚙️)** on the bottom-right of any page to instantly switch between roles.

---

## 3. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI Framework |
| Vite | 8 | Build tool & Dev Server |
| React Router DOM | v6 | Client-side routing |
| Tailwind CSS | v3 | Utility-first styling |
| Framer Motion | latest | Animations & transitions |
| Zustand | latest | Global state management |
| Axios | latest | HTTP client |
| Recharts | latest | Revenue bar charts |
| Lucide React | latest | Icons |
| React Hot Toast | latest | Notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | v5 | REST API server |
| MongoDB Atlas | cloud | Database |
| Mongoose | v9 | ODM / Schema layer |
| jsonwebtoken | v9 | JWT auth tokens |
| bcryptjs | v3 | Password hashing |
| dotenv | latest | Environment variables |
| cors | latest | Cross-origin requests |

### Design System
| Token | Value |
|---|---|
| Primary Font | Playfair Display (serif) |
| Secondary Font | Montserrat |
| Body Font | Lato |
| Gold | `#D4AF37` |
| Charcoal | `#1A1A1A` |
| Cream | `#F5F1E8` |
| Soft White | `#FAFAF8` |
| Rose Gold | `#B76E79` |

---

## 4. Project Structure

```
multi vendor/
│
├── README.md                        ← This file
│
├── frontend/                        ← React Application (Vite)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                 ← App entry point
│       ├── App.jsx                  ← Router + layout
│       ├── index.css                ← Design tokens & global styles
│       │
│       ├── pages/                   ← All page components
│       │   ├── Landing.jsx          ← Marketing homepage
│       │   ├── Storefront.jsx       ← Buyer home after login
│       │   ├── Products.jsx         ← Product catalog with filter/search
│       │   ├── ProductDetail.jsx    ← Single product + review form
│       │   ├── Cart.jsx             ← Shopping cart
│       │   ├── Checkout.jsx         ← Order placement
│       │   ├── CustomerDashboard.jsx← Buyer order history + wishlist
│       │   ├── Wishlist.jsx         ← Saved products
│       │   ├── SellerDashboard.jsx  ← Seller analytics + ratings
│       │   ├── AdminDashboard.jsx   ← Full admin control panel
│       │   ├── Login.jsx            ← Login page (all roles)
│       │   ├── Signup.jsx           ← Registration
│       │   ├── AdminLogin.jsx       ← Admin-specific login
│       │   ├── Vendors.jsx          ← Vendor directory
│       │   └── VendorDetail.jsx     ← Individual vendor storefront
│       │
│       ├── components/              ← Reusable UI components
│       │   ├── Navbar.jsx           ← Smart 3-mode navbar
│       │   ├── ProductCard.jsx      ← Product grid card
│       │   ├── FloatingProfileSwitcher.jsx ← Role switcher widget
│       │   ├── VendorCard.jsx       ← Vendor listing card
│       │   ├── Footer.jsx           ← Site footer
│       │   └── LoadingSpinner.jsx   ← Gold loading spinner
│       │
│       ├── store/                   ← Zustand global state
│       │   ├── authStore.js         ← User session + JWT
│       │   ├── cartStore.js         ← Cart (persisted to localStorage)
│       │   ├── wishlistStore.js     ← Wishlist items
│       │   └── themeStore.js        ← Dark/light mode
│       │
│       └── utils/
│           └── api.js               ← Axios instance with auth interceptor
│
└── backend-node/                    ← Node.js REST API
    ├── server.js                    ← App entry + route mounting
    ├── package.json
    ├── .env                         ← Environment variables (create this)
    │
    ├── routes/
    │   ├── authRoutes.js            ← Register / Login / Me
    │   ├── productRoutes.js         ← List / Get / Reviews
    │   ├── orderRoutes.js           ← Place / List orders
    │   ├── reviewRoutes.js          ← Submit reviews + seller aggregation
    │   ├── vendorRoutes.js          ← Seller dashboard + add product
    │   └── adminRoutes.js           ← Full admin management API
    │
    ├── models/
    │   ├── User.js                  ← User schema (buyer/seller/admin)
    │   ├── Product.js               ← Product schema
    │   ├── Order.js                 ← Order + order items schema
    │   ├── Review.js                ← Rating + comment schema
    │   ├── Coupon.js                ← Discount coupon schema
    │   ├── Vendor.js                ← Vendor profile schema
    │   └── Wishlist.js              ← Wishlist schema
    │
    ├── middleware/
    │   └── auth.js                  ← requireAuth + requireAdmin middleware
    │
    ├── api_sync_engine.js           ← Seeds products + users into MongoDB
    └── seed_reviews.js              ← Seeds 341 fake reviews + ratings
```

---

## 5. Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** v18 or higher → [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (free tier works perfectly) → [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** → [Download](https://git-scm.com/)

To check your versions:
```bash
node --version    # should be v18+
npm --version     # should be 9+
```

---

## 6. Installation & Setup

### Step 1 — Clone or download the project

```bash
# If using Git:
git clone <your-repository-url>
cd "multi vendor"

# Or simply open the folder in your terminal:
cd "/Users/your-name/Desktop/multi vendor"
```

---

### Step 2 — Set up MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign in
2. Create a new **free cluster** (M0 Sandbox)
3. Create a **database user** (username + password) — remember these
4. Click **Connect → Connect your application** and copy the connection string
5. It looks like:  
   `mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/dreamcart`

---

### Step 3 — Configure the Backend

```bash
cd backend-node
```

Create a `.env` file in the `backend-node/` folder:

```bash
# On Mac/Linux:
touch .env

# Or create it manually using any text editor
```

Paste the following into `.env` and fill in your values:

```env
PORT=5001
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/dreamcart
JWT_SECRET=your_random_secret_key_here_make_it_long
```

> ⚠️ **Important:** Replace `MONGODB_URI` with your actual Atlas connection string.  
> The `JWT_SECRET` can be any long random string (e.g. `dreamcart_super_secret_2026`).

Install backend dependencies:

```bash
npm install
```

---

### Step 4 — Configure the Frontend

```bash
cd ../frontend
```

Install frontend dependencies:

```bash
npm install
```

The frontend connects to `http://localhost:5001` by default.  
If your backend runs on a different port, create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5001
```

---

## 7. Running the Project

You need **two terminals open** — one for the backend and one for the frontend.

### Terminal 1 — Start the Backend

```bash
cd "/Users/your-name/Desktop/multi vendor/backend-node"
node server.js
```

✅ You should see:
```
Node.js server running on port 5001
Connected to MongoDB Luxora
```

---

### Terminal 2 — Start the Frontend

```bash
cd "/Users/your-name/Desktop/multi vendor/frontend"
npm run dev
```

✅ You should see:
```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

Open your browser and visit: **[http://localhost:5173](http://localhost:5173)**

---

## 8. Seeding the Database

The database needs to be seeded with products, users, and reviews before you can use the platform.

### Step 1 — Seed Products & Users

This script creates all demo accounts and loads 60+ luxury products into MongoDB:

```bash
cd backend-node
node api_sync_engine.js
```

✅ Expected output:
```
Fetching external product data from DummyJSON API...
Seeded X products
Created users: arjun@buyer.in, arjun@seller.in, arjun@admin.in
```

---

### Step 2 — Seed Reviews & Ratings

This script adds 341 realistic customer reviews across all products and recalculates every product's average rating:

```bash
node seed_reviews.js
```

✅ Expected output:
```
Connected to MongoDB Luxora
🗑️  Cleared old reviews.
✅ Seeded 341 reviews across 60 products.
🔄 Recalculating product average ratings...
✅ Product ratings updated.

📊 Seller Rating Summary:
  Myntra Verified Fashion Hub: ⭐ 3.65 avg (341 reviews)

🎉 Seeding complete!
```

> 💡 **Note:** Run the seed scripts only once (or when you want to reset data).  
> Running `seed_reviews.js` again will clear and re-seed all reviews.

---

### Full Quick Start (all steps combined)

```bash
# 1. Go to backend
cd "/Users/your-name/Desktop/multi vendor/backend-node"

# 2. Install dependencies
npm install

# 3. Create .env (fill in your MongoDB URI)
echo "PORT=5001\nMONGODB_URI=your_atlas_uri_here\nJWT_SECRET=dreamcart_secret_2026" > .env

# 4. Seed products + users
node api_sync_engine.js

# 5. Seed reviews
node seed_reviews.js

# 6. Start backend
node server.js

# --- Open a NEW terminal ---

# 7. Go to frontend
cd "/Users/your-name/Desktop/multi vendor/frontend"

# 8. Install dependencies
npm install

# 9. Start frontend
npm run dev

# 10. Open browser: http://localhost:5173
```

---

## 9. Environment Variables

### Backend (`backend-node/.env`)

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | Yes | Server port | `5001` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dreamcart` |
| `JWT_SECRET` | Yes | Secret key for signing JWTs | `my_super_secret_key_here` |

### Frontend (`frontend/.env`) — Optional

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5001` | Backend API base URL |

---

## 10. API Reference

All API routes are prefixed with the base URL: `http://localhost:5001`

### 🔐 Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive JWT token |
| `GET` | `/api/auth/me` | JWT | Get currently logged-in user |

**Login Request Body:**
```json
{
  "email": "arjun@buyer.in",
  "password": "Arjun123"
}
```

**Login Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": { "id": "...", "email": "arjun@buyer.in", "role": "buyer", "name": "Arjun Buyer" }
}
```

---

### 📦 Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products` | No | List products (paginated, filterable) |
| `GET` | `/api/products?category=Women+Fashion` | No | Filter by category |
| `GET` | `/api/products?search=kurta` | No | Search by product name |
| `GET` | `/api/products/:id` | No | Get single product |
| `GET` | `/api/products/:id/reviews` | No | Get all reviews for a product |
| `POST` | `/api/products` | Admin | Create a product |

---

### 🛒 Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/orders` | JWT | Place a new order |
| `GET` | `/api/orders` | JWT | Get logged-in user's orders |

**Place Order Request Body:**
```json
{
  "items": [{ "product_id": "...", "quantity": 2 }],
  "shipping_address": "123 DreamCart Avenue, Mumbai 400001"
}
```

---

### ⭐ Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reviews` | JWT (Buyer) | Submit or update a product review |
| `GET` | `/api/reviews/product/:productId` | No | Get all reviews for a product |
| `GET` | `/api/reviews/seller/:sellerId` | No | Get seller's aggregate rating + breakdown |

**Submit Review Request Body:**
```json
{
  "product_id": "...",
  "rating": 4,
  "comment": "Excellent quality, very fast delivery!"
}
```

---

### 🏪 Vendor (Seller Portal)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/vendors/me/dashboard` | Seller JWT | Get full seller dashboard data |
| `POST` | `/api/vendors/products` | Seller JWT | Add a new product listing |

**Dashboard Response includes:** total revenue, orders count, products count, avg_rating, total_reviews, recent_reviews, products list

---

### 🛡️ Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin JWT | Platform-wide statistics |
| `GET` | `/api/admin/users` | Admin JWT | All users (with seller ratings) |
| `GET` | `/api/admin/users/:id` | Admin JWT | User deep-dive (orders + products + rating) |
| `PUT` | `/api/admin/users/:id` | Admin JWT | Update user profile / reset password |
| `GET` | `/api/admin/products` | Admin JWT | All products |
| `POST` | `/api/admin/products` | Admin JWT | Admin add product |
| `GET` | `/api/admin/orders` | Admin JWT | All orders platform-wide |
| `GET` | `/api/admin/coupons` | Admin JWT | List all coupons |
| `POST` | `/api/admin/coupons` | Admin JWT | Create a discount coupon |

---

## 11. User Roles & Features

### 🛍️ Buyer (Customer)

After logging in with a `buyer` account:

- **Home/Storefront** — personalized welcome
- **Browse Products** — filter by category, live search, pagination
- **Product Detail** — view product info, read all reviews, and submit a star rating + comment
- **Shopping Cart** — add/remove items, adjust quantities, cart persists on refresh
- **Checkout** — enter shipping address, confirm order
- **My Profile** — view complete order history with status badges (pending/shipped/delivered)
- **Wishlist** — heart/save products for later
- **Dark Mode** — toggle from the navbar

---

### 🏪 Seller (Vendor / Merchant)

After logging in with a `seller` account, the navbar changes to the dark merchant nav:

- **Revenue Dashboard** — total revenue in ₹, order count, active listings
- **⭐ Rating Card** — average rating score from all buyers
- **Ratings Analytics Panel** — large avg score display, per-star bar chart breakdown
- **Recent Feedback Feed** — last 5 customer reviews with product name, reviewer, and comment
- **Add Product** — form to publish new listings (name, price, category, stock, image URL, description)
- **My Catalog** — grid view of all published products

---

### 🛡️ Admin (System Overlord)

After logging in via `/admin-login` with an `admin` account:

The admin dashboard has **5 management tabs** (navigable via sidebar):

1. **Dashboard Tab** — Platform stats cards + 7-month revenue bar chart
2. **Users Tab** — Paginated users table with columns: Name, Email, Role, **Rating (for sellers)**, Actions
   - Click **"Deep Dive"** on any user → opens a side drawer with:
     - Full user info + Edit form (name, email, role, password reset)
     - For sellers: product catalog + ⭐ Rating Analytics panel (avg score, star breakdown bars)
     - For buyers: complete order ledger with INR amounts
3. **Products Tab** — All platform products, admin can add new ones
4. **Orders Tab** — Every order from every user
5. **Coupons Tab** — Create discount coupons (code, % discount, expiry)

---

## 12. Pages Overview

| Page | URL | Who Can Access |
|---|---|---|
| Landing / Marketing | `/` (guest) | Anyone |
| Buyer Home | `/` (logged in) | Buyer |
| Product Catalog | `/products` | Anyone |
| Product Detail | `/products/:id` | Anyone (rating form = buyers only) |
| Shopping Cart | `/cart` | Anyone |
| Checkout | `/checkout` | Logged-in users |
| My Profile / Orders | `/profile` | Buyers |
| Wishlist | `/wishlist` | Buyers |
| Seller Dashboard | `/seller` | Sellers |
| Admin Dashboard | `/admin` | Admins |
| Login | `/login` | Guests |
| Sign Up | `/signup` | Guests |
| Admin Login | `/admin-login` | Guests |
| Vendor Directory | `/vendors` | Anyone |
| Vendor Store | `/vendors/:id` | Anyone |

---

## 13. Key Features

### ⭐ Rating & Review System
- Buyers rate products 1–5 stars with an interactive hover-glow star picker
- Quality labels shown: Poor / Fair / Good / Very Good / Excellent
- Reviews show reviewer name, date, star rating, and comment
- Duplicate detection — a buyer can update their existing review instead of creating duplicates
- Product average rating recalculated automatically after each submission
- Seller dashboard shows full analytics: avg score + star breakdown bar chart + recent 5 reviews
- Admin users table shows seller's average rating at a glance
- Admin "Deep Dive" drawer shows complete seller rating panel

### 🔐 Role-Based Authentication
- Three completely distinct experiences: Buyer / Seller / Admin
- Each role gets a different navbar, dashboard, and set of accessible routes
- JWT tokens (1-day expiry) stored in localStorage
- All protected routes have both frontend guards and backend middleware

### 🛒 Persistent Cart
- Cart state managed by Zustand with the `persist` middleware
- Cart survives page refresh, tab close, and browser restart
- Automatic total recalculation on add/remove/quantity change

### 🎨 Dark Mode
- Full dark theme across all pages and components
- Toggled via moon/sun icon in the navbar
- Tailwind `dark:` utility classes used throughout

### ⚙️ Account Switcher (Demo Tool)
- Floating gear icon (⚙️) on the bottom-right corner of every page
- Opens a panel showing all 3 demo accounts (Buyer, Seller, Admin)
- Clicking any account: logs out → redirects to login with credentials auto-filled
- Highlights the currently active account with a gold border

### 🧮 MongoDB Aggregation
- Seller ratings computed server-side using MongoDB `$aggregate` pipeline
- Calculates avg rating, total reviews, and 5-star breakdown in a single query
- Recent reviews fetched with `.populate()` for reviewer name and product name

### 🔍 Debounced Search
- Product search has a 450ms debounce before hitting the API
- Search and category filter state synced to URL params
- URLs are shareable and bookmarkable (e.g. `/products?category=Women+Fashion&search=kurta`)

---

## 14. Troubleshooting

### Backend won't start
```
Error: Cannot connect to MongoDB
```
**Fix:** Check your `MONGODB_URI` in `backend-node/.env`. Make sure:
- Your Atlas cluster is running
- Your IP is whitelisted in Atlas Network Access (add `0.0.0.0/0` for dev)
- Username/password are correct in the connection string

---

### Frontend shows "Network Error" or blank products
**Fix:** Make sure the backend is running on port 5001. Open a new terminal and run:
```bash
cd backend-node
node server.js
```

---

### Products page is empty after setup
**Fix:** You forgot to seed the database. Run:
```bash
cd backend-node
node api_sync_engine.js
node seed_reviews.js
```

---

### Login says "Invalid credentials"
**Fix:** Make sure you ran `node api_sync_engine.js` to create the demo accounts. Use exactly:
- Email: `arjun@buyer.in` / Password: `Arjun123`

---

### Port 5001 already in use
```
Error: listen EADDRINUSE :::5001
```
**Fix:** Kill the process using that port:
```bash
lsof -ti:5001 | xargs kill -9
```
Then restart the backend.

---

### Frontend build errors (Tailwind / Vite)
**Fix:** Delete `node_modules` and reinstall:
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## Database Schema Summary

```
users          → email, hashed_password, full_name, role (buyer/seller/admin)
products       → vendor_id, name, brand, price, stock, category, image_url, rating, reviews_count
orders         → user_id, items[], total_amount, status, shipping_address
reviews        → user_id, product_id, rating (1-5), comment, is_verified_purchase
coupons        → code, discount_percentage, vendor_id (null = site-wide), expiry_date
vendors        → user_id, business_name, description, status
wishlists      → user_id, products[]
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is for educational purposes.

---

*Built with ❤️ using React, Node.js, Express, and MongoDB*
