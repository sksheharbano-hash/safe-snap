import React from 'react'
import { UserCheck, EyeOff, ShieldCheck, Sparkles, Check, X } from 'lucide-react'

export const OwnerAwareSection: React.FC = () => {
  return (
    <section
      id="owner-aware"
      className="section-wrapper"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow-badge">
            <span className="eyebrow-dot" />
            <span>THE CORE DIFFERENTIATOR</span>
          </div>
          <h2 className="section-title">
            Not every face should be treated the same.
          </h2>
          <p className="section-subtitle">
            Unlike systems that simply blur every detected face, SafeSnap is designed
            to identify the authorized owner and selectively protect other people in the image.
          </p>
        </div>

        {/* Visual Architecture Concept */}
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          {/* Main Visual Comparison Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Card 1: OWNER -> PRESERVE */}
            <div
              className="card-premium"
              style={{
                borderColor: 'rgba(16, 185, 129, 0.4)',
                backgroundColor: '#ffffff',
                boxShadow: '0 12px 30px -5px rgba(16, 185, 129, 0.1)',
                padding: '2.25rem 2rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#065f46',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '9999px',
                  }}
                >
                  <UserCheck size={14} />
                  OWNER &rarr; PRESERVE
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Cosine sim &ge; 0.60
                </span>
              </div>

              {/* Visual Face Illustration */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  borderRadius: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  overflow: 'hidden',
                }}
              >
                {/* SVG Biometric Face Representation (Owner: Clear & Sharp) */}
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  {/* Clear Face Contour */}
                  <circle cx="50" cy="45" r="28" fill="#E2E8F0" stroke="#059669" strokeWidth="2.5" />
                  <circle cx="41" cy="42" r="3.5" fill="#0F172A" />
                  <circle cx="59" cy="42" r="3.5" fill="#0F172A" />
                  <path d="M43 54C46 57 54 57 57 54" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Subtle Owner Verification Ring */}
                  <circle cx="50" cy="45" r="38" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>

                {/* Floating Owner Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '9999px',
                    padding: '0.3rem 0.85rem',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#065f46',
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                  IDENTITY VERIFIED • UNCHANGED
                </div>
              </div>

              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                }}
              >
                Authorized Owner Preserved
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Your personal reference embeddings match the detected face coordinates.
                Your smile, expression, and context remain 100% natural and sharp.
              </p>
            </div>

            {/* Card 2: OTHER FACES -> PROTECT */}
            <div
              className="card-premium"
              style={{
                borderColor: 'rgba(99, 102, 241, 0.4)',
                backgroundColor: '#ffffff',
                boxShadow: '0 12px 30px -5px rgba(99, 102, 241, 0.1)',
                padding: '2.25rem 2rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-primary)',
                    backgroundColor: 'var(--accent-soft)',
                    border: '1px solid var(--accent-soft-border)',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '9999px',
                  }}
                >
                  <EyeOff size={14} />
                  OTHERS &rarr; PROTECT
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Non-matching &lt; 0.60
                </span>
              </div>

              {/* Visual Face Illustration */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  borderRadius: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid rgba(99, 102, 241, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  overflow: 'hidden',
                }}
              >
                {/* SVG Biometric Face Representation (Bystander: Anonymized / Pixelated / Blurred) */}
                <div
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                    filter: 'blur(7px)',
                    opacity: 0.85,
                  }}
                />

                {/* Privacy Shield Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={36} style={{ color: 'var(--accent-primary)' }} />
                </div>

                {/* Floating Shield Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--accent-soft-border)',
                    borderRadius: '9999px',
                    padding: '0.3rem 0.85rem',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                  }}
                >
                  <ShieldCheck size={14} />
                  ANONYMIZED • PRIVACY PROTECTED
                </div>
              </div>

              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                }}
              >
                Bystanders Automatically Anonymized
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Every detected face that does not match the enrolled owner profile is
                anonymized with an irreversible mathematical filter before leaving your device.
              </p>
            </div>
          </div>

          {/* Differentiating Feature Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '1.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Selective vs Blanket Blurring
                </strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Traditional tools force you to choose between ruining the photo or risking bystander exposure.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#ef4444', display: 'flex' }}><X size={16} strokeWidth={2.5} /></span>
                <span style={{ color: 'var(--text-muted)' }}>Blanket Blurs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <span style={{ color: '#10b981', display: 'flex' }}><Check size={16} strokeWidth={2.5} /></span>
                <span style={{ color: 'var(--text-primary)' }}>SafeSnap Owner-Aware</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OwnerAwareSection
