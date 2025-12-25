import { useState } from 'react'
import emailjs from 'emailjs-com'
import { useSectionAnimation } from '../hooks/useSectionAnimation'


function Contact() {
  const { ref: sectionRef, animateClass } = useSectionAnimation({ threshold: 0.2 })
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required.'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.'
    }
    if (!form.message.trim()) newErrors.message = 'Message is required.'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setSubmitted(false)
    setSendError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setSendError('Email is not configured. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.')
      return
    }

    setSending(true)
    setSendError('')

    try {
      await emailjs.send(serviceId, templateId, {
        from_name: form.name,
        reply_to: form.email,
        to_email: 'danajakulathunga3@gmail.com',
        message: form.message,
      }, publicKey)

      setSubmitted(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      const detail = err?.text || err?.message || 'Unknown error'
      setSendError('Unable to send right now. Please verify your EmailJS service/template/public key and template fields (from_name, reply_to, to_email, message).')
      console.error('Email send error', detail)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <section
        id="contact"
        ref={sectionRef}
        className={`section contact-section ${animateClass}`}
      >
        <div className="container contact-container">
          <div className="section-header">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle">
              Have a project in mind or just want to say hello? Send a message
              using the form below.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project or idea..."
              />
              {errors.message && (
                <p className="field-error">{errors.message}</p>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              {sending ? 'Sending...' : 'Send Message'}
            </button>

            {sendError && <p className="field-error">{sendError}</p>}
            {submitted && !sendError && (
              <p className="form-success">Message sent! I will get back to you soon.</p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

export default Contact


