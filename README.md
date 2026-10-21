# Campus PC Watch 🖥️⚡

[![Vite](https://img.shields.io/badge/Vite-5.3+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, real-time campus network and computer lab workstation monitoring web application. Built for academic institutions and IT administrators to track PC presence, lab availability, network latency, and workstation health across campus facilities.

---

## ✨ Features

- **🛡️ Role-Based Access Control**:
  - **Admin View**: Full infrastructure visibility, live device monitoring, lab overview, alert management, and historical logs.
  - **Student / User View**: Workstation presence registration, active lab station linking, personal device status, and latency testing.
- **⚡ Real-Time Device Heartbeat & Ping**:
  - Live pulse detection every 20 seconds.
  - Immediate latency ping diagnostics directly from the browser.
- **📊 Interactive Admin Dashboard**:
  - Filter by `All`, `Online`, and `Offline` workstations with live count pills.
  - Network health scoring and lab capacity percentage gauges.
- **🏢 Multi-Lab Overview**:
  - Per-lab workstation tracking (Computer Lab 1, Lab 2, Lab 3, Server Room).
  - Live progress bars indicating active machines per room.
- **🔔 Smart Alerts & Activity Timeline**:
  - Severity-graded notifications (`HIGH`, `WARNING`, `INFO`).
  - Event history with duration calculations and status timelines.
- **📈 Analytics & Reports**:
  - Interactive charts powered by Recharts (Lab-wise availability %, weekly online counts).
- **🌓 Dark & Light Modes**:
  - Curated HSL color palette with smooth transitions, custom tokens, and glassmorphism.

---

## 🛠️ Tech Stack

- **Core**: React 18, JavaScript (ES2020+)
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Backend / Authentication**: Firebase Authentication & Cloud Firestore
- **Styling**: Vanilla CSS Design Tokens (Dark / Light theme, CSS variables)
- **Visuals & Charts**: Recharts & Lucide React
- **Hosting / Deploy**: Vercel ready (`vercel.json` included)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Suraj3232/campus-pc-watch.git
cd campus-pc-watch
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Firebase credentials:
```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project_id.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
VITE_ADMIN_EMAILS="admin@campus.edu,superadmin@campus.edu"
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
campus-pc-watch/
├── public/                  # Static assets & favicon
├── src/
│   ├── auth/                # AuthContext, ThemeContext, useAuth
│   ├── components/
│   │   ├── devices/         # ConnectDeviceModal, DeviceConnectionBanner
│   │   ├── layout/          # AppShell, Topbar, Sidebar, PageHeader, Breadcrumbs
│   │   └── ui/              # StatCard, StatusBadge, Toast, Modal, SearchInput
│   ├── firebase/            # Firebase client config & auth helper functions
│   ├── hooks/               # useDevices, useLabs, useAlerts, useHistory, useMyDevice
│   ├── mock/                # Standalone demo data sets
│   ├── pages/
│   │   ├── admin/           # Admin Dashboard, Devices, Labs, Alerts, History, Reports, Settings
│   │   ├── public/          # Landing, Login, Register, Forgot Password
│   │   └── user/            # User Dashboard, Devices, Labs, Alerts, History, Profile
│   ├── routes/              # PublicRoute, ProtectedRoute, RoleRoute
│   ├── services/            # deviceService (heartbeat & Firestore), dataService
│   ├── styles/              # index.css, components.css, animations.css
│   └── utils/               # formatters, statusUtils, validators
├── firestore.rules          # Security rules for Firestore collections
├── vercel.json              # SPA rewrite configuration for Vercel
└── vite.config.js           # Vite build configuration
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
