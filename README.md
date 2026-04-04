# TaskFlow - Full-Stack Task Management System

TaskFlow is a modern, responsive, and secure Task Management System built with **Next.js** and **Node.js**. It allows users to register, log in, and manage their daily tasks (Create, Read, Update, Delete) with advanced features like pagination, searching, and filtering.

## Tech Stack

### Frontend (Client)
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS, shadcn/ui
* **API Calls:** Axios (with Interceptors for automatic token refresh)
* **State Management:** React Hooks
* **Proxy:** Next.js Rewrites (to prevent cross-domain cookie issues in production)

### Backend (Server)
* **Runtime:** Node.js with Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Security:** JWT (Access & Refresh Tokens), bcrypt (Password Hashing), HttpOnly Cookies

***

## Key Features
* **Secure Authentication:** Uses strict `HttpOnly` cookies to store JWT tokens securely. Automatically refreshes expired access tokens in the background without logging the user out.
* **Full Task CRUD:** Create, view, edit, and delete personal tasks.
* **Advanced Filtering:** Search tasks by title, and filter them by Status (Pending/Completed) and Priority (Low/Medium/High).
* **Pagination:** Loads tasks in small batches to keep the app fast.
* **Dashboard Stats:** See total, pending, and completed tasks at a glance.

***

## Local Setup Instructions

Follow these simple steps to run the project on your local machine.

### 1. Prerequisites
Make sure you have the following installed on your PC:
* Node.js (v18 or higher)
* PostgreSQL (Running locally or a cloud database like Neon/Supabase)
* Git

### 2. Clone the Repository
```bash
git clone https://github.com/AbdulBasit2733/TMS/taskflow.git
cd taskflow
```

***

### 3. Backend Setup
Open a new terminal terminal window and go to the backend folder:

```bash
cd backend
npm install
```

**Environment Variables:** Create a `.env` file in the `backend` folder and add the following:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow_db"
JWT_ACCESS_SECRET="your_super_secret_access_key"
JWT_REFRESH_SECRET="your_super_secret_refresh_key"
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Database Setup & Run Server:**
```bash
# Migrate The Db
npx prisma migrate dev --name init

# Start the backend server
npm run dev
```
*The backend should now be running on `http://localhost:5000`.*

***

### 4. Frontend Setup
Open another terminal window and go to the frontend folder:

```bash
cd frontend
npm install
```

**Environment Variables:** Create a `.env` file in the `frontend` folder and add the following:
```env
BACKEND_URL=http://localhost:5000
NODE_ENV=development
```

**Run the Frontend:**
```bash
npm run dev
```
*The frontend should now be running on `http://localhost:3000`.*

***

## Production Deployment Notes (Important!)

This project uses **HttpOnly Cookies** for authentication. To make this work seamlessly in production (like Render, Vercel, etc.) where the frontend and backend are on different subdomains, we use **Next.js Rewrites**.

1. **How it works:** The frontend Axios always makes API calls to `/api/v1/...`. The Next.js server intercepts this and proxies it to the actual `BACKEND_URL`. This tricks the browser into thinking it is a "Same-Origin" request, avoiding strict Cross-Domain cookie blocks!
2. **Backend Proxy Trust:** If deploying the backend on Render/Heroku, Express uses `app.set("trust proxy", 1)` so secure cookies are sent properly through the load balancer.
3. **Tailwind Build Error:** If deploying Next.js 15+ on Render and you get a `@tailwindcss/postcss` missing error, set your build command to: `npm install --include=dev && npm run build`.

***

## Troubleshooting

**Q: I am getting a 404 Error when trying to login locally.**
* **Answer:** This happens if Next.js caches the old `next.config.mjs` file. Stop the frontend server (`Ctrl+C`), delete the `.next` folder (`rm -rf .next`), and run `npm run dev` again. 

**Q: My cookies are not being saved in the browser.**
* **Answer:** Make sure you are not calling `http://localhost:5000` directly from the frontend Axios config. Always use the relative path `baseURL: "/api/v1"`.

***
