import { useRef, useState, type FormEvent } from 'react'
import { formatContactMessage, type ContactPayload } from '../data/contact'

type SubmissionState = 'idle' | 'working' | 'sent' | 'copied' | 'error'

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const field = document.createElement('textarea')
  field.value = value
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.append(field)
  field.select()
  const copied = document.execCommand('copy')
  field.remove()

  if (!copied) throw new Error('Copy was not available')
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle')
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.reportValidity()) return

    const formData = new FormData(form)
    const payload: ContactPayload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      projectType: String(formData.get('projectType') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    }

    setSubmissionState('working')

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, source: window.location.href }),
        })

        if (!response.ok) throw new Error('Contact endpoint rejected the request')
        setSubmissionState('sent')
      } else {
        await copyText(formatContactMessage(payload))
        setSubmissionState('copied')
      }

      formRef.current?.reset()
    } catch {
      setSubmissionState('error')
    }
  }

  return (
    <form className="contact-form" ref={formRef} onSubmit={submit}>
      <div className="contact-form-heading">
        <h3>Start with a short brief</h3>
        <p>
          {endpoint
            ? 'Your details are sent only when you submit this form.'
            : 'This version copies your inquiry locally; no form data leaves the page.'}
        </p>
      </div>

      <div className="contact-field-row">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required maxLength={80} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={160} />
        </label>
      </div>

      <label>
        <span>Project type</span>
        <select name="projectType" defaultValue="" required>
          <option value="" disabled>Select one</option>
          <option>Interactive website</option>
          <option>React product</option>
          <option>Telegram experience</option>
          <option>AI integration</option>
          <option>Something unusual</option>
        </select>
      </label>

      <label>
        <span>What should we build?</span>
        <textarea name="message" rows={4} required minLength={20} maxLength={1200} />
      </label>

      <button type="submit" disabled={submissionState === 'working'}>
        {submissionState === 'working'
          ? 'Preparing…'
          : endpoint
            ? 'Send inquiry'
            : 'Copy inquiry'}
      </button>

      <p className="contact-form-status" role="status" aria-live="polite">
        {submissionState === 'sent' && 'Thanks — your inquiry has been sent.'}
        {submissionState === 'copied' && 'Inquiry copied. Paste it into your preferred message channel.'}
        {submissionState === 'error' && 'That did not work. Please use the GitHub link below.'}
      </p>
    </form>
  )
}
