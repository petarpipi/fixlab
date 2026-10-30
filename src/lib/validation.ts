export interface Inquiry {
  name: string
  email: string
  brief: string
}

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>

// fixlab:start validation
export function validateInquiry(values: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {}
  if (values.name.trim().length < 2) {
    errors.name = 'Enter at least 2 characters for your name.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email, like alex@example.com.'
  }
  if (values.brief.trim().length < 10) {
    errors.brief = 'Add at least 10 characters about your project.'
  }
  return errors
}
// fixlab:end validation
