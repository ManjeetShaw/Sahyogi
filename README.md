# Sahyogi
MERN + Google Gemini platform for government service assistance, scheme recommendations, complaint management, multilingual support, and document guidance.
# 🇮🇳 SarkarSaathi AI

> **Your Intelligent Government Companion**

SarkarSaathi AI is a production-ready, AI-powered citizen platform that simplifies access to Indian government services using the MERN stack and Google's AI ecosystem. It enables citizens to understand government schemes, receive document guidance, manage complaints, simplify official notices, and interact with government services through natural language, voice, and multilingual support.

> 🚀 Built for a National Hackathon with a focus on accessibility, transparency, and digital inclusion.

---

## ✨ Features

### 🤖 AI Government Assistant
- Chat with an AI-powered government assistant
- Ask questions in natural language
- Guidance for:
  - Aadhaar
  - PAN
  - Passport
  - Voter ID
  - Driving License
  - GST
  - Income Tax
  - Scholarships
  - Certificates
  - Pension
  - PMAY
  - Ration Card
  - and many more government services

### 🎯 Personalized Scheme Recommendation
- AI-powered eligibility detection
- Personalized government scheme recommendations
- Benefit comparison
- Required documents
- Application guidance

### 📄 Smart Document Assistant
- Required document checklist
- Photo specifications
- Common rejection reasons
- Fees & timelines
- Downloadable checklist

### 📝 AI Complaint Writer
Convert simple language into professionally formatted government complaints.

### 📍 Complaint Management
- Register complaints
- Upload supporting images
- AI-powered image analysis (Gemini Vision)
- Google Maps location picker
- Complaint ID generation

### 📊 Complaint Tracking
Track complaint status with a visual timeline:
- Submitted
- Verified
- Assigned
- In Progress
- Resolved

### 📢 Government Notice Simplifier
Convert complex government notifications into easy-to-understand summaries.

### 🌐 Multilingual Support
Supports multiple Indian languages:
- English
- Hindi
- Bengali
- Tamil
- Telugu
- Marathi
- Gujarati
- Kannada
- Malayalam
- Punjabi

### 🎙 Voice Assistant
- Speech-to-Text
- Text-to-Speech
- Voice conversations

### 🗺 Nearby Government Offices
Locate nearby:
- Hospitals
- Police Stations
- Passport Offices
- CSC Centers
- Banks
- Municipal Offices
- Government Offices

### 👤 User Dashboard
- Profile Management
- Chat History
- Recommended Schemes
- Complaints
- Notifications
- Saved Items
- Settings

---

# 🛠 Tech Stack

## Frontend
- React (Vite)
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- React Hook Form
- Framer Motion
- Lucide Icons

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Multer

## Google AI Ecosystem
- Gemini 2.5 Flash
- Google AI Studio
- Google Generative AI SDK
- Gemini Vision
- Firebase Authentication
- Firebase Analytics
- Google Maps API
- Places API
- Geocoding API
- Google Speech-to-Text
- Google Text-to-Speech
- Google OAuth
- reCAPTCHA

---

# 📂 Project Structure

```
SarkarSaathi-AI/
│
├── client/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── context/
│       ├── constants/
│       ├── utils/
│       └── App.jsx
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── prompts/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       ├── utils/
│       ├── app.js
│       └── server.js
│
├── docs/
├── README.md
└── LICENSE
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/yourusername/SarkarSaathi-AI.git

cd SarkarSaathi-AI
```

---

## Backend Setup

```bash
cd server

npm install
```

Create a `.env` file.

```env
PORT=

MONGO_URI=

JWT_SECRET=

GEMINI_API_KEY=

GOOGLE_MAPS_API_KEY=

FIREBASE_API_KEY=

FIREBASE_AUTH_DOMAIN=

FIREBASE_PROJECT_ID=
```

Run the backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# 📱 Planned Screens

- Landing Page
- Login
- Register
- Dashboard
- AI Assistant
- Scheme Recommendation
- Document Assistant
- Complaint Registration
- Complaint Tracking
- Government Notice Simplifier
- Nearby Offices
- Profile
- Settings
- 404 Page

---

# 🔒 Security

- JWT Authentication
- Google OAuth
- Firebase Authentication
- Helmet
- Rate Limiting
- Password Hashing
- Input Validation
- Environment Variables
- XSS Protection
- Secure REST APIs

---

# 🎨 UI Highlights

- Glassmorphism
- Modern Government SaaS Design
- Dark / Light Theme
- Responsive Layout
- Mobile First
- Smooth Animations
- Accessible Design
- Soft Shadows
- Rounded Components

---

# 📈 Roadmap

- [ ] Project Setup
- [ ] Authentication
- [ ] Backend Foundation
- [ ] Database Models
- [ ] Gemini Integration
- [ ] AI Government Assistant
- [ ] Scheme Recommendation Engine
- [ ] Document Assistant
- [ ] Complaint Management
- [ ] Gemini Vision
- [ ] Google Maps Integration
- [ ] Complaint Tracking
- [ ] Multilingual Support
- [ ] Voice Assistant
- [ ] Dashboard
- [ ] UI Polish
- [ ] Documentation
- [ ] Deployment
- [ ] Performance Optimization
- [ ] Production Release

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 💡 Vision

Our goal is to bridge the gap between citizens and government services by leveraging AI to make public services more accessible, transparent, and user-friendly.

---

## ⭐ If you find this project useful, consider giving it a star!

Made with ❤️ for Digital India 🇮🇳
