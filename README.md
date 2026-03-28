# 🏪 ME5 STORE - Premium MERN E-Commerce

A sophisticated, end-to-end MERN (MongoDB, Express, React, Node.js) E-Commerce platform featuring a high-end dark-mode-first design, robust multi-tenant administration, and real-time business analytics.

---

## 👨‍💻 Credits
**Developed By:** [Ashfaaq Feroz Muhammad](https://github.com/ashfaaqkt)  
**Project:** Entri Elevate - MERN ME5 Assessment (2026)

---

## ✨ Key Features

### 🛡️ Secure Multi-Tenant Architecture
- **Admin Data Isolation**: Admins can only view, manage, and delete their own products. 
- **Isolated Order Management**: The Admin Dashboard filters orders to show only those containing products owned by the logged-in admin.
- **Backend Ownership Enforcement**: Every API request (PUT, DELETE, GET /admin) is protected by server-side ownership verification.
- **Safety Measures**: Admins are prevented from ordering their own products on the Home page and cannot manage their own customer orders in the dashboard.

### 💎 Premium User Experience
- **Dark-Mode First**: A professional, high-contrast aesthetic with glassmorphism effects and backdrop blurs.
- **Dynamic Theme System**: Fully persistent theme toggle (Dark/Light) with system-aware scrollbars.
- **Responsive Branding**: Floating rounded Navbar and Footer (3xl) that adapt to mobile view with icon-only labels.
- **Interactive Navigation**: Includes a smooth 'Go to Top' feature and real-time cart update animations.

### 📊 Real-Time Admin Analytics
- **Dashboard Stats**: Integrated "Total Earnings" and "Total Orders" calculated dynamically based on admin-owned data.
- **Status Tracking**: Manage lifecycle of orders from Pending to Delivered with theme-aware UI badges.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|--- |--- |
| **Frontend** | React, Redux Toolkit, Tailwind CSS v4, React Router 7 |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT |
| **Icons** | React Icons (FontAwesome) |
| **State** | Persistent LocalStorage (Theme, Auth, Cart) |

---

## 📂 File Structure

```text
ME5-Ecommerce/
├── ecommerce-backend/       # Node.js + Express API
│   ├── config/              # Database connection
│   ├── controllers/         # Business logic (Auth, Products, Orders)
│   ├── middleware/          # JWT Protect, Admin Authorize, Error Handling
│   ├── models/              # Mongoose Schemas (User, Product, Order)
│   └── routes/              # API Endpoints
└── ecommerce-frontend/      # React + Tailwind Frontend
    ├── src/api/             # Axios instance configuration
    ├── src/components/      # Reusable UI (Navbar, Footer, Cards)
    ├── src/pages/           # Main views (Home, Admin, Profile, Cart)
    └── src/redux/           # Global State (Slices for Auth, Cart, Theme)
```

---

## 🚀 Local Development

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd ecommerce-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   PORT=5002
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
4. Seed initial products (optional):
   ```bash
   node seeder.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ecommerce-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```

---

## 🌐 Live Demo
*Placeholder for live URL (To be added after hosting)*

---

## 📄 License
Practice and Education Purpose Only. Developed for the ME5 Assessment.
