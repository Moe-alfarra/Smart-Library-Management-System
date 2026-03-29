# Library Management System - React Frontend

A modern, production-ready React frontend for the Library Management System.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd library-frontend-react
npm install
```

### 2. Configure Backend URL
Edit `.env` if your backend is not on `localhost:8080`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

### 4. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
library-frontend-react/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── AuthScreen.jsx
│   │   ├── BookCard.jsx
│   │   ├── Header.jsx
│   │   └── Toast.jsx
│   ├── services/          # API calls
│   │   └── api.js
│   ├── hooks/             # Custom React hooks
│   │   └── useToast.js
│   ├── utils/             # Utility functions
│   │   └── jwt.js
│   ├── App.jsx            # Main application
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## ✨ Features

- ✅ User Authentication (Login/Register)
- ✅ Browse & Search Books
- ✅ Category Filtering (15 categories)
- ✅ Borrow/Return Books
- ✅ Borrow History with Overdue Tracking
- ✅ Admin: Add/Delete/Restore Books
- ✅ Admin: User Management
- ✅ Toast Notifications
- ✅ Responsive Design
- ✅ Production-Ready Build

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **JWT** - Authentication

## 📝 Notes

- Backend must be running on `http://localhost:8080`
- Uses JWT tokens stored in localStorage
- Hot reload enabled in development mode

