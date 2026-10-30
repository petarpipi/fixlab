import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  Folder,
  Menu,
  X,
} from 'lucide-react'
import type { DemoId } from '../data/demos'
import { validateInquiry } from '../lib/validation'
import type { Inquiry, InquiryErrors } from '../lib/validation'

function LayoutPreview() {
  return (
    <div className="sample-padding">
      <div className="sample-heading">
        <strong>Studio workspace</strong>
        <span>3 projects</span>
      </div>
      <div className="repaired-grid" data-testid="repaired-grid">
        {['Brand system', 'Web experience', 'Mobile app'].map((name, index) => (
          <article className="project-tile" key={name}>
            <div className={`project-art project-art-${index}`}>
              <Folder size={28} strokeWidth={1.3} />
              <span>0{index + 1}</span>
            </div>
            <h4>{name}</h4>
            <p>{['Design foundations', 'Digital products', 'Everyday utility'][index]}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

// fixlab:start navigation
function NavigationPreview() {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState('Projects')
  const trigger = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && open) {
      setOpen(false)
      trigger.current?.focus()
    }
  }

  return (
    <div className="sample-padding sample-nav" onKeyDown={handleKey}>
      <div className="sample-heading">
        <strong className="studio-logo">studio.</strong>
        <button
          ref={trigger}
          className="sample-icon-button"
          aria-label="Sample navigation"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      <nav id={menuId} aria-label="Sample pages" hidden={!open} className="sample-menu">
        {['Projects', 'Studio', 'Contact'].map((item) => (
          <button
            key={item}
            aria-current={page === item ? 'page' : undefined}
            onClick={() => {
              setPage(item)
              setOpen(false)
              trigger.current?.focus()
            }}
          >
            {item}
            <ArrowRight size={14} />
          </button>
        ))}
      </nav>
      <div className="sample-nav-content" aria-live="polite">
        <span className="sample-eyebrow">{page}</span>
        <h4>
          {page === 'Projects'
            ? 'Your next great idea.'
            : page === 'Studio'
              ? 'Small studio. Big ideas.'
              : 'Let’s make something.'}
        </h4>
        <p>
          {page === 'Projects'
            ? 'Thoughtful digital experiences, made with care.'
            : page === 'Studio'
              ? 'A sample studio page. Built around good design.'
              : 'A sample contact page. Your next project starts here.'}
        </p>
        <span className="sample-success">
          <Check size={13} /> Navigation that works
        </span>
      </div>
    </div>
  )
}
// fixlab:end navigation

function AlignmentPreview() {
  return (
    <div className="sample-padding">
      <div className="sample-heading">
        <strong>Project files</strong>
        <span>3 files</span>
      </div>
      <ul className="file-list">
        {['Brand guidelines', 'Website component library', 'Icons'].map((file, index) => (
          <li className="aligned-row" key={file}>
            <span className="file-icon">
              <FileText size={17} />
            </span>
            <div>
              <strong>{file}</strong>
              <span>{['Updated just now', 'Updated 2 hours ago', 'Updated yesterday'][index]}</span>
            </div>
            <span className={`file-status ${index === 1 ? 'review' : ''}`}>
              {index === 1 ? 'In review' : 'Ready'}
            </span>
          </li>
        ))}
      </ul>
      <p className="sample-footnote">
        <CheckCircle2 size={13} /> Aligned, even when the content changes.
      </p>
    </div>
  )
}

// fixlab:start images
function ImagePreview() {
  return (
    <div className="sample-padding">
      <div className="sample-heading">
        <strong>Spaces, thoughtfully made.</strong>
      </div>
      <picture>
        <source
          type="image/avif"
          srcSet="/images/architecture-480.avif 480w, /images/architecture-960.avif 960w"
          sizes="(max-width: 600px) 280px, 600px"
        />
        <img
          className="responsive-photo"
          src="/images/architecture-960.webp"
          srcSet="/images/architecture-480.webp 480w, /images/architecture-960.webp 960w"
          sizes="(max-width: 600px) 280px, 600px"
          width="960"
          height="640"
          alt="A modern home with a lawn, tall trees, and warm interior lighting"
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className="image-caption">
        <span>Good design deserves a good view.</span>
        <span>3:2 ratio</span>
      </div>
    </div>
  )
}
// fixlab:end images

function ValidationPreview() {
  const [values, setValues] = useState<Inquiry>({ name: '', email: '', brief: '' })
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const successHeading = useRef<HTMLHeadingElement>(null)
  const moveFocus = useRef(false)
  const id = useId()

  // The submit and retry buttons unmount on these transitions, so focus is placed explicitly.
  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    if (submitted) successHeading.current?.focus()
    else form.current?.querySelector<HTMLElement>('[name="name"]')?.focus()
  }, [submitted])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateInquiry(values)
    setErrors(nextErrors)
    const valid = Object.keys(nextErrors).length === 0
    moveFocus.current = valid
    setSubmitted(valid)
    const firstInvalid = (['name', 'email', 'brief'] as const).find((key) => nextErrors[key])
    if (firstInvalid) form.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
  }

  if (submitted)
    return (
      <div className="form-success" role="status">
        <span className="success-icon">
          <CheckCircle2 size={25} />
        </span>
        <h4 ref={successHeading} tabIndex={-1}>
          That’s a well-formed inquiry.
        </h4>
        <p>
          All fields passed validation.
          <br />
          This is a demo. No data was sent or stored.
        </p>
        <button
          className="sample-button secondary"
          onClick={() => {
            moveFocus.current = true
            setSubmitted(false)
            setValues({ name: '', email: '', brief: '' })
          }}
        >
          Try again
          <ArrowRight size={14} />
        </button>
      </div>
    )

  return (
    <form ref={form} className="sample-padding sample-form" onSubmit={submit} noValidate>
      <div className="sample-heading">
        <strong>Let’s talk about your project.</strong>
      </div>
      <div className="form-fields">
        {(['name', 'email', 'brief'] as const).map((key) => {
          const controlId = `${id}-${key}`
          const shared = {
            id: controlId,
            name: key,
            value: values[key],
            required: true,
            'aria-invalid': Boolean(errors[key]),
            'aria-describedby': errors[key] ? `${controlId}-error` : undefined,
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setValues({ ...values, [key]: event.target.value })
              if (errors[key]) setErrors({ ...errors, [key]: undefined })
            },
          }
          return (
            <div className={`field field-${key}`} key={key}>
              <label htmlFor={controlId}>
                {key === 'name' ? 'Name' : key === 'email' ? 'Email' : 'Project brief'}
              </label>
              {key === 'brief' ? (
                <textarea
                  {...shared}
                  placeholder="What needs fixing?"
                  rows={2}
                  minLength={10}
                  maxLength={2000}
                />
              ) : (
                <input
                  {...shared}
                  type={key === 'email' ? 'email' : 'text'}
                  autoComplete={key}
                  maxLength={key === 'name' ? 100 : 254}
                  placeholder={key === 'name' ? 'Alex Morgan' : 'alex@example.com'}
                />
              )}
              {errors[key] && (
                <p id={`${controlId}-error`} className="field-error">
                  {errors[key]}
                </p>
              )}
            </div>
          )
        })}
      </div>
      <button className="sample-button primary" type="submit">
        Validate inquiry
        <ArrowRight size={14} />
      </button>
      <p className="sample-footnote">Demo only. Nothing is sent or stored.</p>
    </form>
  )
}

