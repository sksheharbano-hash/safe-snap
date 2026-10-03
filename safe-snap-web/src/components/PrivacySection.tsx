import React from 'react'
import { HardDrive, Lock, ShieldCheck, ArrowDown, Cpu, ServerOff } from 'lucide-react'

export const PrivacySection: React.FC = () => {
  const pipelineFlow = [
    { title: 'YOUR IMAGE', detail: 'Local file buffer in memory', icon: HardDrive },
    { title: 'LOCAL PROCESSING', detail: 'Runs on local CPU/hardware', icon: Cpu },
    { title: 'FACE DETECTION', detail: 'YOLOv8-face isolates bounds', icon: ShieldCheck },
    { title: 'OWNER RECOGNITION', detail: 'ArcFace cosine distance evaluation', icon: Lock },
    { title: 'ANONYMIZATION', detail: 'Irreversible pixel obfuscation', icon: ShieldCheck },
    { title: 'PROTECTED IMAGE', detail: 'Ready for private export', icon: HardDrive },
  ]

  return (
    <section
      id="privacy"
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
            <span>LOCAL-FIRST ARCHITECTURE</span>
          </div>
          <h2 className="section-title">
            Privacy should happen before sharing.
          </h2>
          <p className="section-subtitle">
            SafeSnap is designed around local processing. Detection, recognition, and
            anonymization are intended to happen on the user's local machine rather
            than sending personal images to a remote AI service.
          </p>
        </div>

        {/* Local Processing Visual Stage */}
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            padding: '3rem 2rem',
            boxShadow: '0 15px 35px -5px rgba(15, 23, 42, 0.05)',
            position: 'relative',
          }}
        >
          {/* Hardware Boundary Header Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.5rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cpu size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  On-Device Execution Boundary
                </strong>
                <span style={{ display: 'block', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  Zero outbound socket transfers during image inference
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#065f46',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <ServerOff size={14} />
              NO CLOUD API DEPENDENCY
            </div>
          </div>

          {/* Sequential Pipeline Visual Flow */}
          <div className="privacy-pipeline-grid">
            {pipelineFlow.map((node, i) => {
              const NodeIcon = node.icon
              return (
                <React.Fragment key={node.title}>
                  <div className="privacy-pipeline-node">
                    <div className="node-icon-wrapper">
                      <NodeIcon size={18} />
                    </div>
                    <span className="node-title">{node.title}</span>
                    <span className="node-detail">{node.detail}</span>
                  </div>

                  {i < pipelineFlow.length - 1 && (
                    <div className="pipeline-flow-arrow" aria-hidden="true">
                      <ArrowDown size={16} />
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Privacy Guarantee Note */}
          <div
            style={{
              marginTop: '2.5rem',
              padding: '1.25rem 1.5rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <Lock
              size={20}
              style={{ color: 'var(--accent-primary)', marginTop: '2px', flexShrink: 0 }}
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              <strong>Privacy Notice:</strong> SafeSnap is architected so that raw photos,
              detected facial crops, and reference biometric vectors remain strictly in local
              system memory. When you download the result, only the sanitized image is saved.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .privacy-pipeline-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          max-width: 480px;
          margin: 0 auto;
        }

        .privacy-pipeline-node {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.9rem 1.25rem;
          border-radius: 12px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-fast);
        }

        .privacy-pipeline-node:hover {
          border-color: var(--accent-soft-border);
          transform: translateY(-1px);
        }

        .node-icon-wrapper {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background-color: #ffffff;
          border: 1px solid var(--border-medium);
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .node-title {
          font-family: var(--font-mono);
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.03em;
        }

        .node-detail {
          margin-left: auto;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: right;
        }

        .pipeline-flow-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
          opacity: 0.65;
          margin: 0.15rem 0;
        }

        @media (max-width: 640px) {
          .privacy-pipeline-node {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
          }
          .node-detail {
            margin-left: 0;
            text-align: left;
          }
        }
      `}</style>
    </section>
  )
}

export default PrivacySection
