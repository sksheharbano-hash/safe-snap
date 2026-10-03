import React, { useState } from 'react'
import { Eye, Shield, Sliders, CheckCircle2, UserCheck, Sparkles } from 'lucide-react'

type AnonymizationMode = 'blur' | 'pixelate' | 'mask'
type RefImageId = 1 | 2 | 3

export const ProductDemo: React.FC = () => {
  const [mode, setMode] = useState<AnonymizationMode>('blur')
  const [activeRef, setActiveRef] = useState<RefImageId>(1)
  const [viewMode, setViewMode] = useState<'comparison' | 'protected' | 'original'>('comparison')

  const refDetails: Record<RefImageId, { label: string; score: string; angle: string }> = {
    1: { label: 'Frontal Reference', score: '0.88', angle: '0° Yaw' },
    2: { label: 'Semi-Profile Reference', score: '0.84', angle: '15° Yaw' },
    3: { label: 'High-Light Reference', score: '0.91', angle: 'Dynamic light' },
  }

  return (
    <section
      id="demo"
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
            <span>INTERACTIVE PREVIEW</span>
          </div>
          <h2 className="section-title">See SafeSnap in action.</h2>
          <p className="section-subtitle">
            Explore how SafeSnap selectively preserves the enrolled owner while
            anonymizing bystander faces across different protection modes.
          </p>
        </div>

        {/* Main Demonstration Stage Container */}
        <div
          className="card-premium"
          style={{
            maxWidth: '1060px',
            margin: '0 auto',
            padding: '2rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.08)',
          }}
        >
          {/* Controls Bar */}
          <div className="demo-controls-bar">
            {/* Control 1: Anonymization Mode */}
            <div className="control-group">
              <span className="control-label">
                <Sliders size={14} />
                <span>Anonymization:</span>
              </span>
              <div className="pill-selector">
                {(['blur', 'pixelate', 'mask'] as AnonymizationMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`pill-btn ${mode === m ? 'active' : ''}`}
                    aria-label={`Select ${m} anonymization mode`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Reference Images */}
            <div className="control-group">
              <span className="control-label">
                <UserCheck size={14} />
                <span>Reference Profile:</span>
              </span>
              <div className="pill-selector">
                {([1, 2, 3] as RefImageId[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRef(r)}
                    className={`pill-btn ${activeRef === r ? 'active' : ''}`}
                    aria-label={`Select reference profile ${r}`}
                  >
                    Ref {r}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="control-group">
              <span className="control-label">
                <Eye size={14} />
                <span>View:</span>
              </span>
              <div className="pill-selector">
                <button
                  onClick={() => setViewMode('comparison')}
                  className={`pill-btn ${viewMode === 'comparison' ? 'active' : ''}`}
                >
                  Side by Side
                </button>
                <button
                  onClick={() => setViewMode('protected')}
                  className={`pill-btn ${viewMode === 'protected' ? 'active' : ''}`}
                >
                  Protected Only
                </button>
                <button
                  onClick={() => setViewMode('original')}
                  className={`pill-btn ${viewMode === 'original' ? 'active' : ''}`}
                >
                  Original Only
                </button>
              </div>
            </div>
          </div>

          {/* Active Reference Metadata Badge */}
          <div className="demo-meta-strip">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="meta-badge-dot" />
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Active Profile: {refDetails[activeRef].label}
              </span>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                ({refDetails[activeRef].angle})
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                ArcFace Cosine Similarity:
              </span>
              <span className="meta-score-pill">
                {refDetails[activeRef].score} / 1.00
              </span>
            </div>
          </div>

          {/* Images Display Area */}
          <div
            className={`demo-viewport-grid ${
              viewMode === 'comparison' ? 'grid-dual' : 'grid-single'
            }`}
          >
            {/* View 1: ORIGINAL IMAGE */}
            {(viewMode === 'comparison' || viewMode === 'original') && (
              <div className="demo-canvas-card">
                <div className="demo-canvas-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="demo-tag-original">ORIGINAL</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      3 Visible Faces Detected
                    </span>
                  </div>
                  <span className="status-badge-unprotected">Unprotected</span>
                </div>

                {/* Simulated Group Scene (Original: All 3 visible) */}
                <div className="demo-scene-container">
                  <div className="scene-bg-gradient" />

                  {/* Face 1: Left Bystander (Visible) */}
                  <div className="scene-person person-left">
                    <div className="face-box-original">
                      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                        <circle cx="36" cy="36" r="26" fill="#FDE68A" />
                        <circle cx="28" cy="32" r="3" fill="#1E293B" />
                        <circle cx="44" cy="32" r="3" fill="#1E293B" />
                        <path d="M30 44C33 48 39 48 42 44" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      <div className="face-tag-overlay tag-bystander">
                        Bystander
                      </div>
                    </div>
                    <span className="person-label">Friend A</span>
                  </div>

                  {/* Face 2: Center Owner (Visible) */}
                  <div className="scene-person person-center">
                    <div className="face-box-owner-original">
                      <svg width="86" height="86" viewBox="0 0 86 86" fill="none">
                        <circle cx="43" cy="43" r="32" fill="#E2E8F0" stroke="#059669" strokeWidth="2" />
                        <circle cx="33" cy="38" r="3.5" fill="#0F172A" />
                        <circle cx="53" cy="38" r="3.5" fill="#0F172A" />
                        <path d="M36 52C39 56 47 56 50 52" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      <div className="face-tag-overlay tag-owner-candidate">
                        Owner Target
                      </div>
                    </div>
                    <span className="person-label font-bold">You (Owner)</span>
                  </div>

                  {/* Face 3: Right Bystander (Visible) */}
                  <div className="scene-person person-right">
                    <div className="face-box-original">
                      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                        <circle cx="36" cy="36" r="26" fill="#FED7AA" />
                        <circle cx="28" cy="32" r="3" fill="#1E293B" />
                        <circle cx="44" cy="32" r="3" fill="#1E293B" />
                        <path d="M31 43C34 46 38 46 41 43" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      <div className="face-tag-overlay tag-bystander">
                        Bystander
                      </div>
                    </div>
                    <span className="person-label">Friend B</span>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: PROTECTED IMAGE */}
            {(viewMode === 'comparison' || viewMode === 'protected') && (
              <div className="demo-canvas-card border-protected">
                <div className="demo-canvas-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="demo-tag-protected">PROTECTED</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Owner: CLEAR • Others: {mode.toUpperCase()}
                    </span>
                  </div>
                  <span className="status-badge-protected">
                    <CheckCircle2 size={13} />
                    Privacy Safe
                  </span>
                </div>

                {/* Simulated Group Scene (Protected: Owner Clear, Others Anonymized) */}
                <div className="demo-scene-container">
                  <div className="scene-bg-gradient" />

                  {/* Face 1: Left Bystander (ANONYMIZED) */}
                  <div className="scene-person person-left">
                    <div className={`face-anonymized-wrapper mode-${mode}`}>
                      {mode === 'blur' && (
                        <div className="face-blur-effect">
                          <div className="blurred-circle" />
                          <span className="anon-badge">BLURRED</span>
                        </div>
                      )}
                      {mode === 'pixelate' && (
                        <div className="face-pixel-effect">
                          <div className="pixel-grid-matrix" />
                          <span className="anon-badge">PIXELATED</span>
                        </div>
                      )}
                      {mode === 'mask' && (
                        <div className="face-mask-effect">
                          <Shield size={28} style={{ color: '#ffffff' }} />
                          <span className="anon-badge">MASKED</span>
                        </div>
                      )}
                    </div>
                    <span className="person-label text-protected">Protected</span>
                  </div>

                  {/* Face 2: Center Owner (CLEAR & UNTOUCHED) */}
                  <div className="scene-person person-center">
                    <div className="face-box-owner-verified">
                      <svg width="86" height="86" viewBox="0 0 86 86" fill="none">
                        <circle cx="43" cy="43" r="32" fill="#E2E8F0" stroke="#10B981" strokeWidth="3" />
                        <circle cx="33" cy="38" r="3.5" fill="#0F172A" />
                        <circle cx="53" cy="38" r="3.5" fill="#0F172A" />
                        <path d="M36 52C39 56 47 56 50 52" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      <div className="face-tag-overlay tag-owner-verified">
                        <UserCheck size={12} />
                        PRESERVED
                      </div>
                    </div>
                    <span className="person-label text-emerald font-bold">You (Preserved)</span>
                  </div>

                  {/* Face 3: Right Bystander (ANONYMIZED) */}
                  <div className="scene-person person-right">
                    <div className={`face-anonymized-wrapper mode-${mode}`}>
                      {mode === 'blur' && (
                        <div className="face-blur-effect">
                          <div className="blurred-circle" />
                          <span className="anon-badge">BLURRED</span>
                        </div>
                      )}
                      {mode === 'pixelate' && (
                        <div className="face-pixel-effect">
                          <div className="pixel-grid-matrix" />
                          <span className="anon-badge">PIXELATED</span>
                        </div>
                      )}
                      {mode === 'mask' && (
                        <div className="face-mask-effect">
                          <Shield size={28} style={{ color: '#ffffff' }} />
                          <span className="anon-badge">MASKED</span>
                        </div>
                      )}
                    </div>
                    <span className="person-label text-protected">Protected</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Clarification Notice */}
          <div className="demo-footer-note">
            <Sparkles size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span>
              Interactive visual preview. SafeSnap runs an on-device pipeline with YOLO detection
              and InsightFace ArcFace embeddings to apply true pixel transformations.
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .demo-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 1.25rem;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .control-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .pill-selector {
          display: inline-flex;
          background: var(--bg-tertiary);
          padding: 3px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
        }

        .pill-btn {
          font-size: 0.775rem;
          font-weight: 600;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .pill-btn:hover {
          color: var(--text-primary);
        }

        .pill-btn.active {
          background: #ffffff;
          color: var(--accent-primary);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
        }

        .demo-meta-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          background: var(--bg-secondary);
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          border: 1px solid var(--border-subtle);
        }

        .meta-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-primary);
        }

        .meta-score-pill {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          color: #065f46;
          background: rgba(16, 185, 129, 0.15);
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }

        .demo-viewport-grid {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .grid-dual {
          grid-template-columns: 1fr 1fr;
        }

        .grid-single {
          grid-template-columns: 1fr;
        }

        .demo-canvas-card {
          border-radius: 16px;
          border: 1px solid var(--border-subtle);
          background: #ffffff;
          overflow: hidden;
        }

        .border-protected {
          border-color: rgba(16, 185, 129, 0.35);
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.08);
        }

        .demo-canvas-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-subtle);
        }

        .demo-tag-original {
          font-family: var(--font-mono);
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--text-muted);
          background: #ffffff;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
        }

        .demo-tag-protected {
          font-family: var(--font-mono);
          font-size: 0.725rem;
          font-weight: 700;
          color: #065f46;
          background: rgba(16, 185, 129, 0.15);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .status-badge-unprotected {
          font-size: 0.725rem;
          font-weight: 600;
          color: #dc2626;
          background: rgba(239, 68, 68, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
        }

        .status-badge-protected {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.725rem;
          font-weight: 600;
          color: #059669;
          background: rgba(16, 185, 129, 0.12);
          padding: 0.2rem 0.65rem;
          border-radius: 9999px;
        }

        .demo-scene-container {
          position: relative;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1.5rem 1rem;
          background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
        }

        .scene-bg-gradient {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 80%);
          pointer-events: none;
        }

        .scene-person {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .person-label {
          font-size: 0.775rem;
          color: var(--text-secondary);
          margin-top: 0.75rem;
        }

        .text-protected {
          color: var(--accent-primary);
          font-weight: 600;
        }

        .font-bold {
          font-weight: 700;
        }

        /* Face Framing in Demo */
        .face-box-original {
          position: relative;
          padding: 4px;
          border: 1.5px solid rgba(148, 163, 184, 0.6);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.7);
        }

        .face-box-owner-original {
          position: relative;
          padding: 4px;
          border: 2px dashed rgba(79, 70, 229, 0.5);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.85);
        }

        .face-box-owner-verified {
          position: relative;
          padding: 4px;
          border: 2.5px solid #10b981;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);
        }

        .face-tag-overlay {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .tag-bystander {
          background: #ffffff;
          color: var(--text-muted);
          border: 1px solid var(--border-medium);
        }

        .tag-owner-candidate {
          background: var(--accent-soft);
          color: var(--accent-primary);
          border: 1px solid var(--accent-soft-border);
        }

        .tag-owner-verified {
          background: #10b981;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
        }

        /* Anonymization Effects */
        .face-anonymized-wrapper {
          width: 76px;
          height: 76px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(79, 70, 229, 0.3);
          background: #e2e8f0;
        }

        .face-blur-effect {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .blurred-circle {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #94a3b8;
          filter: blur(14px);
        }

        .face-pixel-effect {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: 
            linear-gradient(45deg, #cbd5e1 25%, #94a3b8 25%, #94a3b8 50%, #cbd5e1 50%, #cbd5e1 75%, #94a3b8 75%, #94a3b8 100%);
          background-size: 14px 14px;
        }

        .face-mask-effect {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #1e293b;
        }

        .anon-badge {
          position: absolute;
          bottom: 4px;
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }

        .demo-footer-note {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          border-radius: 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          font-size: 0.825rem;
          color: var(--text-secondary);
        }

        @media (max-width: 860px) {
          .grid-dual {
            grid-template-columns: 1fr;
          }
          .demo-controls-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  )
}

export default ProductDemo
