# Naruto Workout App 🥷🏽🏋️‍♂️

[![Live Demo](https://img.shields.io/badge/Live%20Demo-naruto--workout--app.vercel.app-orange?style=for-the-badge&logo=vercel)](https://naruto-workout-app.vercel.app/)

A gamified, anime-inspired fitness and nutrition tracker that motivates users to train like a ninja! This full-stack web app combines workout streaks, avatar progression, and AI-powered food analysis to help users level up both their fitness and nutrition—Naruto style.

---

## 🚀 Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (custom Naruto-inspired theme), PostCSS, CSS Modules
- **Backend/Database:** Supabase (auth, data storage, real-time updates)
- **AI Integration:** OpenAI GPT-4o (food image macro analysis)
- **Other Libraries:** 
  - date-fns (date utilities)
  - react-calendar (calendar UI)
  - react-dropzone (image upload)
  - lucide-react (iconography)
  - clsx (conditional classNames)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🌟 Features

### 1. **Ninja Workout Tracker**
- **Daily Training:** Log workouts and track completion streaks.
- **Streak Counter:** Visualizes your "Ninja Way" streak to encourage consistency.
- **Calendar View:** See your workout history at a glance.
- **Avatar Progression:** Unlock new ninja ranks (Academy Student → Hokage) as you level up.
- **Gamification:** Earn experience points (XP) for each workout, level up, and change your avatar.

### 2. **AI-Powered Macro Analyzer**
- **Food Image Upload:** Drag-and-drop or select a food image.
- **OpenAI Integration:** Uses GPT-4o to analyze the image and return a detailed macro breakdown (calories, protein, carbs, fats) and food description.
- **Recent Entries:** View, edit, or delete your recent food analyses.
- **Nutrition Logging:** All macro entries are stored per user for easy tracking.

### 3. **Authentication & Security**
- **Supabase Auth:** Email/password sign up, sign in, and password reset.
- **Session Management:** Persistent login and secure session handling.

### 4. **Admin/Secret Features**
- **Secret Scroll:** Hidden admin panel (password-protected) for marking workouts or adjusting XP—"Hokage Only" access.

### 5. **Modern UI/UX**
- **Naruto-Themed Design:** Custom color palette, glassmorphism, and playful animations.
- **Responsive:** Mobile-first, works great on all devices.

---

## 🏗️ Project Structure

```
src/
  components/         # UI components (Avatar, Calendar, MacroAnalyzer, etc.)
  data/               # Static data (avatars)
  hooks/              # Custom React hooks (auth, progress)
  lib/                # API clients (OpenAI, Supabase)
  pages/              # Main app pages (Workout, Macro)
  styles/             # Custom CSS (animations, glassmorphism, patterns)
  types/              # TypeScript types
```

## 🧩 Notable Code/Architecture Highlights

- **TypeScript-first:** Strong typing across all components, hooks, and API clients.
- **Custom Hooks:** `useAuth` for authentication/session, `useProgress` for workout/level logic.
- **Supabase Integration:** Real-time, scalable backend for user data and authentication.
- **OpenAI API:** Advanced prompt engineering for accurate food macro analysis.
- **Gamification:** Avatar system and XP logic for user engagement.
- **Naruto Branding:** Custom Tailwind theme, emoji avatars, and playful copy throughout.
- **Deployed on Vercel:** [https://naruto-workout-app.vercel.app/](https://naruto-workout-app.vercel.app/)
---

## 📝 License

MIT 
