# Sahyogi 🇮🇳

> **Your Intelligent Government Companion**

Sahyogi (working codename **SarkarSaathi AI**) is a citizen platform that simplifies access to government services — letting people report civic issues, browse government services, and get help from an AI companion, all in one place.

> Built with accessibility, transparency, and digital inclusion in mind.

---

## ✅ Currently Implemented

This is the real, working state of the codebase today (not the full long-term vision below):

- **AI Companion Chat** — citizens can ask natural-language questions and get answers grounded in the platform's own services data, powered by the Google Gemini API. Supports optional voice input (speech-to-text) and read-aloud replies (text-to-speech) in supporting browsers.
- **AI Scheme/Service Finder** — describe your situation in plain language and get matching services from the platform's own catalog, with a short reason for each match.
- **AI Notice Simplifier** — paste an official notice and get a plain-language summary of what it means and what action, if any, is required.
- **Issue Reporting** — citizens can submit civic issues (potholes, garbage, water supply, etc.) with category, description, and location; status tracked (submitted → in review → in progress → resolved)
- **Government Services Directory** — searchable list of services/schemes with descriptions, eligibility rules, required documents, fees, and common rejection reasons; citizens can bookmark services to their dashboard
- **User Dashboard** — a citizen's own reported issues, saved services, and recent AI companion conversations in one place
- **Authentication** — JWT-based register/login, protected routes on the client
- **REST API** — Express + MongoDB (Mongoose) backend with proper error handling, rate limiting on AI routes, and CORS

## 🛠 Tech Stack (Actual)

**Frontend:** React (Vite), React Router, Axios, plain CSS
**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT auth, bcrypt, express-rate-limit, morgan
**AI:** Google Gemini API (`@google/genai`), server-side only — the API key never touches the client

---

## 📂 Project Structure (Actual)