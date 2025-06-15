# 📸 Insta Clone — Full Stack Instagram Clone

A full-stack Instagram-style web application built with:

- 🌐 **Frontend**: Vue.js + Tailwind CSS  
- 🔧 **Backend**: Node.js, Express.js, MongoDB, Passport.js

Designed for learning, practice, and portfolio purposes.

---

## 📁 Project Structure

Insta_clone/
├── client/ # Vue.js + Tailwind CSS frontend
├── server/ # Express.js backend
└── README.md # Main project documentation

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/zeeshan-ahmad-dev/Insta_clone.git
cd Insta_clone
 2. Setup Backend (Server)
1️⃣ Install dependencies
cd server
npm install
2️⃣ Create .env file inside the server/ folder
PORT=8000
DB_URL=Your_Database_Url
FACEBOOK_APP_ID=Your_Facebook_App_ID
FACEBOOK_APP_SECRET=Your_Facebook_App_Secret
CALLBACK_URL=http://localhost:8000/auth/facebook/callback
Replace the values with your actual credentials.

3️⃣ Run the server
npm run dev
Server will run at: http://localhost:8000

3. Setup Frontend (Client)
cd client
npm install
npm run dev
Frontend will run at: http://localhost:5173

✅ Notes
Make sure MongoDB is running locally or you're using a working cloud MongoDB URI.

Facebook login requires correct app credentials and valid OAuth redirect URIs in your Facebook developer dashboard.
```

---


## ✨ Features

- User authentication via Facebook login
- Upload and display posts with captions
- Like and comment functionality
- Responsive UI (mobile + desktop)
- Protected routes with Passport.js

---

## 🛠️ Tech Stack

**Frontend**: Vue.js, Tailwind CSS  
**Backend**: Node.js, Express.js, Passport.js  
**Database**: MongoDB  
**Auth**: Facebook OAuth  

---

👨‍💻 Author
Zeeshan Ahmad
https://github.com/zeeshan-ahmad-dev

⭐️ Give a Star
If you like this project, feel free to give it a ⭐️ on GitHub — it helps me grow!