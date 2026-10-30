import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Lab } from './Lab'
import { demos } from '../data/demos'
import { repairSource, extractSection } from '../lib/source'

describe('interactive lab', () => {
  it.each(demos)('opens $shortTitle with a working source excerpt', async (demo) => {
    const user = userEvent.setup()
    render(<Lab />)
    await user.click(screen.getByRole('button', { name: new RegExp(demo.shortTitle, 'i') }))
    expect(screen.getByRole('heading', { name: demo.title })).toBeVisible()
    expect(screen.getByRole('button', { name: 'After' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'View code' }))
    expect(screen.getByRole('code').textContent).toBe(repairSource(demo.id))
  })
  it('contains the intentionally broken example in an unprivileged iframe', async () => {
    const user = userEvent.setup()
    render(<Lab />)
    await user.click(screen.getByRole('button', { name: 'Before' }))
    const frame = screen.getByTitle('Intentionally broken Responsive layout example')
    expect(frame).toHaveAttribute('sandbox', '')
    expect(frame).toHaveAttribute('tabindex', '-1')
    expect(frame.getAttribute('srcdoc')).toContain("form-action 'none'")
    expect(frame.getAttribute('srcdoc')).not.toContain('<script')
  })
  it('copies the displayed code', async () => {
    const user = userEvent.setup()
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<Lab />)
    await user.click(screen.getByRole('button', { name: 'View code' }))
    await user.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(write).toHaveBeenCalledWith(repairSource('layout'))
    expect(screen.getByText('Copied to clipboard')).toBeVisible()
  })
  it('explains how to copy if clipboard permissions are unavailable', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'))
    render(<Lab />)
    await user.click(screen.getByRole('button', { name: 'View code' }))
    await user.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(screen.getByText(/Clipboard unavailable/)).toBeVisible()
  })
  it('renders original fixture code when Before is selected', async () => {
    const user = userEvent.setup()
    render(<Lab />)
    await user.click(screen.getByRole('button', { name: 'Before' }))
    await user.click(screen.getByRole('button', { name: 'View code' }))
    expect(screen.getByRole('code')).toHaveTextContent('grid-template-columns:repeat(3,280px)')
  })
  it('rejects missing source markers rather than showing invented code', () => {
    expect(() => extractSection('no markers', 'unknown')).toThrow('Missing source section')
  })
})
