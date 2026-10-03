import React from 'react'
import { ArrowRight, ShieldCheck, Lock } from 'lucide-react'

interface FinalCTAProps {
  onOpenApp: () => void
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenApp }) => {
  return (
    <section
      className="section-wrapper"
      style={{
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
            borderRadius: '28px',
            padding: '4rem 2.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(30, 27, 75, 0.25)',
          }}
        >
          {/* Subtle background glow circle */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#e0e7ff',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                marginBottom: '1.5rem',
              }}
            >
              <ShieldCheck size={14} style={{ color: '#38bdf8' }} />
              <span>ON-DEVICE PRIVACY SHIELD</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
                lineHeight: 1.15,
              }}
            >
              Ready to share the moment?
            </h2>

            <p
              style={{
                fontSize: '1.1rem',
                color: '#cbd5e1',
                maxWidth: '520px',
                margin: '0 auto 2.25rem',
                lineHeight: 1.6,
              }}
            >
              Protect the people in your photos before you share them.
            </p>

            <button
              onClick={onOpenApp}
              className="btn-primary"
              style={{
                fontSize: '1.05rem',
                padding: '1rem 2.25rem',
                backgroundColor: '#ffffff',
                color: '#1e1b4b !important',
                background: '#ffffff',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              }}
              id="final-cta-btn"
            >
              <span style={{ color: '#1e1b4b', fontWeight: 700 }}>Protect a Photo</span>
              <ArrowRight size={18} style={{ color: '#1e1b4b' }} />
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                marginTop: '2rem',
                fontSize: '0.8rem',
                color: '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={13} />
                <span>Zero Cloud Uploads</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={13} />
                <span>Owner Preserved Automatically</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
