<div align="center">
  <h1>📅 Rotina+</h1>
  <p><strong>Organize sua vida em um só lugar</strong></p>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

  <p>
    <a href="#-about">About</a> •
    <a href="#-features">Features</a> •
    <a href="#️-tech-stack">Stack</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>
</div>

---

## 📌 About

**Rotina+** is a cross-platform mobile application (Android & iOS) that centralizes your entire personal routine — schedule, studies, finances, hydration, nutrition, and habits — in a single, intuitive platform.

Instead of juggling 4–5 different apps, Rotina+ gives you a **smart dashboard** with a complete picture of your day and automated suggestions to keep you on track.

> Built as a full-stack portfolio project demonstrating a production-grade mobile architecture with React Native, Node.js/Express, and Supabase.

---

## ✨ Features

### 📅 Agenda
- Create, edit and delete events
- Daily, weekly and monthly calendar view
- Set reminders and notifications

### 📚 Studies
- Log study sessions by subject
- Set weekly hour goals
- Track progress with charts

### 💰 Finances
- Record income and expenses with custom categories
- Monthly balance summary
- Consumption charts

### 💧 Hydration
- Personalized daily water goal (based on body weight)
- Log water intake cup by cup
- Automated reminders when intake is low

### 🥗 Nutrition
- Log meals (breakfast, lunch, dinner, snacks)
- Organize by scheduled times
- Focus on healthy habits

### ✅ Habits
- Daily habit tracking with streak counter
- Set daily goals and target days
- Full routine overview

### 🧠 Smart Dashboard
- Today's events at a glance
- Hydration progress bar
- Daily financial summary (income vs. expenses)
- Study goal tracking
- Habit completion rate
- Automatic alerts when budget is exceeded or hydration is low

---

## 🛠️ Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Mobile       | React Native + Expo SDK 51 (TypeScript) |
| Backend      | Node.js 20 + Express (TypeScript)       |
| Database     | Supabase — PostgreSQL                   |
| Auth         | Supabase Auth (JWT)                     |
| Navigation   | React Navigation v6                     |
| Charts       | Victory Native                          |
| Notifications| Expo Notifications                      |
| Storage      | Expo SecureStore                        |
| HTTP Client  | Axios                                   |

---

## 🏗️ Architecture

```
rotina-plus/
├── mobile/                  # React Native + Expo (iOS & Android)
│   ├── src/
│   │   ├── screens/         # All screens grouped by module
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── agenda/
│   │   │   ├── studies/
│   │   │   ├── finances/
│   │   │   ├── hydration/
│   │   │   ├── nutrition/
│   │   │   ├── habits/
│   │   │   └── profile/
│   │   ├── components/      # Reusable UI components
│   │   ├── navigation/      # Stack & Tab navigators
│   │   ├── services/        # API consumption layer (axios)
│   │   ├── contexts/        # React Context (Auth)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript interfaces & types
│   │   ├── constants/       # Theme, colors, strings
│   │   └── utils/           # Date, hydration helpers
│   └── App.tsx
│
├── backend/                 # Node.js + Express REST API
│   └── src/
│       ├── routes/          # Route definitions (per module)
│       ├── controllers/     # Request/response handlers
│       ├── services/        # Business logic + Supabase queries
│       ├── middlewares/     # Auth JWT verification
│       └── config/          # Supabase client setup
│
└── docs/
    ├── schema.sql           # Full Supabase/PostgreSQL schema
    └── architecture.md      # System architecture notes
```

**API Endpoints overview:**

| Method | Route                        | Description              |
|--------|------------------------------|--------------------------|
| POST   | `/api/v1/auth/register`      | Create account           |
| POST   | `/api/v1/auth/login`         | Sign in                  |
| GET    | `/api/v1/agenda`             | List events              |
| POST   | `/api/v1/agenda`             | Create event             |
| GET    | `/api/v1/finances/transactions` | List transactions     |
| GET    | `/api/v1/finances/summary`   | Monthly summary          |
| GET    | `/api/v1/hydration/today`    | Today's hydration data   |
| POST   | `/api/v1/hydration/logs`     | Log water intake         |
| GET    | `/api/v1/dashboard`          | Full dashboard summary   |
| ...    | (full CRUD for all modules)  |                          |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI — `npm install -g expo-cli`
- Supabase account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rotina-plus.git
cd rotina-plus
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. In the SQL editor, run the full script from [`docs/schema.sql`](./docs/schema.sql)
3. Copy your **Project URL** and **Service Role Key** from Settings → API

### 3. Run the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your SUPABASE_URL and SUPABASE_SERVICE_KEY
npm run dev
```

### 4. Run the Mobile App

```bash
cd mobile
npm install
cp .env.example .env
# Edit .env: EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3333/api/v1
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone, or press `a`/`i` for Android/iOS emulator.

---

## 📍 Roadmap

### v1.0 — MVP
- [x] Project scaffold (backend + mobile)
- [ ] Authentication (login / register)
- [ ] Agenda module
- [ ] Hydration module
- [ ] Finances module
- [ ] Smart Dashboard

### v2.0
- [ ] Studies module
- [ ] Nutrition module
- [ ] Habits module
- [ ] Charts and reports (Victory Native)

### v3.0
- [ ] Push notifications (Expo Notifications)
- [ ] Intelligent alerts (budget exceeded, low hydration)
- [ ] Weekly performance report
- [ ] Dark mode support

---

## 👤 Author

Made with ❤️ by **[Your Name]**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)

---

<div align="center">
  <sub>⭐ If this project was helpful, consider giving it a star!</sub>
</div>
