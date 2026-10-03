import React from 'react'
import { Camera, Upload, AlertTriangle, CheckCircle2, ScanFace, UserCheck, ShieldCheck, Share2 } from 'lucide-react'

export const ProblemSection: React.FC = () => {
  return (
    <section
      id="problem"
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
            <span>THE PRIVACY DILEMMA</span>
          </div>
          <h2 className="section-title">
            Every shared photo can expose more than you intended.
          </h2>
          <p className="section-subtitle">
            Group photos often contain people who never intended to appear publicly.
            Manually hiding faces is slow and easy to forget.
          </p>
        </div>

        {/* Visual Comparison Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            maxWidth: '1060px',
            margin: '0 auto',
          }}
        >
          {/* CARD 1: WITHOUT SAFESNAP */}
          <div
            className="card-premium"
            style={{
              borderColor: 'rgba(239, 68, 68, 0.25)',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 20px -2px rgba(239, 68, 68, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(239, 68, 68, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: '#991b1b',
                  }}
                >
                  WITHOUT SAFESNAP
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  color: '#dc2626',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                }}
              >
                Privacy Risk
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Standard social sharing pushes unedited group portraits directly to feeds and group chats.
            </p>

            {/* Stepper Pipeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="pipeline-step-item">
                <div className="pipeline-step-icon step-neutral">
                  <Camera size={16} />
                </div>
                <div className="pipeline-step-text">
                  <strong>Take photo</strong>
                  <span>Casual group or public capture</span>
                </div>
              </div>

              <div className="pipeline-step-connector step-connector-neutral" />

              <div className="pipeline-step-item">
                <div className="pipeline-step-icon step-neutral">
                  <Upload size={16} />
                </div>
                <div className="pipeline-step-text">
                  <strong>Upload &amp; publish</strong>
                  <span>Sent directly without inspection</span>
                </div>
              </div>

              <div className="pipeline-step-connector step-connector-danger" />

              <div className="pipeline-step-item">
                <div className="pipeline-step-icon step-danger">
                  <AlertTriangle size={16} />
                </div>
                <div className="pipeline-step-text">
                  <strong style={{ color: '#dc2626' }}>Other faces remain visible</strong>
                  <span>Bystanders &amp; acquaintances exposed publicly</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: WITH SAFESNAP */}
          <div
            className="card-premium"
            style={{
              borderColor: 'rgba(16, 185, 129, 0.35)',
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 30px -4px rgba(16, 185, 129, 0.09)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle2 size={18} />
                </div>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: '#065f46',
                  }}
                >
                  WITH SAFESNAP
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  color: '#059669',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                }}
              >
                Owner-Aware Protection
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Automated computer vision distinguishes your identity from bystanders before anything is shared.
            </p>

            {/* Stepper Pipeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="pipeline-step-item">
                <div className="pipeline-step-icon step-accent">
                  <Camera size={16} />
                </div>
                <div className="pipeline-step-text">
                  <strong>Take photo</strong>
                  <span>Photo loaded into SafeSnap on-device</span>
                </div>
              </div>

              <div className="pipeline-step-connector step-connector-accent" />

              <div className="pipeline-step-item">
                <div className="pipeline-step-icon step-accent">
                  <ScanFace size={16} />
                </div>
                <div className="pipeline-step-text">
                  <strong>Detect faces</strong>
                  <span>Local YOLO detects bounding coordinates</span>
                </div>
              </div>

              <div className="pipeline-step-connector step-connector-accent" />

              <div className="pipeline-step-item">
                <div className="pipeline-step-icon step-emerald">
                  <UserCheck size={16} />
                </div>
                <div className="pipeline-step-text">
                  <strong>Identify owner</strong>
                  <span>ArcFace matches enrolled embeddings</span>
                </div>
              </div>

              <div className="pipeline-step-connector step-connector-accent" />

              <div className="pipeline-step-item">
                <div className="pipeline-step-icon step-accent">
                  <ShieldCheck size={16} />
                </div>
                <div className="pipeline-step-text">
                  <strong>Protect others</strong>
                  <span>Selective blur, pixelation, or mask applied</span>
                </div>
              </div>

              <div className="pipeline-step-connector step-connector-emerald" />

              <div className="pipeline-step-item">
                <div className="pipeline-step-icon step-emerald">
                  <Share2 size={16} />
                </div>
                <div className="pipeline-step-text">
                  <strong style={{ color: '#059669' }}>Share safely</strong>
                  <span>Confidently publish with everyone protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .pipeline-step-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .pipeline-step-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-neutral {
          background-color: var(--bg-tertiary);
          color: var(--text-muted);
        }

        .step-danger {
          background-color: rgba(239, 68, 68, 0.15);
          color: #dc2626;
        }

        .step-accent {
          background-color: rgba(79, 70, 229, 0.1);
          color: var(--accent-primary);
        }

        .step-emerald {
          background-color: rgba(16, 185, 129, 0.12);
          color: var(--success);
        }

        .pipeline-step-text {
          display: flex;
          flex-direction: column;
        }

        .pipeline-step-text strong {
          font-size: 0.85rem;
          color: var(--text-primary);
          line-height: 1.25;
        }

        .pipeline-step-text span {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .pipeline-step-connector {
          width: 2px;
          height: 12px;
          margin-left: 15px;
        }

        .step-connector-neutral {
          background-color: var(--border-medium);
        }
        .step-connector-danger {
          background-color: rgba(239, 68, 68, 0.35);
        }
        .step-connector-accent {
          background-color: rgba(79, 70, 229, 0.3);
        }
        .step-connector-emerald {
          background-color: rgba(16, 185, 129, 0.35);
        }
      `}</style>
    </section>
  )
}

export default ProblemSection
