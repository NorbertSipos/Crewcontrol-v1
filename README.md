# Team Management Dashboard & App (CrewControl)

A modern B2B SaaS platform for workforce management with support for remote, on-site, and hybrid work configurations.

## Features

- ✅ User authentication (Sign up, Sign in, Password reset)
- ✅ Multi-tenant organization management
- ✅ Role-based access control (Manager, Employee, HR)
- ✅ Complete signup flow with organization setup
- ✅ Email confirmation and password reset
- ✅ Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 19, Vite, React Router
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project ([create one here](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Open `DATABASE_SETUP_INSTRUCTIONS.md` for detailed steps
   - Run `supabase_setup.sql` in your Supabase SQL Editor

5. **Configure Supabase**
   - Set up email templates (see `SUPABASE_EMAIL_SETUP.md`)
   - Configure redirect URLs (see `SUPABASE_REDIRECT_SETUP.md`)

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Project Structure

```
hr-dashboard/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts (Auth)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and configs
│   └── main.jsx         # App entry point
├── supabase_email_templates/  # Email templates
├── supabase_setup.sql   # Database setup script
└── DATABASE_SETUP_INSTRUCTIONS.md  # Setup guide
```

## Documentation

- **Database Setup**: See `DATABASE_SETUP_INSTRUCTIONS.md`
- **Database Schema**: See `DATABASE_SCHEMA.md`
- **Email Templates**: See `SUPABASE_EMAIL_SETUP.md`
- **Redirect Configuration**: See `SUPABASE_REDIRECT_SETUP.md`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

Private project
