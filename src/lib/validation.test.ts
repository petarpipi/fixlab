import { describe, expect, it } from 'vitest'
import { validateInquiry } from './validation'

const valid = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  brief: 'My mobile grid needs a repair.',
}

describe('inquiry validation', () => {
  it('accepts a complete inquiry', () => expect(validateInquiry(valid)).toEqual({}))
  it('rejects all empty fields', () =>
    expect(Object.keys(validateInquiry({ name: '', email: '', brief: '' }))).toEqual([
      'name',
      'email',
      'brief',
    ]))
  it('rejects whitespace-only content', () =>
    expect(
      Object.keys(validateInquiry({ name: '   ', email: ' ', brief: '             ' })),
    ).toHaveLength(3))
  it.each(['alex', 'alex@', '@example.com', 'alex@example', 'a b@example.com'])(
    'rejects malformed email %s',
    (email) => expect(validateInquiry({ ...valid, email }).email).toBeDefined(),
  )
  it('accepts surrounding whitespace and a plus-address', () =>
    expect(validateInquiry({ ...valid, email: '  alex+lab@example.co.uk  ' })).toEqual({}))
  it('requires a useful name and brief', () =>
    expect(validateInquiry({ ...valid, name: 'A', brief: 'Fix it' })).toMatchObject({
      name: expect.any(String),
      brief: expect.any(String),
    }))
})