// fixlab:start components
function ComponentsPreview() {
  const [repair, setRepair] = useState('Responsive layout')
  const [saved, setSaved] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const selectId = useId()
  const titleId = useId()

  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const controls = dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
    const first = controls?.[0]
    const last = controls?.[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <div className="sample-padding">
      <div className="sample-heading">
        <strong>Repair workspace</strong>
        <span className="draft-label">{saved ? 'Saved locally in this demo' : 'Draft'}</span>
      </div>
      <label className="select-label" htmlFor={selectId}>
        Repair type
      </label>
      <div className="sample-select">
        <select
          id={selectId}
          value={repair}
          onChange={(event) => {
            setRepair(event.target.value)
            setSaved(false)
          }}
        >
          <option>Responsive layout</option>
          <option>Accessible navigation</option>
          <option>Form validation</option>
        </select>
        <ChevronDown size={16} aria-hidden="true" />
      </div>
      <div className="component-summary">
        <span className="summary-icon">
          <FileText size={22} />
        </span>
        <h4>One step closer to fixed.</h4>
        <p>Select a repair and review its summary.</p>
      </div>
      <div className="sample-actions">
        <button className="sample-button secondary" onClick={() => dialog.current?.showModal()}>
          View summary
          <ArrowRight size={14} />
        </button>
        {/* aria-disabled keeps focus on the button; `disabled` would drop it to <body>. */}
        <button
          className="sample-button primary"
          onClick={() => setSaved(true)}
          aria-disabled={saved}
        >
          {saved ? <Check size={14} /> : <ArrowDownToLine size={14} />}
          {saved ? 'Saved' : 'Save repair'}
        </button>
      </div>
      <p className="sample-footnote" role="status">
        {saved
          ? `${repair} saved for this demo session. It resets when you leave this example.`
          : 'Keyboard friendly. Try Tab, Enter, and Escape.'}
      </p>
      <dialog
        ref={dialog}
        className="repair-dialog"
        aria-labelledby={titleId}
        onKeyDown={containFocus}
      >
        <div className="dialog-top">
          <span className="sample-eyebrow">REPAIR SUMMARY</span>
          <button
            className="sample-icon-button"
            aria-label="Close summary"
            onClick={() => dialog.current?.close()}
          >
            <X size={19} />
          </button>
        </div>
        <h3 id={titleId}>{repair}</h3>
        <p>
          A focused frontend repair with responsive behavior, clear feedback, and keyboard support.
        </p>
        <ul>
          <li>
            <Check size={16} /> Responsive across screen sizes
          </li>
          <li>
            <Check size={16} /> Accessible keyboard interactions
          </li>
          <li>
            <Check size={16} /> Clear, maintainable source code
          </li>
        </ul>
        <button
          className="sample-button primary"
          onClick={() => {
            setSaved(true)
            dialog.current?.close()
          }}
        >
          Save this repair
          <Check size={15} />
        </button>
        <p className="dialog-note">Example only. No external service or persistent storage.</p>
      </dialog>
    </div>
  )
}
// fixlab:end components

export function Preview({ id }: { id: DemoId }) {
  switch (id) {
    case 'layout':
      return <LayoutPreview />
    case 'navigation':
      return <NavigationPreview />
    case 'alignment':
      return <AlignmentPreview />
    case 'images':
      return <ImagePreview />
    case 'validation':
      return <ValidationPreview />
    case 'components':
      return <ComponentsPreview />
  }
}
