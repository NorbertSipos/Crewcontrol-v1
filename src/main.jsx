import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import components
import LandingPage from './App.jsx' 
import ChangelogPage from './components/Changelog.jsx'
import DocumentationPage from './components/Documentation.jsx'
import APIPage from './components/APIPage.jsx'
import PrivacyPage from './components/PrivacyPage.jsx'
import TermsPage from './components/TermsPage.jsx'
import SecurityPage from './components/SecurityPage.jsx'
import PricingPage from './components/PricingPage.jsx'

// We define our main navigation here
function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/api" element={<APIPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)