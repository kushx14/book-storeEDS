📚 Book Store – Full-Stack Intern Assignment
📌 Overview

This project is a Full-Stack Book Store application built using Angular, Express 5, and JWT authentication.
It demonstrates frontend–backend integration, state management using NgRx Signal Store, authentication, and API handling.

🛠 Tech Stack

Frontend

Angular (Standalone Components)

NgRx Signal Store

TypeScript

Backend

Express 5 (Node.js)

TypeScript

MongoDB

JWT Authentication

🔐 Authentication

Login / Auto-Signup using email & password

JWT issued by backend

Protected routes using JWT middleware and Angular route guards

📖 Features

User Login

Book Library (view all books)

Book Details page

Add Book (with inventory count)

Buy & Rent books

Cart & Checkout

User Profile (published, bought, rented books)
<img width="1483" height="637" alt="image" src="https://github.com/user-attachments/assets/340b2631-321e-4784-a799-2f165fe35cab" />

🧠 State Management (NgRx Signal Store)

All application state is managed using NgRx Signal Store.

Store	Responsibility
UserInfoStore	Authentication & JWT
BooksStore	Books, details, inventory
CartStore	Cart & checkout

No RxJS global state or ad-hoc variables are used.

🔁 Inventory Logic

Each book has copiesAvailable

Buy/Rent reduces available copies

When copies reach 0, book is marked Not Available

🔗 API Endpoints

Public

POST /api/auth/login

GET /api/books

GET /api/books/:id

Protected (JWT)

POST /api/books

POST /api/books/:id/buy

POST /api/books/:id/rent

GET /api/books/my/books

📝 Commit Note

The project was implemented feature-by-feature locally and pushed as a single final commit due to time constraints. All required features are clearly structured and documented.
