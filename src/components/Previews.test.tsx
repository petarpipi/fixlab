import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Preview } from './Previews'

describe('repaired interactions', () => {
  it('reports each invalid field and focuses the first one', async () => {
    const user = userEvent.setup()
    render(<Preview id="validation" />)
    await user.click(screen.getByRole('button', { name: 'Validate inquiry' }))
    expect(screen.getByLabelText('Name')).toHaveFocus()
    for (const label of ['Name', 'Email', 'Project brief']) {
      expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByLabelText(label)).toHaveAccessibleDescription()
    }
  })
  it('validates a complete inquiry and resets on retry', async () => {
    const user = userEvent.setup()
    render(<Preview id="validation" />)
    await user.type(screen.getByLabelText('Name'), 'Alex Morgan')
    await user.type(screen.getByLabelText('Email'), 'alex@example.com')
    await user.type(screen.getByLabelText('Project brief'), 'Fix my mobile navigation.')
    await user.click(screen.getByRole('button', { name: 'Validate inquiry' }))
    expect(screen.getByRole('status')).toHaveTextContent('No data was sent or stored')
    expect(screen.getByRole('heading', { name: 'That’s a well-formed inquiry.' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByLabelText('Name')).toHaveFocus()
  })
  it('opens sample navigation, selects a page, and closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Preview id="navigation" />)
    const trigger = screen.getByRole('button', { name: 'Sample navigation' })
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Studio' }))
    expect(screen.getByRole('heading', { name: 'Small studio. Big ideas.' })).toBeVisible()
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
  it('updates the selected repair and prevents redundant saves', async () => {
    const user = userEvent.setup()
    render(<Preview id="components" />)
    await user.selectOptions(screen.getByLabelText('Repair type'), 'Form validation')
    await user.click(screen.getByRole('button', { name: 'Save repair' }))
    expect(screen.getByRole('status')).toHaveTextContent('Form validation saved')
    const saved = screen.getByRole('button', { name: 'Saved' })
    expect(saved).toHaveAttribute('aria-disabled', 'true')
    expect(saved).toHaveFocus()
    await user.selectOptions(screen.getByLabelText('Repair type'), 'Accessible navigation')
    expect(screen.getByRole('button', { name: 'Save repair' })).toHaveAttribute(
      'aria-disabled',
      'false',
    )
  })
})
