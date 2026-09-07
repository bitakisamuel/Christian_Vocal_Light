# Light Vocal Academy

A Christian vocal ministry training app built by Samuel Bitaki. Helps vocal ministers prepare holistically across three areas:

- **Physical** — vocal exercises, breathing, posture, and hydration
- **Spiritual** — daily devotionals, prayer, scripture reading, and reflection
- **Career** — practical guidance for building a gospel music career

Built with Expo (React Native), Expo Router, and Supabase.

## Getting Started

### Prerequisites

- Node.js 18+
- An Expo account (or use the local CLI)
- A Supabase project

### Installation

```bash
npm install
```

### Environment Setup

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your Supabase project URL and anon key:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Database Setup

Run the migration in `supabase/migrations/20260701121126_vocal_prep_schema.sql` against your Supabase project. This creates the four tables (`user_progress`, `daily_devotionals`, `exercises`, `career_tips`) with row-level security enabled and seeds them with starter content.

### Running the App

```bash
npm run dev
```

This starts the Expo dev server. Open it in a browser or in the Expo Go app on your phone.

### Building for Web

```bash
npm run build:web
```

This exports a static web bundle into the `dist/` directory.

## Project Structure

```
app/
├── _layout.tsx          # Root layout (fonts, splash screen)
├── +not-found.tsx       # 404 screen
└── (tabs)/
    ├── _layout.tsx      # Tab bar configuration
    ├── index.tsx        # Home screen
    ├── physical.tsx     # Physical preparation tab
    ├── spiritual.tsx    # Spiritual preparation tab
    └── career.tsx       # Career growth tab
components/              # Reusable components
hooks/
└── useFrameworkReady.ts # Framework initialization hook
lib/
└── supabase.ts          # Supabase client and type definitions
supabase/
└── migrations/          # Database schema migration
assets/
└── images/              # App icon and favicon
```

## Features

- Four-tab navigation (Home, Physical, Spiritual, Career)
- Exercise library with step-by-step instructions and benefits
- Daily devotionals with scripture, message, and prayer points
- Career guidance with scripture references and actionable steps
- Progress tracking stored in Supabase
- Beautiful gradient headers and card-based UI
- Inter font family throughout

## Tech Stack

- **Expo** SDK 54 — cross-platform framework
- **Expo Router** — file-based navigation
- **Supabase** — PostgreSQL database and realtime
- **lucide-react-native** — icon library
- **expo-linear-gradient** — gradient backgrounds
- **@expo-google-fonts/inter** — typography

## License

This project is proprietary. Created by Samuel Bitaki.
