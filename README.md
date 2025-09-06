# 📅 Planify  

**Planify – Your tasks, simplified ✨**  

Planify is a modern and minimal **Task Manager Web App** that helps you stay productive, organized, and focused.  

---

## ✨ Features  
- ✅ Add, edit, and delete tasks with ease  
- 🗂️ Organize tasks by categories & priorities  
- ⏰ Set due dates and reminders  
- 🌙 Clean, responsive, and user-friendly UI  
- 💾 Save tasks using MongoDB Database  
- 🔐 User authentication and authorization
- 📱 Responsive design with Tailwind CSS

---

## 🛠 Tech Stack  
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express 
- **Database:** MongoDB
- **Authentication:** JWT

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Planify
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   - The server/.env file is already configured with MongoDB connection
   - Update MONGODB_URI if needed

4. **Start the application**
   ```bash
   # Option 1: Use the batch script (Windows)
   start-dev.bat

   # Option 2: Manual start
   # Terminal 1 - Backend
   cd server
   npm start

   # Terminal 2 - Frontend  
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

---

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Dashboard**: View your task statistics and manage tasks
3. **Add Tasks**: Click "Add Task" to create new tasks with priority and due dates
4. **Manage Tasks**: Edit, delete, or mark tasks as complete
5. **Filter Tasks**: View all, pending, or completed tasks

---

## 🔧 API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/me` - Get current user (protected)

### Tasks
- `GET /api/task/gp` - Get all user tasks (protected)
- `POST /api/task/gp` - Create new task (protected)
- `GET /api/task/gp/:id` - Get specific task (protected)
- `PUT /api/task/gp/:id` - Update task (protected)
- `DELETE /api/task/gp/:id` - Delete task (protected) 
