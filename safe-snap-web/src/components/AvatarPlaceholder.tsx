import React, { useState, useEffect } from 'react'
import { ShieldCheck, Cpu, ScanFace, CheckCircle2 } from 'lucide-react'
import './AvatarPlaceholder.css'

/**
 * ==========================================================================
 * SAFESNAP 3D AVATAR PLACEHOLDER COMPONENT
 * ==========================================================================
 * 
 * FUTURE INTEGRATION INSTRUCTION:
 * Replace this component or the inner `<div className="avatar-visual-stage">`
 * content with the final SafeSnap 3D avatar.
 * 
 * Supported future avatar formats:
 *  1. Transparent PNG or WebP (<img src="/avatar.webp" className="..." />)
 *  2. 3D GLB/GLTF model (<model-viewer src="/avatar.glb" ... /> or @react-three/fiber)
 *  3. Spline 3D Scene (<spline-viewer url="..." />)
 *  4. Three.js Canvas (<Canvas><AvatarModel /></Canvas>)
 *  5. Transparent alpha video (<video src="/avatar.webm" autoPlay loop muted />)
 * 
 * This component handles all self-contained positioning, backdrop stage lighting,
 * facial recognition bounding brackets, scanning animation, and floating status cards.
 * ==========================================================================
 */

export interface AvatarPlaceholderProps {
  /** Optional override to toggle development placeholder label */
  showPlaceholderLabel?: boolean
  /** Slot for custom 3D avatar component or render element */
  children?: React.ReactNode
}

type ScanPhase = 'FACE DETECTED' | 'OWNER ✓' | 'PRIVATE'

export const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({
  showPlaceholderLabel = true,
  children,
}) => {
  const [currentPhase, setCurrentPhase] = useState<ScanPhase>('OWNER ✓')

  // Slow, subtle state cycle representing SafeSnap's owner-aware recognition loop
  useEffect(() => {
    const phases: ScanPhase[] = ['FACE DETECTED', 'OWNER ✓', 'PRIVATE']
    let index = 1 // Start at OWNER ✓ for immediate clarity

    const interval = setInterval(() => {
      index = (index + 1) % phases.length
      setCurrentPhase(phases[index])
    }, 3800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="avatar-stage-container" aria-label="SafeSnap 3D Avatar Stage">
      {/* 1. Backdrop ambient lighting glow (sits behind the avatar) */}
      <div className="avatar-stage-glow" aria-hidden="true" />

      {/* 2. Concentric alignment rings */}
      <div className="avatar-stage-rings" aria-hidden="true" />

      {/* 3. Floating UI Card 1: OWNER / IDENTIFIED */}
      <div className="floating-card card-owner-id">
        <div className="floating-icon-box floating-icon-emerald">
          <CheckCircle2 size={18} strokeWidth={2.5} />
        </div>
        <div className="floating-content">
          <span className="floating-label">OWNER</span>
          <span className="floating-value">✓ IDENTIFIED</span>
        </div>
      </div>

      {/* 4. Floating UI Card 2: PRIVATE / LOCAL PROCESSING */}
      <div className="floating-card card-local-proc">
        <div className="floating-icon-box floating-icon-indigo">
          <Cpu size={18} strokeWidth={2.2} />
        </div>
        <div className="floating-content">
          <span className="floating-label">PRIVATE</span>
          <span className="floating-value">LOCAL PROCESSING</span>
        </div>
      </div>

      {/* 5. Floating UI Card 3: FACE DETECTED */}
      <div className="floating-card card-face-detected">
        <div className="floating-icon-box floating-icon-cyan">
          <ScanFace size={18} strokeWidth={2.2} />
        </div>
        <div className="floating-content">
          <span className="floating-label">BIOMETRIC</span>
          <span className="floating-value">FACE DETECTED</span>
        </div>
      </div>

      {/* 6. Main Visual Stage & Replacement Container */}
      <div className="avatar-visual-stage" id="avatar-visual-stage">
        {/* Subtle technical background grid */}
        <div className="avatar-stage-grid" aria-hidden="true" />

        {/* Face recognition bounding box with corner brackets & scanning beam */}
        <div className="avatar-face-recognition-box" aria-hidden="true">
          <span className="corner-bracket corner-top-left" />
          <span className="corner-bracket corner-top-right" />
          <span className="corner-bracket corner-bottom-left" />
          <span className="corner-bracket corner-bottom-right" />
          
          {/* Subtle scanning line beam */}
          <div className="scanner-beam" />

          {/* Cycling status indicator: FACE DETECTED -> OWNER ✓ -> PRIVATE */}
          <div className="face-status-tag">
            <span
              className="face-status-indicator"
              style={{
                backgroundColor:
                  currentPhase === 'OWNER ✓'
                    ? 'var(--success)'
                    : currentPhase === 'PRIVATE'
                    ? 'var(--accent-primary)'
                    : 'var(--shield-cyan)',
              }}
            />
            <span>{currentPhase}</span>
          </div>
        </div>

        {/* 
          REPLACEMENT SLOT:
          When the real 3D avatar is ready, pass it as children OR replace 
          the fallback placeholder below with:
          <img src="/assets/avatar.png" alt="SafeSnap Owner Avatar" className="w-full h-full object-contain" />
        */}
        {children ? (
          <div className="avatar-content-wrapper" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 3 }}>
            {children}
          </div>
        ) : (
          <div className="avatar-placeholder-inner">
            {/* Subtle silhouette wireframe representing future 3D human avatar position */}
            <div className="avatar-placeholder-wireframe" />

            {showPlaceholderLabel && (
              <span className="avatar-placeholder-badge">
                <ShieldCheck size={13} style={{ color: 'var(--accent-primary)' }} />
                3D AVATAR STAGE
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AvatarPlaceholder
