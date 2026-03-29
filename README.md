SMART LIBRARY MANAGEMENT SYSTEM
================================

Project Overview
----------------
The Smart Library Management System is a full-stack web application designed to manage library operations efficiently. 
It allows users to browse books, borrow and return them, renew borrows, reserve unavailable books, and manage their accounts. 
Administrators can manage books, monitor borrowing activity, and control the overall system.

The system is built using a modern web stack with a React frontend, a Java Spring Boot backend, and a PostgreSQL database.

This project demonstrates full-stack development, REST API design, authentication and authorization, and database management.


Main Features
-------------

Authentication and Security
- JWT-based authentication
- Role-based access control (ADMIN / MEMBER)
- Secure password hashing using BCrypt (hashed password stored in database)
- Protected REST API endpoints using Spring Security (API endpoint access based on role)

Book Management
- View available books
- Add new books (ADMIN)
- Update book copies (ADMIN)
- Update book category (ADMIN)
- Update book tags (ADMIN)
- Soft delete books (ADMIN)
- Restore deleted books (ADMIN)
- Permanently delete books (ADMIN)

Categories and Tags
- Book categorization
- Multiple tags per book
- Filter books by category
- Filter books by tags
- Manage book tags (ADMIN)

Borrowing System
- Borrow available books (Max. 5 Active borrows)
- Return borrowed books (Can return before due date)
- Automatic due date tracking (14 days due date for each borrow)
- Late return status tracking ($2 late fee per day)
- Fine calculation support (Calculates and displays total fine for late returns)

Renewal System
- Borrowed books can be renewed (if no reservations OR if reservations are satisfied and copies are available)
- Renewal limits enforced (Max. 2 renewals per borrow)

Reservation System
- Reserve books when they are unavailable (Max. 3 Active Reservations)
- Queue-based reservation system (First user gets priority to borrow when book copies become available)
- Reservation status tracking (ACTIVE, FULFILLED, CANCELLED)

User Management
- View all users (ADMIN)
- View user borrowing history
- View all users borrowing history (ADMIN)
- Return books on behalf of users (ADMIN)
- Cancel Reservations on behalf of users (ADMIN)


Technology Stack
----------------

Frontend
- React
- Vite
- CSS
- Fetch API

Backend ()
- Spring Boot
- Spring Security
- JWT Authentication
- RESTful API design

Database
- PostgreSQL

Other Tools
- Maven
- Git
- GitHub


Project Structure
-----------------

Smart-Library-Management-System

    frontend/
        src/
        package.json
        vite.config.js
        ...

    Smart-Library-Management-System-Backend/
        src/
        pom.xml
        mvnw
        ...

    README.txt


System Architecture
-------------------

Client (React Frontend)
        |
        v
Spring Boot REST API (Controller Layer -> Service Layer -> Repository Layer)
        |
        v
PostgreSQL Database


Running the Project Locally
---------------------------

1. Clone the repository

git clone https://github.com/Moe-alfarra/Smart-Library-Management-System.git
cd Smart-Library-Management-System


2. Setup PostgreSQL Database

Create a PostgreSQL database before  running the backend (NOTE: Refer to the DB Design and Schema)
 
You should have 5 tables:

Core Entities: users, books
Borrowing System: borrow_records (connects users with books many-to-many [M-N])
Reservation System: reservations (connects users with books many-to-many [M-N])
Book Metadata: book_tags (assigns tags to specific books 1-to-many [1-M]) 

Update the backend configuration file:

Smart-Library-Management-System-Backend/src/main/resources/application.properties

Example configuration:

spring.datasource.url=jdbc:postgresql://localhost:5432/library_db
spring.datasource.username=postgres
spring.datasource.password=yourpassword


3. Run the Backend (Recommended: Using IntelliJ)

Navigate to the backend folder:

cd Smart-Library-Management-System-Backend

Run the Spring Boot application:

./mvnw spring-boot:run or press Run if using IntelliJ

The backend will start at:

http://localhost:8080


4. Run the Frontend

Navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will start at:

http://localhost:5173


API Overview
------------

Authentication

POST /api/auth/login

POST /api/auth/member/register

Books

POST /api/books

GET /api/books/id/{id}

GET /api/books/isbn/{isbn}

GET /api/books/categories

GET /api/books/category/{category}

GET /api/books/tag/{tag}

Borrow Records

POST /api/borrow-records

PUT /api/borrow-records/{id}/return

GET /api/borrow-records/user/{userId}

Renewal 

PUT /api/borrow-records/{borrowId}/renew

Reservations

POST /api/reservations

DELETE /api/reservations/{id}

Users

GET /api/users/id/{id}


Deployment Notes
----------------
For demonstration purposes, the frontend can be deployed online while the backend and database are run locally.

In a full production deployment, the frontend, backend, and database should all be hosted in the same cloud environment to reduce latency and improve reliability.


Future Improvements
-------------------

Potential enhancements include:

- AI-based book recommendations
- Email notifications for due dates
- Book cover image uploads
- Admin analytics dashboard
- Mobile-friendly UI improvements


Author
------

Mohammed Alfarra

Computer Science Graduate  
