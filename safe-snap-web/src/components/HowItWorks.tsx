import React from 'react'
import { UserPlus, ScanFace, Binary, ShieldCheck, ChevronRight } from 'lucide-react'

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'ENROLL',
      sub: 'Add reference images',
      desc: 'Add a reference image of the authorized owner to generate biometric embeddings on-device.',
      icon: UserPlus,
      tag: 'Owner Baseline',
      color: '#4f46e5',
      accentBg: 'rgba(79, 70, 229, 0.08)',
    },
    {
      num: '02',
      title: 'DETECT',
      sub: 'Locate every face',
      desc: 'Detect the faces present in your photo using a fast, high-precision YOLO face detector.',
      icon: ScanFace,
      tag: 'Multi-Face Localization',
      color: '#0284c7',
      accentBg: 'rgba(2, 132, 199, 0.08)',
    },
    {
      num: '03',
      title: 'RECOGNIZE',
      sub: 'Compute cosine similarity',
      desc: 'Compare each detected face with the enrolled owner representation using ArcFace feature embeddings.',
      icon: Binary,
      tag: 'Identity Disambiguation',
      color: '#7c3aed',
      accentBg: 'rgba(124, 58, 237, 0.08)',
    },
    {
      num: '04',
      title: 'PROTECT',
      sub: 'Selective anonymization',
      desc: 'Keep the owner visible while anonymizing non-owner faces with blur, pixelation, or masking.',
      icon: ShieldCheck,
      tag: 'Privacy Preserved',
      color: '#10b981',
      accentBg: 'rgba(16, 185, 129, 0.08)',
    },
  ]

  return (
    <section
      id="how-it-works"
      className="section-wrapper"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow-badge">
            <span className="eyebrow-dot" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="section-title">
            Privacy protection in four steps.
          </h2>
          <p className="section-subtitle">
            An automated, local-first pipeline that takes a multi-person portrait and
            intelligently protects bystander privacy.
          </p>
        </div>

        {/* 4 Connected Cards Flow */}
        <div className="steps-grid">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={step.num} className="step-card-container">
                <div className="card-premium step-card">
                  {/* Step Number & Badge */}
                  <div className="step-card-header">
                    <span
                      className="step-badge"
                      style={{
                        backgroundColor: step.accentBg,
                        color: step.color,
                        borderColor: step.color,
                      }}
                    >
                      STEP {step.num}
                    </span>
                    <span className="step-tag-pill">{step.tag}</span>
                  </div>

                  {/* Icon Box */}
                  <div
                    className="step-icon-box"
                    style={{
                      backgroundColor: step.accentBg,
                      color: step.color,
                    }}
                  >
                    <Icon size={24} strokeWidth={2.2} />
                  </div>

                  {/* Titles & Copy */}
                  <h3 className="step-title">{step.title}</h3>
                  <div className="step-sub">{step.sub}</div>
                  <p className="step-desc">{step.desc}</p>
                </div>

                {/* Arrow connector between cards (on desktop) */}
                {idx < steps.length - 1 && (
                  <div className="step-connector-arrow" aria-hidden="true">
                    <ChevronRight size={22} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          position: relative;
        }

        .step-card-container {
          position: relative;
          display: flex;
          align-items: stretch;
        }

        .step-card {
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.75rem 1.5rem;
        }

        .step-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .step-badge {
          font-family: var(--font-mono);
          font-size: 0.725rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          border: 1px solid;
          letter-spacing: 0.05em;
        }

        .step-tag-pill {
          font-size: 0.675rem;
          color: var(--text-muted);
          background-color: var(--bg-tertiary);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          font-weight: 500;
        }

        .step-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .step-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          letter-spacing: -0.01em;
        }

        .step-sub {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-primary);
          margin-bottom: 0.85rem;
        }

        .step-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-top: auto;
        }

        .step-connector-arrow {
          position: absolute;
          right: -17px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 1024px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
          .step-connector-arrow {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}

export default HowItWorks
