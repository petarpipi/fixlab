import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  Code2,
  FileCode2,
  Menu,
  ScanLine,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { HeroComparison } from './components/HeroComparison'
import { Lab } from './components/Lab'

function Logo() {
  return (
    <a href="#top" className="logo" aria-label="FixLab home">
      <span className="logo-icon">
        <Braces size={24} strokeWidth={2.1} />
      </span>
      <span>
        FIXLAB<span className="logo-period">.</span>
      </span>
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false)
    }
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [open])
  return (
    <header ref={header} className="site-header">
      <div className="page-width header-inner">
        <Logo />
        <nav
          className={`main-nav ${open ? 'is-open' : ''}`}
          id="main-navigation"
          aria-label="Main navigation"
        >
          {[
            ['#lab', 'The lab'],
            ['#approach', 'The approach'],
            ['#implementation', 'Under the hood'],
          ].map(([href, text]) => (
            <a
              key={href}
              href={href}
              onClick={() => {
                setOpen(false)
                if (open) trigger.current?.focus()
              }}
            >
              {text}
            </a>
          ))}
        </nav>
        <a href="#lab" className="header-cta">
          Explore the fixes
          <ArrowUpRight size={15} />
        </a>
        <button
          ref={trigger}
          className="mobile-nav-trigger"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  )
}

const approach = [
  {
    number: '01',
    title: 'Understand the problem.',
    description:
      'Reproduce the issue. Find the cause. A visual patch isn’t enough if the underlying behavior is still broken.',
    icon: ScanLine,
  },
  {
    number: '02',
    title: 'Make the right fix.',
    description:
      'Use the simplest reliable solution: semantic HTML, resilient CSS, and focused React state.',
    icon: Code2,
  },
  {
    number: '03',
    title: 'Check the whole experience.',
    description:
      'Test small screens, keyboard flows, error states, and reduced motion. The details are part of the job.',
    icon: ShieldCheck,
  },
]

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Header />
      <main id="main" tabIndex={-1}>
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy reveal">
            <p className="eyebrow">
              <span className="blue-line" />A FRONTEND REPAIR LAB
            </p>
            <h1 id="hero-title">
              Frontend Problems.
              <br />
              <span>
                Professionally
                <br className="desktop-break" /> Solved.
              </span>
            </h1>
            <p className="hero-description">
              Broken layouts. Stubborn styles. Components that almost work. See how thoughtful
              frontend fixes turn friction into a better experience.
            </p>
            <div className="hero-actions">
              <a href="#lab" className="button-primary">
                Step inside the lab
                <ArrowUpRight size={17} />
              </a>
              <a href="#approach" className="button-text">
                See the approach
                <ArrowRight size={16} />
              </a>
            </div>
            <div className="hero-proof">
              <span>
                <Check size={14} />6 interactive fixes
              </span>
              <span>
                <Check size={14} />
                Real implementation code
              </span>
            </div>
          </div>
          <div className="hero-demo reveal reveal-delayed">
            <HeroComparison />
          </div>
        </section>
        <div className="stack-strip">
          <div className="page-width stack-inner">
            <span className="stack-label">BUILT WITH INTENTION</span>
            <div className="stack-items">
              <span>React</span>
              <span>TypeScript</span>
              <span>Vite</span>
              <span>Modern CSS</span>
            </div>
            <a href="#lab">
              Scroll to explore
              <ArrowDown size={13} />
            </a>
          </div>
        </div>
        <div className="page-width">
          <Lab />
        </div>
        <section
          id="approach"
          className="approach-section section-anchor"
          aria-labelledby="approach-title"
        >
          <div className="page-width">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <span className="blue-line" />
                  THE APPROACH
                </p>
                <h2 id="approach-title">A fix should feel invisible.</h2>
              </div>
              <p>
                Good frontend work removes the friction.
                <br />
                Here’s what goes into getting it right.
              </p>
            </div>
            <div className="approach-grid">
              {approach.map((item) => (
                <article key={item.number} className="approach-card">
                  <div className="approach-card-top">
                    <item.icon size={25} strokeWidth={1.5} />
                    <span>{item.number}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="implementation"
          className="implementation-section page-width section-anchor"
          aria-labelledby="implementation-title"
        >
          <div className="implementation-copy">
            <p className="eyebrow">
              <span className="blue-line" />
              UNDER THE HOOD
            </p>
            <h2 id="implementation-title">
              More than a<br />
              before and after.
            </h2>
            <p>
              Every example is a small engineering case study. The broken version is contained. The
              repaired version is live. And the code you see is the code that runs.
            </p>
            <a href="#lab" className="button-text">
              Inspect a repair
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="engineering-notes">
            <details open>
              <summary>
                <span>
                  <Braces size={19} />
                  Maintainable by design
                </span>
                <span className="details-plus">+</span>
              </summary>
              <p>
                Typed data, focused React components, and small pure functions keep the examples
                easy to understand and extend. Source excerpts are extracted from the actual
                implementation.
              </p>
            </details>
            <details>
              <summary>
                <span>
                  <ShieldCheck size={19} />
                  Accessible from the start
                </span>
                <span className="details-plus">+</span>
              </summary>
              <p>
                Semantic controls, visible focus, named fields, inline errors, a native modal
                dialog, and keyboard-operable navigation. Animation respects your reduced-motion
                preference.
              </p>
            </details>
            <details>
              <summary>
                <span>
                  <Sparkles size={19} />
                  Light on purpose
                </span>
                <span className="details-plus">+</span>
              </summary>
              <p>
                Local fonts and responsive AVIF/WebP images remove third-party requests. CSS
                animation uses short opacity and transform transitions, with no animation library.
                No autoplay, parallax, or decorative animation loops.
              </p>
            </details>
            <details>
              <summary>
                <span>
                  <FileCode2 size={19} />
                  Built to be reviewed
                </span>
                <span className="details-plus">+</span>
              </summary>
              <p>
                The project includes strict TypeScript, Vitest component and unit tests, Playwright
                browser tests, and automated accessibility checks. See README.md and TEST_REPORT.md
                in the source project for commands and results.
              </p>
            </details>
          </div>
        </section>
        <section className="closing-section page-width" aria-labelledby="closing-title">
          <div className="closing-icon">
            <Braces size={26} />
          </div>
          <div>
            <p className="eyebrow">LESS FRICTION. MORE FINISH.</p>
            <h2 id="closing-title">The difference is in the details.</h2>
            <p>Explore the fixes. Try the edge cases. Look at the code.</p>
          </div>
          <a href="#lab" className="button-primary">
            Back to the lab
            <ArrowUpRight size={17} />
          </a>
        </section>
      </main>
      <footer className="site-footer">
        <div className="page-width footer-inner">
          <Logo />
          <p>An independent frontend portfolio project.</p>
          <a href="#top">
            Back to top
            <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
    </>
  )
}
