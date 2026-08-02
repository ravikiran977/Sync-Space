# 📌 SYNC SPACE- A Project Management System (MERN Stack)

A full-stack task management application built using the MERN stack that enables admins to assign tasks and users to track and update progress through an interactive dashboard.

## 🚀 Project Overview

**Sync-Space** is a full-stack, Kanban-style project management platform designed to streamline team collaboration and task execution. Built with the MERN stack (MongoDB, Express, React, Node.js), it empowers teams to centralize project planning, task delegation, and progress tracking in one intuitive workspace.

**Key Capabilities:**
- **Workspace Management:** Effortlessly create dedicated projects and invite team members to collaborate.
- **Role-Based Access Control:** Tailored, secure experiences for Admins (planning & delegation) and Users (task execution).
- **Interactive Kanban Workflows:** Visual task lifecycle management across distinct stages (`To Do` → `In Progress` → `Review` → `Completed`).
- **Clear Accountability:** Track task ownership, due dates, and priority levels to ensure nothing falls through the cracks.
- **Secure Authentication:** Robust JWT-based authentication and encrypted credentials to keep organizational data safe.

## 🌐 Live Demo

**Deployed on:** Vercel (Frontend) & Render (Backend)

[https://sync-space-gamma.vercel.app/](https://sync-space-gamma.vercel.app/)

## 🔑 Demo Login Credentials

Registration is temporarily disabled on the live deployment to protect database limits. Please use the following credentials to explore the application:

### Admin Account (Project Creation & Assignment)
- **Email:** `admin@syncspace.com`
- **Password:** `newadmin`

### User Accounts (Task Management & Updates)
- **Email:** `user1@syncspace.com`
- **Password:** `demouser1`

- **Email:** `user2@syncspace.com`
- **Password:** `demouser2`

- **Email:** `user3@syncspace.com`
- **Password:** `demouser3`

## 🎯 Feature Goals

### 🔐 Authentication & Authorization
-   User registration & login
-   Password hashing using bcrypt
-   JWT-based authentication
-   Role-based access control (Admin/User)

### 👨‍💼 Admin Features
-   Create and manage Projects
-   Create tasks
-   Assign tasks to users
-   View all tasks
-   Track task progress
-   Filter tasks by project, user, and status:
    -   todo
    -   in-progress
    -   review
    -   completed

### 👨‍💻 User Features
-   View assigned tasks
-   Update task status
-   Interactive task workflow management
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
2.  Admin creates project and invite users
3.  Admin creates a task
4.  Task is assigned to a user
5.  User views task in dashboard
6.  User updates status: `todo` → `in-progress` → `review` → `completed`

## 📁 Project Structure

```

sync-space/
├── .vscode/
│   └── settings.json
├── backend/
│   ├── .env                       # Environment variables (Mongo URI, JWT Secret)
│   ├── package.json               # Backend dependencies and scripts
│   ├── package-lock.json
│   ├── server.js                  # Express server entry point
│   ├── middleware/                # Custom Express middlewares
│   │   ├── authMiddleware.js      # Verifies JWT tokens
│   │   ├── authorizeRoles.js      # Role-based access control (Admin/User)
│   │   └── validateObjectId.js    # Validates MongoDB ObjectIDs
│   ├── models/                    # Mongoose database schemas
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── User.js
│   └── routes/                    # API route handlers
│       ├── taskRoutes.js
│       └── userRoutes.js          # Handles auth, registration, and password resets
├── frontend/
│   ├── .gitignore
│   ├── package.json               # Frontend dependencies and scripts
│   ├── package-lock.json
│   ├── public/                    # Static public assets
│   │   ├── index.html
│   │   └── ... 
│   └── src/
│       ├── App.js                 # Main React component & router setup
│       ├── index.js               # React application entry point
│       ├── api/                   
│       │   └── api.js             # Axios instance setup
│       ├── components/            # Reusable UI components (Nav, Modals, Cards)
│       ├── pages/                 # Route-level components
│       │   ├── ForgotPassword.jsx
│       │   ├── Landing.jsx
│       │   ├── Register.jsx
│       │   └── ... (Login, AdminDashboard, UserDashboard)
│       └── styles/                # CSS stylesheets
│           ├── ForgotPassword.css
│           ├── Landing.css
│           ├── Register.css
│           └── ... 
├── .gitignore                     # Root git ignore file
└── README.md                      # Main project documentation



```

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory:

```
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret_key
```

Create a `.env` file in the **`frontend`** directory (if applicable):

```
REACT_APP_API_URL=http://localhost:5000/api
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
-   `POST /api/users/forgot-password` (Generate Reset Token)
-   `POST /api/users/reset-password` (Reset Password)

### Projects
-   `GET /api/projects` (Get Projects)
-   `POST /api/projects/:projectId/users` (Invite Users)

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
-   ✅ Cloud deployment (Vercel / Render) - **Completed**
-   🧪 Testing (Jest / Supertest)

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

## 📦 Version

v1.0.0

-   Authentication system
-   Task management
-   Project management
-   Admin & User dashboards

## 👨‍💻 Author:

Ravi Kiran Vempati

Full Stack Developer (MERN)
Passionate about scalable web applications

- **LinkedIn:** https://www.linkedin.com/in/leela-ravi-kiran-vempati-39a590181/
- **GitHub:** https://github.com/ravikiran977

## ⭐ Final Note

This project demonstrates:

-   Real-world full-stack development
-   Secure authentication systems
-   Scalable architecture design
-   Clean UI with task workflow management
