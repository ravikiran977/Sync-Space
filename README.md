# 📌 SYNC SPACE- A Project Management System (MERN Stack)

A full-stack task management application built using the MERN stack that enables admins to assign tasks and users to track and update progress through an interactive dashboard.

## 🚀 Project Overview

The Sync-space helps teams efficiently manage workflows by providing:

-   Role-based access (Admin & User)
-   Task assignment and tracking
-   Kanban-style task management
-   Secure authentication system

## 🎯 Feature Goals

### 🔐 Authentication & Authorization
-   User registration & login
-   Password hashing using bcrypt
-   JWT-based authentication
-   Role-based access control (Admin/User)

### 👨‍💼 Admin Features
-   Create tasks
-   Assign tasks to users
-   View all tasks
-   Track task progress
-   Filter tasks by status:
    -   todo
    -   in-progress
    -   review
    -   completed

### 👨‍💻 User Features
-   View assigned tasks
-   Update task status
-   Drag-and-drop task workflow
-   Personalized dashboard

### 📊 Task Management
-   Task lifecycle: `todo` → `in-progress` → `review` → `completed`
-   Full CRUD operations
-   Task filtering & categorization

## ⚡ Key Highlights

-   Built a complete MERN stack application from scratch
-   Implemented role-based authentication & authorization
-   Designed a Kanban-style task board
-   Created reusable backend middleware
-   Structured scalable project architecture

## 🛠️ Tech Stack

### 🔹 Backend
-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT (Authentication)
-   bcrypt
-   dotenv
-   CORS

**📦 Dependencies**: `express`, `mongoose`, `jsonwebtoken`, `bcrypt`, `dotenv`, `cors`

### 🔹 Frontend
-   React.js
-   Axios
-   CSS (Custom styling)
-   LocalStorage

### 🔹 Tools
-   Nodemon
-   Git & GitHub
-   VS Code

## 🧱 Architecture

-   MVC pattern in backend
-   RESTful API communication
-   Middleware-based request handling
-   Stateless authentication using JWT
-   MongoDB schema-based design

## 🔄 Application Flow

1.  Admin logs in
2.  Admin creates a task
3.  Task is assigned to a user
4.  User views task in dashboard
5.  User updates status: `todo` → `in-progress` → `review` → `completed`

## 📁 Project Structure

```
sync-space/
├── .vscode/
│   └── settings.json
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── authorizeRoles.js
│   │   └── validateObjectId.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   └── routes/
│       ├── taskRoutes.js
│       └── userRoutes.js
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── .gitignore
│   ├── public/
│   │   ├── index.html
│   │   └── ... (other public assets)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       ├── App.js
│       └── index.js
├── .gitignore
├── README.md
```

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory:

```
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret_key
```

## ▶️ Getting Started

1.  **Clone Repo**
    ```bash
    git clone <your-repo-link>
    cd sync-space
    ```

2.  **Install Dependencies**
    **Backend**
    ```bash
    cd backend
    npm install
    ```
    **Frontend**
    ```bash
    cd ../frontend
    npm install
    ```

3.  **Run Project**
    **Start Backend** (from `sync-space/backend` directory)
    ```bash
    npm run dev
    ```
    **Start Frontend** (from `sync-space/frontend` directory)
    ```bash
    npm start
    ```

## 🔗 API Endpoints

### Auth
-   `POST /api/users/register`
-   `POST /api/users/login`

### Tasks
-   `GET /api/tasks`
-   `POST /api/tasks`
-   `PUT /api/tasks/:id`
-   `DELETE /api/tasks/:id`

## 📸 Screenshots

*(Add screenshots here to showcase your application's UI)*

## 🔐 Security Features

-   Password hashing using bcrypt
-   JWT-based authentication
-   Protected routes using middleware
-   Role-based authorization

## ⚠️ Known Limitations

-   No real-time updates (manual refresh needed)
-   No notification system
-   Limited mobile responsiveness

## 🚀 Future Enhancements

-   🔔 Real-time updates (WebSockets)
-   📅 Task deadlines & reminders
-   📊 Analytics dashboard
-   📎 File attachments
-   🌐 Cloud deployment (AWS / Vercel / Render)
-   🧪 Testing (Jest / Supertest)

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

## 📦 Version

v1.0.0

-   Authentication system
-   Task management
-   Admin & User dashboards

## 👨‍💻 Author:

Ravi Kiran Vempati

Full Stack Developer (MERN)
Passionate about scalable web applications

## ⭐ Final Note

This project demonstrates:

-   Real-world full-stack development
-   Secure authentication systems
-   Scalable architecture design
-   Clean UI with task workflow management
