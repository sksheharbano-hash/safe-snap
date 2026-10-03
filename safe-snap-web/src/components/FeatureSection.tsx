import React from 'react'
import { UserCheck, Cpu, Wand2, SlidersHorizontal } from 'lucide-react'

export const FeatureSection: React.FC = () => {
  const features = [
    {
      title: 'OWNER-AWARE',
      desc: 'Preserve the authorized face.',
      detail:
        'Uses ArcFace deep biometric embeddings to verify owner identity while treating non-enrolled individuals as protected bystanders.',
      icon: UserCheck,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'LOCAL-FIRST',
      desc: 'Designed for local processing.',
      detail:
        'All computer vision models execute strictly within your local machine environment without transmitting photos to third-party cloud servers.',
      icon: Cpu,
      color: '#4f46e5',
      bg: 'rgba(79, 70, 229, 0.1)',
    },
    {
      title: 'AUTOMATIC',
      desc: 'Reduce manual face editing.',
      detail:
        'End-to-end automated detection, recognition, and redaction pipeline eliminates tedious manual brushwork in editing software.',
      icon: Wand2,
      color: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.1)',
    },
    {
      title: 'FLEXIBLE PROTECTION',
      desc: 'Blur, pixelate, or mask detected non-owner faces.',
      detail:
        'Customize privacy output styles with adjustable Gaussian blur strengths, mosaic pixel block sizes, or clean silhouette privacy masks.',
      icon: SlidersHorizontal,
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.1)',
    },
  ]

  return (
    <section
      id="features"
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
            <span>CORE CAPABILITIES</span>
          </div>
          <h2 className="section-title">Designed for privacy, built for simplicity.</h2>
          <p className="section-subtitle">
            Four pillars that make SafeSnap an intelligent, owner-aware privacy shield
            for modern image sharing.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="card-premium"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.75rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: feat.bg,
                    color: feat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon size={22} strokeWidth={2.2} />
                </div>

                <h3
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: feat.color,
                    marginBottom: '0.4rem',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {feat.title}
                </h3>
                <div
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.3,
                  }}
                >
                  {feat.desc}
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                    marginTop: 'auto',
                  }}
                >
                  {feat.detail}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
