import React, { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react'
import Logo from './Logo'

interface NavbarProps {
  onOpenApp: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenApp }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'Technology', href: '#technology' },
  ]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      const navOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: isScrolled
          ? 'rgba(255, 255, 255, 0.92)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isScrolled
          ? '1px solid rgba(226, 232, 240, 0.9)'
          : '1px solid rgba(226, 232, 240, 0.4)',
        transition: 'all 0.25s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* SafeSnap Brand */}
        <a href="#" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Logo size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              style={{
                fontSize: '0.925rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div
          className="nav-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <button
            onClick={onOpenApp}
            className="btn-primary"
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.875rem',
            }}
            id="nav-protect-btn"
          >
            <span>Protect a Photo</span>
            <ArrowRight size={15} />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
          className="mobile-drawer"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false)
              onOpenApp()
            }}
            className="btn-primary"
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.75rem 1.25rem',
            }}
          >
            <ShieldCheck size={16} />
            <span>Protect a Photo</span>
          </button>
        </div>
      )}

      {/* Scoped CSS for responsive menu */}
      <style>{`
        .mobile-menu-btn {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  )
}

export default Navbar
