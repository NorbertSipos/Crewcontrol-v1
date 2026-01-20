import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'

// Import Global Layout Components (Keep these non-lazy for faster initial render)
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx' 

// Lazy load page components for code splitting and better performance
const LandingPage = lazy(() => import('./App.jsx'))
const ChangelogPage = lazy(() => import('./components/Changelog.jsx'))
const RoadmapPage = lazy(() => import('./components/Roadmap.jsx'))
const DocumentationPage = lazy(() => import('./components/Documentation.jsx'))
const APIPage = lazy(() => import('./components/APIPage.jsx'))
const PrivacyPage = lazy(() => import('./components/PrivacyPage.jsx'))
const TermsPage = lazy(() => import('./components/TermsPage.jsx'))
const SecurityPage = lazy(() => import('./components/SecurityPage.jsx'))
const PricingPage = lazy(() => import('./components/PricingPage.jsx'))
const Dashboard = lazy(() => import('./components/Dashboard.jsx'))
const Schedule = lazy(() => import('./components/Schedule.jsx'))
const Team = lazy(() => import('./components/Team.jsx'))
const BuildYourTeam = lazy(() => import('./components/BuildYourTeam.jsx'))
const Analytics = lazy(() => import('./components/Analytics.jsx'))
const Settings = lazy(() => import('./components/Settings.jsx'))
const SignIn = lazy(() => import('./components/SignIn.jsx'))
const SignUp = lazy(() => import('./components/SignUp.jsx'))
const CompleteSignup = lazy(() => import('./components/CompleteSignup.jsx'))
const EmailConfirmationHandler = lazy(() => import('./components/EmailConfirmationHandler.jsx'))
const ForgotPassword = lazy(() => import('./components/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./components/ResetPassword.jsx'))
const AcceptInvite = lazy(() => import('./components/AcceptInvite.jsx'))
const ContactPage = lazy(() => import('./components/ContactPage.jsx'))
const BlogPage = lazy(() => import('./components/BlogPage.jsx'))
const IntegrationsPage = lazy(() => import('./components/IntegrationsPage.jsx'))
const AboutPage = lazy(() => import('./components/AboutPage.jsx'))
const DeputyAlternative = lazy(() => import('./components/DeputyAlternative.jsx'))
const ConnecteamComparison = lazy(() => import('./components/ConnecteamComparison.jsx'))
const ExcelReplacement = lazy(() => import('./components/ExcelReplacement.jsx'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400">Loading...</p>
    </div>
  </div>
)

// --- MARKETING LAYOUT WRAPPER ---
// Ez a komponens felelős azért, hogy a Navbar és Footer csak a marketing oldalakon látszódjon
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-slate-950">
    <Navbar />
    <main className="grow">
      <Outlet /> {/* Ide töltődnek be az al-útvonalak (Landing, Pricing, stb.) */}
    </main>
    <Footer />
  </div>
);

function Main() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* --- 1. CSOPORT: MARKETING OLDALAK (Navbar + Footer látszik) --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/api" element={<APIPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/deputy-alternative" element={<DeputyAlternative />} />
            <Route path="/crewcontrol-vs-connecteam" element={<ConnecteamComparison />} />
            <Route path="/excel-replacement" element={<ExcelReplacement />} />
          </Route>

          {/* --- 2. CSOPORT: AUTH PAGES (Navbar + Footer NINCS) --- */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/complete-signup" element={<CompleteSignup />} />
          <Route path="/auth/callback" element={<EmailConfirmationHandler />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* --- 3. CSOPORT: DASHBOARD (Navbar + Footer NINCS) --- */}
          {/* Mivel ez kívül van a PublicLayout-on, teljesen üres lappal indul */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/team" element={<Team />} />
          <Route path="/build-team" element={<BuildYourTeam />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* --- 4. CSOPORT: INVITATION ACCEPTANCE --- */}
          <Route path="/accept-invite" element={<AcceptInvite />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// Temporarily disable StrictMode to prevent AbortError issues during signup
// StrictMode causes double-renders in development which abort Supabase requests
// TODO: Re-enable StrictMode once signup flow is stable
createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
        <Main />
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
)