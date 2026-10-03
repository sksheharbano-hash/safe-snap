import React from 'react'
import { Terminal, Layout, Cpu, Scan, Layers, Binary, ShieldCheck } from 'lucide-react'

export const TechnologySection: React.FC = () => {
  const techStack = [
    {
      name: 'Python',
      role: 'Core Runtime & Orchestration',
      desc: 'Powers the backend pipeline, coordinate processing, and model loading.',
      icon: Terminal,
      category: 'Core Language',
    },
    {
      name: 'Streamlit',
      role: 'Local Desktop & Web UI',
      desc: 'Interactive UI for owner enrollment, parameter tuning, and image export.',
      icon: Layout,
      category: 'User Interface',
    },
    {
      name: 'OpenCV',
      role: 'Image & Filter Manipulation',
      desc: 'Gaussian blurring, mosaic pixelation, bounding box operations, and channel conversion.',
      icon: Scan,
      category: 'Vision Library',
    },
    {
      name: 'InsightFace / ArcFace',
      role: 'Biometric Face Embeddings',
      desc: 'Extracts deep normalized feature representations and computes cosine similarity for owner matching.',
      icon: Binary,
      category: 'Recognition Model',
    },
    {
      name: 'ONNX Runtime',
      role: 'High-Speed CPU Inference',
      desc: 'Optimized local execution of deep neural networks without requiring cloud GPUs.',
      icon: Cpu,
      category: 'Inference Engine',
    },
    {
      name: 'NumPy',
      role: 'Matrix Math & Vector Operations',
      desc: 'High-performance vector mathematics for multi-face similarity scoring and threshold evaluation.',
      icon: Layers,
      category: 'Numerical Computing',
    },
    {
      name: 'YOLO-based Face Detection',
      role: 'YOLOv8-face Model',
      desc: 'State-of-the-art single-stage face localization detecting all faces in complex group compositions.',
      icon: ShieldCheck,
      category: 'Detection Model',
    },
  ]

  return (
    <section
      id="technology"
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
            <span>LOCAL TECH STACK</span>
          </div>
          <h2 className="section-title">Built with computer vision.</h2>
          <p className="section-subtitle">
            Powered by modern open-source computer vision and deep learning models,
            fine-tuned to run entirely on everyday consumer hardware.
          </p>
        </div>

        {/* Tech Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {techStack.map((tech) => {
            const Icon = tech.icon
            return (
              <div
                key={tech.name}
                className="card-premium"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--accent-soft)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={19} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.675rem',
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--bg-tertiary)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                    }}
                  >
                    {tech.category}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.2rem',
                  }}
                >
                  {tech.name}
                </h3>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--accent-primary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {tech.role}
                </span>
                <p
                  style={{
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginTop: 'auto',
                  }}
                >
                  {tech.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TechnologySection
