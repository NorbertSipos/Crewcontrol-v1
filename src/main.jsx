import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'

// Import Global Layout Components
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx' 

// Import Page Components
import LandingPage from './App.jsx' 
import ChangelogPage from './components/Changelog.jsx'
import DocumentationPage from './components/Documentation.jsx'
import APIPage from './components/APIPage.jsx'
import PrivacyPage from './components/PrivacyPage.jsx'
import TermsPage from './components/TermsPage.jsx'
import SecurityPage from './components/SecurityPage.jsx'
import PricingPage from './components/PricingPage.jsx'
import Dashboard from './components/Dashboard.jsx'
import Schedule from './components/Schedule.jsx'
import Team from './components/Team.jsx'
import BuildYourTeam from './components/BuildYourTeam.jsx'
import Analytics from './components/Analytics.jsx'
import Settings from './components/Settings.jsx'
import SignIn from './components/SignIn.jsx'
import SignUp from './components/SignUp.jsx'
import CompleteSignup from './components/CompleteSignup.jsx'
import EmailConfirmationHandler from './components/EmailConfirmationHandler.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import ResetPassword from './components/ResetPassword.jsx'
import AcceptInvite from './components/AcceptInvite.jsx'
import ContactPage from './components/ContactPage.jsx'
import BlogPage from './components/BlogPage.jsx'
import IntegrationsPage from './components/IntegrationsPage.jsx'
import AboutPage from './components/AboutPage.jsx'

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

      <Routes>
        {/* --- 1. CSOPORT: MARKETING OLDALAK (Navbar + Footer látszik) --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
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