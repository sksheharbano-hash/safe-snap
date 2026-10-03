import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  className?: string
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 44,
  }

  const textSizes = {
    sm: '1.15rem',
    md: '1.35rem',
    lg: '1.75rem',
  }

  const px = iconSizes[size]

  return (
    <div
      className={`safesnap-logo-brand ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      <div
        className="logo-mark"
        style={{
          width: px,
          height: px,
          borderRadius: size === 'sm' ? '8px' : '10px',
          background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.28)',
          flexShrink: 0,
        }}
      >
        {/* SafeSnap Identity: Camera + Face Biometric Points + Privacy Iris */}
        <svg
          width={px * 0.65}
          height={px * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Camera body outline */}
          <path
            d="M4 8C4 6.89543 4.89543 6 6 6H7.58579C8.11622 6 8.62493 5.78929 9 5.41421L9.58579 4.82843C9.96086 4.45336 10.4696 4.24264 11 4.24264H13C13.5304 4.24264 14.0391 4.45336 14.4142 4.82843L15 5.41421C15.3751 5.78929 15.8838 6 16.4142 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Biometric Face / Lens Circle */}
          <circle
            cx="12"
            cy="13"
            r="4.25"
            stroke="#C7D2FE"
            strokeWidth="1.6"
            strokeDasharray="2.5 1.5"
          />
          {/* Central Protected Iris Dot */}
          <circle cx="12" cy="13" r="1.75" fill="#38BDF8" />
          {/* Subtle Flash / Sensor */}
          <circle cx="16.5" cy="9" r="0.9" fill="#FFFFFF" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: textSizes[size],
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}
        >
          Safe<span style={{ color: 'var(--accent-primary)' }}>Snap</span>
        </span>
        {showTagline && (
          <span
            style={{
              fontSize: '0.725rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              marginTop: '0.15rem',
            }}
          >
            Privacy-preserving image sharing
          </span>
        )}
      </div>
    </div>
  )
}

export default Logo
