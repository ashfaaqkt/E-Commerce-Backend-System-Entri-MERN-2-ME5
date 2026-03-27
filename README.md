# End-to-End MERN Stack E-Commerce Platform

A fully integrated MERN Stack E-Commerce Application, combining a React frontend with a Node.js + Express + MongoDB backend. This project showcases seamless communication between the UI and server, robust data flow, secure authentication, and a cohesive user experience with a beautiful blue to white gradient aesthetic design.

## Entri Elevate - MERN - 2026 - ME5

**Credits:** Ashfaaq Feroz Muhammad

**Project Purpose:** This project is practice and education purpose "license".

## Features

### Backend Integration
- Secure JWT authentication and bcryptjs-based password encryption.
- Structured CRUD APIs for Products, Orders, User Profiles.
- Role-based access control (admin/user) via middleware.
- Scalable folder architecture with clean routing and modular controllers.
- Simulated RapidMiner-based Recommendation System endpoint for tailored product suggestions.

### Frontend Integration
- Product listing, detail view, filtering, and search using React Router + Axios connected to backend APIs.
- Global state management with React Redux (Redux Toolkit) for cart and login.
- Responsive UI using Tailwind CSS v4 featuring premium blue-to-white aesthetic gradients.
- Login/Logout simulation synchronized with backend authentication flow.

## Project Structure

- `ecommerce-backend/`: Node.js, Express, MongoDB API.
- `ecommerce-frontend/`: React, Vite, Redux Toolkit, Tailwind CSS frontend.

## Installation & Local Development

Reference the `deployment_instructions.txt` file for complete step-by-step instructions.

### Backend Setup
1. `cd ecommerce-backend`
2. `npm install`
3. Check `.env` and configure `MONGO_URI` and `JWT_SECRET`.
4. `npm run dev`

### Frontend Setup
1. `cd ecommerce-frontend`
2. `npm install`
3. `npm run dev`

## Contribution
Check open issues or create a pull request.
