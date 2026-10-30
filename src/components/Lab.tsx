import { useState } from 'react'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Eye,
  Info,
  Monitor,
  Smartphone,
  TriangleAlert,
} from 'lucide-react'
import { demos } from '../data/demos'
import type { ComparisonMode, DemoId } from '../data/demos'
import { brokenDocument, brokenSource } from '../lib/brokenExamples'
import { repairSource } from '../lib/source'
import { Preview } from './Previews'

function CodePanel({ id, mode }: { id: DemoId; mode: ComparisonMode }) {
  const [status, setStatus] = useState('')
  const source = mode === 'before' ? brokenSource(id) : repairSource(id)
  const demo = demos.find((item) => item.id === id)!
  async function copy() {
    try {
      await navigator.clipboard.writeText(source)
      setStatus('Copied to clipboard')
    } catch {
      setStatus('Clipboard unavailable. Select the code to copy it manually.')
    }
  }
  return (
    <div className="code-panel">
      <div className="code-toolbar">
        <span>
          <Code2 size={14} />
          {mode === 'before' ? 'src/lib/brokenExamples.ts' : demo.sourceFile}
        </span>
        <button onClick={() => void copy()}>
          <Copy size={14} />
          Copy code
        </button>
      </div>
      <pre tabIndex={0} aria-label={`${demo.shortTitle} implementation`}>
        <code>{source}</code>
      </pre>
      <div className="code-footer">
        <span>
          {mode === 'after'
            ? 'Excerpt from the running implementation'
            : 'HTML fixture rendered in the sandbox'}
        </span>
        <span role="status">{status}</span>
      </div>
    </div>
  )
}

export function Lab() {
  const [selected, setSelected] = useState<DemoId>('layout')
  const [mode, setMode] = useState<ComparisonMode>('after')
  const [compact, setCompact] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const active = demos.find((demo) => demo.id === selected)!
  const number = demos.findIndex((demo) => demo.id === selected) + 1

  function select(id: DemoId) {
    setSelected(id)
    setMode('after')
    setShowCode(false)
  }

  return (
    <section id="lab" className="lab-section section-anchor" aria-labelledby="lab-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="blue-line" />
            THE INTERACTIVE LAB
          </p>
          <h2 id="lab-title">
            See the problem.
            <br className="mobile-break" /> Try the fix.
          </h2>
        </div>
        <p>
          Six common frontend frustrations.
          <br />
          Explore what changes when they’re fixed properly.
        </p>
      </div>
      <div className="lab-container">
        <aside className="lab-sidebar" aria-label="Choose a demonstration">
          <div className="sidebar-heading">
            <span>THE REPAIRS</span>
            <span>06</span>
          </div>
          <div className="demo-choices">
            {demos.map((demo, index) => {
              const Icon = demo.icon
              return (
                <button
                  key={demo.id}
                  aria-pressed={selected === demo.id}
                  className={`demo-choice ${selected === demo.id ? 'selected' : ''}`}
                  onClick={() => select(demo.id)}
                >
                  <span className="demo-number">0{index + 1}</span>
                  <Icon size={18} strokeWidth={1.7} />
                  <span>{demo.shortTitle}</span>
                  <ChevronRight size={15} className="choice-arrow" />
                </button>
              )
            })}
          </div>
          <div className="sidebar-note">
            <span className="note-icon">
              <Info size={16} />
            </span>
            <p>
              Real examples.
              <br />
              Real working code.
              <br />
              <strong>No smoke and mirrors.</strong>
            </p>
          </div>
        </aside>
        <article className="lab-workspace" aria-labelledby="demo-title">
          <div className="workspace-heading">
            <div>
              <p className="sample-eyebrow">{active.category}</p>
              <h3 id="demo-title">{active.title}</h3>
            </div>
            <span className="workspace-number">
              0{number}
              <span> / 06</span>
            </span>
          </div>
          <div className="workspace-toolbar">
            <div className="segmented compare-modes" role="group" aria-label="Compare versions">
              <button aria-pressed={mode === 'before'} onClick={() => setMode('before')}>
                <span className="state-dot before-dot" />
                Before
              </button>
              <button aria-pressed={mode === 'after'} onClick={() => setMode('after')}>
                <span className="state-dot after-dot" />
                After
                <Check size={12} className="after-check" />
              </button>
            </div>
            <div className="toolbar-right">
              {!showCode && (
                <div className="viewport-controls" role="group" aria-label="Preview width">
                  <button
                    aria-label="Fluid preview"
                    title="Fluid preview"
                    aria-pressed={!compact}
                    onClick={() => setCompact(false)}
                  >
                    <Monitor size={16} />
                  </button>
                  <button
                    aria-label="Mobile preview"
                    title="Mobile preview"
                    aria-pressed={compact}
                    onClick={() => setCompact(true)}
                  >
                    <Smartphone size={16} />
                  </button>
                </div>
              )}
              <span className="toolbar-divider" />
              <button
                className="code-toggle"
                aria-pressed={showCode}
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? <Eye size={15} /> : <Code2 size={15} />}
                <span>{showCode ? 'Preview' : 'View code'}</span>
              </button>
            </div>
          </div>
          {showCode ? (
            <CodePanel key={`${selected}-${mode}`} id={selected} mode={mode} />
          ) : (
            <div className={`preview-stage ${mode === 'before' ? 'before-stage' : ''}`}>
              <div
                className={`preview-window ${compact ? 'compact' : ''}`}
                data-testid="preview-window"
              >
                <div className="preview-browser-bar">
                  <span className="browser-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>example.local / {selected}</span>
                  <span className={`preview-state ${mode}`}>
                    <span className="state-dot" />
                    {mode === 'after' ? 'Fixed' : 'Needs a fix'}
                  </span>
                </div>
                {mode === 'before' ? (
                  <iframe
                    className="broken-frame"
                    title={`Intentionally broken ${active.shortTitle} example`}
                    sandbox=""
                    referrerPolicy="no-referrer"
                    tabIndex={-1}
                    srcDoc={brokenDocument(selected)}
                  />
                ) : (
                  <div className="live-preview" key={selected}>
                    <Preview id={selected} />
                  </div>
                )}
              </div>
              <p className="preview-instruction">
                {mode === 'before' ? (
                  <>
                    <TriangleAlert size={13} />
                    Intentionally broken example · safely isolated
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={13} />
                    {active.instruction}
                  </>
                )}
              </p>
            </div>
          )}
          <div className={`repair-explanation ${mode}`}>
            <span className="explanation-icon">
              {mode === 'after' ? <CheckCircle2 size={18} /> : <TriangleAlert size={18} />}
            </span>
            <div>
              <h4>{mode === 'after' ? active.afterLabel : active.beforeLabel}</h4>
              <p>{mode === 'after' ? active.solution : active.problem}</p>
              <div className="repair-tags">
                {active.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
      <div className="lab-bottom-note">
        <span>
          <span className="status-dot" />
          All six examples run right here in your browser.
        </span>
        <a href="#implementation">
          Curious about the code?
          <ArrowRight size={14} />
        </a>
      </div>
      <span className="sr-only" role="status">
        Showing {active.shortTitle}: {mode}
        {showCode ? ' implementation' : ' preview'}.
      </span>
    </section>
  )
}
