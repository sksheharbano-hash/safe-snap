import React from 'react'
import Logo from './Logo'

export const Footer: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
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
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#ffffff',
        paddingTop: '4rem',
        paddingBottom: '3rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: '380px' }}>
            <Logo size="md" showTagline={true} />
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginTop: '1.25rem',
              }}
            >
              An Owner-Aware On-Device System for Privacy-Preserving and Enhanced Image
              Sharing. Built for private local photo redaction without external AI APIs.
            </p>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '3.5rem', flexWrap: 'wrap' }}>
            <div>
              <h3
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Navigation
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <li>
                  <a
                    href="#features"
                    onClick={(e) => handleNavClick(e, '#features')}
                    style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    onClick={(e) => handleNavClick(e, '#how-it-works')}
                    style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    onClick={(e) => handleNavClick(e, '#privacy')}
                    style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    Privacy Architecture
                  </a>
                </li>
                <li>
                  <a
                    href="#technology"
                    onClick={(e) => handleNavClick(e, '#technology')}
                    style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    Technology Stack
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Project
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <li style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  College Major Project
                </li>
                <li style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  On-Device Computer Vision
                </li>
                <li style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Module 1–6 Pipeline
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '2rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} SafeSnap. Keep your memories. Protect their privacy.
          </div>
          <div>
            Local execution on-device &bull; Zero external API dependencies
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
