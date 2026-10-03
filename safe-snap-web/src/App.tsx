import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ValueStrip from './components/ValueStrip'
import ProblemSection from './components/ProblemSection'
import HowItWorks from './components/HowItWorks'
import OwnerAwareSection from './components/OwnerAwareSection'
import ProductDemo from './components/ProductDemo'
import PrivacySection from './components/PrivacySection'
import TechnologySection from './components/TechnologySection'
import FeatureSection from './components/FeatureSection'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import LaunchModal from './components/LaunchModal'

function App() {
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false)

  const handleOpenApp = () => {
    setIsLaunchModalOpen(true)
  }

  const handleCloseApp = () => {
    setIsLaunchModalOpen(false)
  }

  return (
    <div className="safesnap-landing-page">
      {/* Sticky Navigation */}
      <Navbar onOpenApp={handleOpenApp} />

      {/* Main Page Flow */}
      <main>
        {/* 1. Hero with 3D Avatar Placeholder Stage */}
        <Hero onOpenApp={handleOpenApp} />

        {/* 2. Trust & Core Value Strip */}
        <ValueStrip />

        {/* 3. The Privacy Problem: Without vs With SafeSnap */}
        <ProblemSection />

        {/* 4. How It Works: 4 Connected Steps */}
        <HowItWorks />

        {/* 5. Owner-Aware Section: The Core Differentiator */}
        <OwnerAwareSection />

        {/* 6. Interactive Product Demonstration */}
        <ProductDemo />

        {/* 7. Local-First Privacy Architecture */}
        <PrivacySection />

        {/* 8. Computer Vision Technology Stack */}
        <TechnologySection />

        {/* 9. Key Capabilities & Features */}
        <FeatureSection />

        {/* 10. Final Call to Action */}
        <FinalCTA onOpenApp={handleOpenApp} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Launch SafeSnap Studio Helper Modal */}
      <LaunchModal
        isOpen={isLaunchModalOpen}
        onClose={handleCloseApp}
        appUrl="http://localhost:8501"
      />
    </div>
  )
}

export default App
