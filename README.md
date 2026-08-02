# 🛍️ ShopSphere

A full-stack e-commerce web application built with **React, Spring Boot, MySQL, JWT authentication, and REST APIs**.

ShopSphere provides a complete online shopping experience with product browsing, search, filtering, cart management, wishlist, secure authentication, address management, orders, payments, reviews, and an admin dashboard.

## 🌐 Live Demo

- **Frontend:** https://shopsphereabhijit.vercel.app
- **Backend API:** https://shopsphere-xwok.onrender.com

> The backend is hosted on Render's free tier and may take a short time to respond after being inactive.

---

## ✨ Features

### 👤 User Features

- User registration and login
- JWT-based authentication
- User profile management
- Browse products
- View product details
- Search products
- Filter products by category
- Filter products by price range
- Sort products
- View latest products
- Add products to cart
- Update cart quantities
- Remove products from cart
- Add and remove wishlist items
- Add, update, and delete addresses
- Place orders
- Payment processing
- View order history
- Cancel orders
- Add and view product reviews
- Responsive design for desktop and mobile devices

### 🛠️ Admin Features

- Admin dashboard
- Category management
- Create categories
- Update categories
- Delete categories
- Product management
- Add products
- Update products
- Delete products
- Manage product inventory
- View and manage orders
- View application statistics

---

## 🧰 Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit
- Axios
- Material UI
- JavaScript
- HTML5
- CSS3

### Backend

- Java 26
- Spring Boot 4.1.0
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate ORM 7
- Maven
- RESTful APIs

### Database

- MySQL
- Aiven Cloud MySQL

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: Aiven
- Source Control: Git and GitHub

---

## 🏗️ Application Architecture

```text
┌──────────────────────┐
│   React Frontend     │
│       Vercel         │
└──────────┬───────────┘
           │ HTTPS REST API
           ▼
┌──────────────────────┐
│ Spring Boot Backend  │
│       Render         │
└──────────┬───────────┘
           │ JPA / Hibernate
           ▼
┌──────────────────────┐
│    MySQL Database    │
│       Aiven          │
└──────────────────────┘


ShopSphere/
│
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   └── Dockerfile
│
├── shopsphere-frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── .gitignore
└── README.md


Authentication flow:

User Login
    ↓
Spring Security Authentication
    ↓
JWT Token Generated
    ↓
Token Stored in Browser
    ↓
JWT Added to Protected API Requests
    ↓
Backend Validates Token

👨‍💻 Developer

Abhijit Jana

GitHub: https://github.com/janaabhijit2020
Project Repository: https://github.com/janaabhijit2020/ShopSphere
📄 License

This project is created for educational and portfolio purposes.

⭐ If you found this project useful, consider giving the repository a star.