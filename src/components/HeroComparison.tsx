import { useState } from 'react'
import type { PointerEvent } from 'react'
import { ArrowLeftRight, Check, Code2, Folder, LayoutGrid } from 'lucide-react'

function MiniWorkspace({ broken = false }: { broken?: boolean }) {
  return (
    <div className={`mini-workspace ${broken ? 'mini-broken' : ''}`}>
      <div className="mini-app-header">
        <span className="mini-app-icon">
          <LayoutGrid size={15} />
        </span>
        <strong>Project overview</strong>
        <span className="mini-muted">Workspace</span>
      </div>
      <div className="mini-app-body">
        <span className="mini-sidebar">
          <span />
          <span />
          <span />
          <span />
        </span>
        <div className="mini-content">
          <div className="mini-greeting">
            <span>Your projects</span>
            <span>03</span>
          </div>
          <div className="mini-projects">
            {['Brand', 'Website', 'Mobile'].map((name, i) => (
              <div className="mini-project" key={name}>
                <div className={`mini-project-picture mini-picture-${i}`}>
                  <Folder size={23} strokeWidth={1.4} />
                </div>
                <strong>{name}</strong>
                <span className="mini-text-line" />
                <span className="mini-text-line short" />
              </div>
            ))}
          </div>
          <div className="mini-bottom-line">
            <span className="mini-text-line" />
            <span className="mini-text-line short" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeroComparison() {
  const [position, setPosition] = useState(44)

  // Pointer dragging on the picture itself; the range input stays the accessible control.
  function dragTo(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - bounds.left) / bounds.width
    setPosition(Math.round(Math.min(1, Math.max(0, ratio)) * 100))
  }

  return (
    <div className="hero-visual">
      <div className="hero-window">
        <div className="hero-browser-bar">
          <span className="browser-dots">
            <i />
            <i />
            <i />
          </span>
          <span>
            <Code2 size={12} />
            the difference is in the details
          </span>
          <span className="hero-window-dot" />
        </div>
        <div
          className="hero-comparison"
          aria-hidden="true"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            dragTo(event)
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) dragTo(event)
          }}
        >
          <MiniWorkspace />
          <div
            className="hero-before-layer"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <MiniWorkspace broken />
          </div>
          <div className="comparison-label before-label">BEFORE</div>
          <div className="comparison-label after-label">
            <Check size={11} />
            AFTER
          </div>
          <div className="comparison-divider" style={{ left: `${position}%` }}>
            <span>
              <ArrowLeftRight size={17} />
            </span>
          </div>
        </div>
        <label className="hero-slider-label">
          <ArrowLeftRight size={14} />
          <span>Drag to see the difference</span>
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            aria-label="Drag to see the difference: before and after comparison"
            aria-valuetext={`${position}% before, ${100 - position}% after`}
            onChange={(event) => setPosition(Number(event.target.value))}
          />
        </label>
      </div>
      <div className="floating-note">
        <span>
          <Check size={14} />
        </span>
        <div>
          <strong>Small fixes. Better experiences.</strong>
          <p>That’s the FixLab approach.</p>
        </div>
      </div>
      <div className="hero-visual-caption">
        <span className="caption-line" />A little care changes everything.
      </div>
    </div>
  )
}
