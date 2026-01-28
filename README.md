# 📚 StudySync — Notes, Todos & AI Summaries

StudySync is a **full-stack productivity web application** built using the **MERN stack** that helps users manage notes, todos, and generate AI-powered summaries — all in one clean and modern workspace.

---

## 🚀 Features

### 🔐 Authentication
- Secure user **registration & login** using JWT
- Each user has **isolated data** (notes, todos, summaries)

### 📝 Notes Management
- Create, edit, delete notes
- Search notes by title/content
- Pin important notes
- Clean card-based UI

### ✅ Todos
- Add and delete tasks
- User-specific todo list
- Real-time updates

### 🤖 AI Summaries
- Generate summaries from notes
- **Daily summary counter** (auto-resets every day)
- Download summaries as text
- Centered modal UI with premium look

### 📊 Dashboard
- Total notes count
- Pending todos count
- **Summaries generated today**
- User name shown with dropdown logout (premium navbar UX)

---

## 🧠 Tech Stack

### Frontend
- React (Vite)
- React Router
- CSS / Tailwind
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### Database
- MongoDB Atlas (Cloud)

---

## 🗂️ Project Structure

study-sync/
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── layouts/
│ │ └── utils/
│ ├── public/
│ └── vite.config.js
│
└── .gitignore

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash `
git clone https://github.com/USERNAME/study-sync.git
cd study-sync 

Backend setup

cd backend
npm install

Create a .env file in backend/:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run backend:

npm start

3️⃣ Frontend setup
cd ../frontend
npm install
npm run dev

🔒 Environment Variables

Make sure these are never pushed to GitHub:

MONGO_URI

JWT_SECRET

Handled via .gitignore.

🧪 Status
✅ Authentication working
✅ Notes & Todos fully functional
✅ AI Summary with daily reset
✅ MongoDB Atlas connected
🚧 Deployment (coming soon)

👤 Author
Amit Gupta
Full-Stack Developer (MERN)
Email: guptaamit0456@gmail.com
LinkedIn: https://www.linkedin.com/in/amit-gupta-8104s/ 
