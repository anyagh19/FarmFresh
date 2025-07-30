# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# FarmFresh

**FarmFresh** is a modern e-commerce web app built with React, featuring seamless shopping for farm produce and groceries. It leverages Appwrite for backend-as-a-service, Redux for global state management, Framer Motion for animations, Razorpay (test mode) for payments, and Tailwind CSS for a robust, responsive UI.

---

## Features

- 🚀 Fast and responsive React SPA
- 🔐 User authentication and data (Appwrite)
- 📦 Product listing & shopping cart (Redux)
- 💳 Payments powered by Razorpay (test mode, no real money involved)
- 🎬 Smooth UI/UX with Framer Motion
- 🎨 Styled with Tailwind CSS
- 🌱 Designed for ease of customization for agriculture or fresh produce stores

---

## Tech Stack

- **React** (Frontend)
- **Appwrite** (Authentication, Database, Storage)
- **Redux** (State management)
- **Framer Motion** (Page/component animations)
- **Razorpay** (Test-mode payments)
- **Tailwind CSS** (Modern utility-first styling)

---

## Getting Started

### 1. Clone the repository


### 2. Install dependencies


### 3. Configure Appwrite

- [Install and set up Appwrite](https://appwrite.io/docs/quick-starts/for-web) self-hosted or use an existing instance.
- Create your project, collections (e.g., `products`, `users`, `orders`), set authentication.
- Note your endpoint and project ID.

### 4. Set up environment variables

Create a `.env` file in the root:

*(get Razorpay test key from https://dashboard.razorpay.com/app/keys and set in test mode)*

### 5. Run the app

Now visit [farm-fresh-topaz.vercel.app
](farm-fresh-topaz.vercel.app
) to see FarmFresh in action!

---

## Scripts

- `npm start` — Starts development server
- `npm run build` — Builds for production

---

## Project Structure


---

## Integrations

### Appwrite

- Used for user accounts, product and order data, image storage.

### Redux

- Used for cart, user session, and shared state.

### Framer Motion

- For route/page and UI element animations.

### Razorpay

- Payment integration (test mode only; switch to live keys for production).

### Tailwind CSS

- Utility-based CSS for all layouts and components.

---





---

## Author

Anya19
