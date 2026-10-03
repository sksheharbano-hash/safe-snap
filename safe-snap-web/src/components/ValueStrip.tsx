import React from 'react'
import { Cpu, UserCheck, ShieldAlert, CloudOff } from 'lucide-react'

export const ValueStrip: React.FC = () => {
  const values = [
    {
      icon: Cpu,
      title: 'LOCAL PROCESSING',
      desc: 'Designed for local image processing.',
      color: '#4f46e5',
      bg: 'rgba(79, 70, 229, 0.08)',
    },
    {
      icon: UserCheck,
      title: 'OWNER-AWARE',
      desc: 'Preserve the authorized owner.',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.08)',
    },
    {
      icon: ShieldAlert,
      title: 'AUTOMATIC PRIVACY',
      desc: 'Anonymize detected non-owner faces.',
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.08)',
    },
    {
      icon: CloudOff,
      title: 'NO EXTERNAL IMAGE API',
      desc: 'Designed without sending images to external AI services.',
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.08)',
    },
  ]

  return (
    <div
      style={{
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: '#ffffff',
        paddingTop: '2.5rem',
        paddingBottom: '2.5rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {values.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  transition: 'background-color 0.2s ease',
                }}
                className="value-strip-item"
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: item.bg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: 'var(--text-primary)',
                      marginBottom: '0.25rem',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {item.title}
                  </h2>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.45,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .value-strip-item:hover {
          background-color: var(--bg-secondary);
        }
      `}</style>
    </div>
  )
}

export default ValueStrip
