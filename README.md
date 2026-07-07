# Sahyogi 🇮🇳

> **Your Intelligent Government Companion**

Sahyogi (working codename **SarkarSaathi AI**) is a citizen platform that simplifies access to government services — letting people report civic issues, browse government services, and get help from an AI companion, all in one place.

> Built with accessibility, transparency, and digital inclusion in mind.

---

## ✅ Currently Implemented

This is the real, working state of the codebase today (not the full long-term vision below):

- **AI Companion Chat** — citizens can ask natural-language questions and get answers grounded in the platform's own services data, powered by the Anthropic Claude API
- **Issue Reporting** — citizens can submit civic issues (potholes, garbage, water supply, etc.) with category, description, and location; status tracked (submitted → in progress → resolved)
- **Government Services Directory** — searchable list of services/schemes with descriptions, required documents, and eligibility info
- **Authentication** — JWT-based register/login, protected routes on the client
- **REST API** — Express + MongoDB (Mongoose) backend with proper error handling, rate limiting, and CORS

## 🛠 Tech Stack (Actual)

**Frontend:** React (Vite), React Router, Axios, plain CSS
**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT auth, bcrypt, express-rate-limit, morgan
**AI:** Anthropic Claude API (`@anthropic-ai/sdk`), server-side only — the API key never touches the client

---

## 📂 Project Structure (Actual)

```
Sahyogi/
│
├── frontend/                # React + Vite app
│   └── src/
│       ├── api/            # axios instance
│       ├── components/     # Navbar, IssueCard, ProtectedRoute, StatusStamp
│       ├── context/         # AuthContext
│       └── pages/          # Home, Login, Register, Issues, ReportIssue, Services, AICompanion, NotFound
│
├── backend/                 # Express API
│   └── src/
│       ├── config/         # db.js (Mongo connection)
│       ├── controllers/    # auth, issue, service, ai
│       ├── middleware/     # auth, errorHandler
│       ├── models/         # User, Issue, Service, ChatMessage
│       ├── routes/         # authRoutes, issueRoutes, serviceRoutes, aiRoutes
│       ├── data/           # seedServices.js
│       ├── app.js
│       └── server.js
│
├── docs/                   # API.md, ARCHITECTURE.md
├── .github/workflows/      # CI
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/ManjeetShaw/Sahyogi.git
cd Sahyogi
```

### Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/civicai
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-sonnet-4-6
CLIENT_ORIGIN=http://localhost:5173
```

```bash
npm run dev
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The client proxies `/api` requests to the server in development (see `vite.config.js`).

### Or run everything with Docker

```bash
docker-compose up --build
```

### Seed sample government services

```bash
npm run seed --prefix backend
```

---

## 🔒 Security

- JWT authentication, hashed passwords (bcrypt)
- Rate limiting on the API
- Environment-variable-based secrets (never committed)
- AI API key kept server-side only

---

## 📈 Roadmap

What's built vs. what's planned for the full long-term vision:

- [x] Project setup, backend foundation, database models
- [x] JWT authentication
- [x] Issue/complaint reporting & tracking
- [x] Government services directory
- [x] AI companion chat (Claude)
- [ ] AI-powered scheme eligibility recommendation engine
- [ ] Document checklist assistant (photo specs, fees, rejection reasons)
- [ ] Image upload + AI image analysis for issue reports
- [ ] Map-based location picker & "nearby offices" lookup
- [ ] Multilingual support (Hindi, Bengali, Tamil, Telugu, Marathi, and more)
- [ ] Voice assistant (speech-to-text / text-to-speech)
- [ ] User dashboard (chat history, saved items, notifications)
- [ ] Government notice simplifier
- [ ] Production deployment & performance optimization

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

---

## 💡 Vision

Bridge the gap between citizens and government services by using AI to make public services more accessible, transparent, and easy to navigate — starting simple and working toward the fuller vision above.

Made with ❤️ for Digital India 🇮🇳
