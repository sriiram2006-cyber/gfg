# GeeksforGeeks RIT Campus Club Platform 🚀

A premium, full-stack web application designed for the GeeksforGeeks RIT Campus Club. This platform features a coding challenge hub, a real-time leaderboard, AI-powered roadmap generation, and a members-only authentication system.

## ✨ Features

- **Premium UI/UX**: Dark-themed, glassmorphic design consistency across all pages.
- **Coding Hub**: Fully integrated coding environment with Monaco Editor and real-time scoring via Judge0.
- **Member Authentication**: Secure signup and login exclusively for students using college emails.
- **Live Leaderboard**: Dynamic ranking system based on coding challenge points.
- **AI Roadmap Generator**: Personalized learning paths for students.
- **Mobile Responsive**: 100% responsive design with functional mobile navigation.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Tailwind CSS, Vanilla JavaScript, Font Awesome.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **APIs**: Judge0 (Code Execution), Gemini/Groq (AI Roadmaps).
- **Editor**: Monaco Editor.

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB instance running locally or on Atlas.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sriiram2006-cyber/e.git
   cd e
   ```

2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the `backend` directory and add:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/gfg_rit
   # Add your API keys here
   GEMINI_API_KEY=your_key
   GROQ_API_KEY=your_key
   ```

4. **Run the Server**:
   ```bash
   npm start
   ```

5. **Open the Frontend**:
   Open `index.html` in your browser (or use a live server).

---
Developed with ❤️ for the GfG RIT Community.
