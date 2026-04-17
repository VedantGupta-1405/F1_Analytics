# F1 Analytics Platform 🏎️🏁

A high-performance, dynamic Formula 1 data analytics platform designed to visualize multi-season telemetry, driver performance, and team standings through a highly interactive, retro-modern pixel art interface.

> **Note:** The entire implementation of the Frontend architecture, UI/UX, and design system was developed using AI only.

---

## ✨ Features

- **Multi-Season Telemetry (2021–2025):** Seamlessly switch between seasons to instantly load complete championship data, bypassing slow telemetry extraction by utilizing lightning-fast JSON endpoints.
- **Dynamic Dashboard:** Computes complex metrics on the fly, including "Form Leader" (points scored over the last 3 races), most improved drivers, and a visual Championship Timeline mapping all rounds.
- **Driver Profile & Form Insights:** Deep dive into individual driver histories with finish trend charts, position variance graphs, and AI-driven insights determining if a driver is surging in momentum or declining in form.
- **Constructor Power Matrix:** Dedicated team performance tracking with bar-chart distribution of constructor points.
- **Circuit Database:** A comprehensive static encyclopedia of iconic F1 tracks detailing layout lengths, overtaking difficulty, historical data, and lap records.
- **Paddock Intel:** Live RSS integration pulling the latest Formula 1 news headlines directly into the platform.
- **Retro-Modern Pixel UI:** A highly curated aesthetic utilizing `Press Start 2P` typography, rigid geometric layouts, scanline overlays, and custom 8-bit loading animations to create a premium, immersive F1 experience.

---

## 🏗️ Architecture & Tech Stack

### Frontend (React / Vite)
- **Framework:** React + Vite for lightning-fast HMR and optimized builds.
- **Styling:** Vanilla CSS + Tailwind CSS (configured for rigid borders, zero border-radius, and deep blacks to match the pixel aesthetic).
- **State Management:** React Context API (`SeasonContext`) for global synchronization of the massive season data payload.
- **Visualizations:** `Recharts` customized to remove curves and enforce blocky, retro step-charts.

### Backend (FastAPI / Python)
- **Framework:** FastAPI for high-speed, asynchronous API routing.
- **Data Ingestion:** 
  - Originally configured with `FastF1`, upgraded to use the ultra-fast **Jolpi API** (the modern Ergast community mirror) to fetch complete race classification matrices in under 2 seconds.
- **Caching:** Memory and local JSON caching mechanisms (`season_{year}_cache.json`) to prevent redundant external API calls and ensure instant frontend resolution.
- **Data Processing:** `Pandas` for structural data manipulation and extraction.
  
---

## 📂 Project Structure

```
F1_Analytics/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (Navbar, PixelLoader)
│   │   ├── pages/           # Core Views (Dashboard, DriverProfile, Tracks, News)
│   │   ├── App.jsx          # Router & Global SeasonContext Provider
│   │   └── index.css        # Core Pixel-Art Design System & Animations
│   └── package.json
└── ml-service/
    ├── app/
    │   ├── main.py          # FastAPI application entry
    │   └── api_data.py      # Core data routers (Jolpi API, RSS News fetcher)
    └── requirements.txt
```
