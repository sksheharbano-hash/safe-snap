import React, { useState } from 'react'
import { X, ExternalLink, Terminal, Copy, Check, Play, ShieldAlert, Cpu } from 'lucide-react'

interface LaunchModalProps {
  isOpen: boolean
  onClose: () => void
  appUrl?: string
}

export const LaunchModal: React.FC<LaunchModalProps> = ({
  isOpen,
  onClose,
  appUrl = 'http://localhost:8501',
}) => {
  const [copied, setCopied] = useState(false)
  const [customUrl, setCustomUrl] = useState(appUrl)

  if (!isOpen) return null

  const command = 'streamlit run app.py'

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLaunch = () => {
    window.open(customUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          animation: 'modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cpu size={18} />
            </div>
            <div>
              <h2
                id="modal-title"
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Launch SafeSnap Studio
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                On-Device Streamlit Processing Engine
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              padding: '0.4rem',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem 1.5rem' }}>
          <p
            style={{
              fontSize: '0.925rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              marginBottom: '1.5rem',
            }}
          >
            SafeSnap processes your photos on your local machine using Streamlit,
            YOLO face detection, and InsightFace.
          </p>

          {/* Quick Launch Button */}
          <div style={{ marginBottom: '1.75rem' }}>
            <button
              onClick={handleLaunch}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem 1.5rem',
                fontSize: '1rem',
                gap: '0.6rem',
              }}
              id="launch-direct-btn"
            >
              <Play size={18} fill="currentColor" />
              <span>Open SafeSnap Studio ({customUrl})</span>
              <ExternalLink size={16} />
            </button>
          </div>

          {/* Local Run Guide */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Terminal size={14} />
                To run the processing backend locally:
              </span>
              <button
                onClick={handleCopy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  color: copied ? 'var(--success)' : 'var(--accent-primary)',
                  cursor: 'pointer',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-medium)',
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy command'}</span>
              </button>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.825rem',
                backgroundColor: '#0f172a',
                color: '#38bdf8',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                overflowX: 'auto',
              }}
            >
              <span style={{ color: '#94a3b8' }}># From the project root:</span>
              <br />
              <span style={{ color: '#ffffff' }}>cd core</span>
              <br />
              <span style={{ color: '#38bdf8' }}>streamlit run app.py</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.85rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldAlert size={14} style={{ color: 'var(--accent-primary)' }} />
              <span>Runs on your local port (defaults to 8501). No images leave your device.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>URL:</span>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.775rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                width: '180px',
              }}
            />
          </div>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.825rem',
            }}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}

export default LaunchModal
