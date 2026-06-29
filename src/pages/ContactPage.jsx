import { useState } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import "../styles/contact.css";

const CONTACTS = [
  { label: "New business", value: "hello@hyodo.co", href: "mailto:hello@hyodo.co" },
  { label: "Press & festivals", value: "press@hyodo.co", href: "mailto:press@hyodo.co" },
  { label: "Studio", value: "Los Angeles, CA", href: null },
];

const FIELDS = [
  { label: "Name", ph: "Your name", type: "text", required: true },
  { label: "Email", ph: "you@studio.com", type: "email", required: true },
  { label: "Company", ph: "Optional", type: "text", required: false },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <TopNav />
      <div className="contact-page">
        <div>
          <span className="contact-eyebrow">[ Contact ]</span>
          <h1 className="contact-title">
            Let&rsquo;s make<br />something<br />
            <span className="contact-accent">lasting.</span>
          </h1>
          <div className="contact-info">
            {CONTACTS.map((c) => (
              <div key={c.label}>
                <div className="contact-info-label">{c.label}</div>
                {c.href ? (
                  <a href={c.href} className="contact-info-value">{c.value}</a>
                ) : (
                  <span className="contact-info-value">{c.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-label">Start a project</div>
          {submitted ? (
            <div className="contact-form-success">
              Thanks — we&rsquo;ll be in touch soon.
            </div>
          ) : (
            <>
              {FIELDS.map((f) => (
                <label key={f.label} className="contact-field">
                  <span className="contact-field-label">{f.label}</span>
                  <input
                    type={f.type}
                    placeholder={f.ph}
                    className="contact-input"
                    required={f.required}
                  />
                </label>
              ))}
              <label className="contact-field">
                <span className="contact-field-label">Project</span>
                <textarea
                  rows={4}
                  placeholder="Tell us about the story you want to tell…"
                  className="contact-textarea"
                />
              </label>
              <button type="submit" className="contact-submit">
                Send inquiry ↗
              </button>
            </>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}
