import React from 'react'
import { ArrowRight, PlayCircle, Lock, EyeOff, UserCheck } from 'lucide-react'
import AvatarPlaceholder from './AvatarPlaceholder'

interface HeroProps {
  onOpenApp: () => void
}

export const Hero: React.FC<HeroProps> = ({ onOpenApp }) => {
  const handleScrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.querySelector('#how-it-works')
    if (target) {
      const navOffset = 80
      const elementPosition = target.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '3.5rem',
        paddingBottom: '5rem',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      {/* Background Soft Glow & Grid */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-grid">
          {/* LEFT COLUMN: Copy & Actions */}
          <div className="hero-left-content">
            {/* Eyebrow */}
            <div className="eyebrow-badge">
              <span className="eyebrow-dot" />
              <span>PRIVATE BY DESIGN</span>
            </div>

            {/* Headline */}
            <h1 className="hero-headline">
              Share the moment.{' '}
              <span className="hero-accent-text">
                Protect everyone in it.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="hero-supporting-copy">
              SafeSnap recognizes your authorized face and automatically protects
              everyone else — helping you share memories without unnecessarily exposing
              other identities.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="hero-cta-group">
              <button
                onClick={onOpenApp}
                className="btn-primary hero-btn-primary"
                id="hero-primary-cta"
              >
                <span>Protect a Photo</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={handleScrollToHowItWorks}
                className="btn-secondary hero-btn-secondary"
                id="hero-secondary-cta"
              >
                <PlayCircle size={18} style={{ color: 'var(--accent-primary)' }} />
                <span>See How It Works</span>
              </button>
            </div>

            {/* Micro Feature Indicators */}
            <div className="hero-trust-indicators">
              <div className="hero-trust-item">
                <UserCheck size={16} className="hero-trust-icon text-emerald" />
                <span>Owner Preserved</span>
              </div>
              <div className="hero-trust-item">
                <EyeOff size={16} className="hero-trust-icon text-indigo" />
                <span>Selective Anonymization</span>
              </div>
              <div className="hero-trust-item">
                <Lock size={16} className="hero-trust-icon text-slate" />
                <span>On-Device Only</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Avatar Placeholder Stage (45-50% width) */}
          <div className="hero-right-stage">
            <AvatarPlaceholder showPlaceholderLabel={true} />
          </div>
        </div>
      </div>

      {/* Hero scoped styles */}
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 3.5rem;
        }

        .hero-headline {
          font-size: clamp(2.5rem, 4.8vw, 3.85rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.12;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .hero-accent-text {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline;
        }

        .hero-supporting-copy {
          font-size: clamp(1.05rem, 1.25vw, 1.2rem);
          line-height: 1.65;
          color: var(--text-secondary);
          margin-bottom: 2.25rem;
          max-width: 540px;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .hero-btn-primary {
          padding: 0.95rem 1.85rem;
          font-size: 1rem;
        }

        .hero-btn-secondary {
          padding: 0.95rem 1.65rem;
          font-size: 1rem;
        }

        .hero-trust-indicators {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          flex-wrap: wrap;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-subtle);
        }

        .hero-trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .text-emerald {
          color: #10b981;
        }
        .text-indigo {
          color: #4f46e5;
        }
        .text-slate {
          color: #64748b;
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }
          .hero-supporting-copy {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-cta-group {
            justify-content: center;
          }
          .hero-trust-indicators {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  )
}

export default Hero
