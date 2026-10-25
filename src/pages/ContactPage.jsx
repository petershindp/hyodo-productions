import { useState } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import "../styles/contact.css";
import { useSEO } from "../hooks/useSEO";

const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

export default function ContactPage() {
	useSEO({
		title: "Contact",
		description:
			"Get in touch with Hyodo Productions to start your next film, commercial or music video project.",
		path: "/contact",
	});

	const [fields, setFields] = useState({
		name: "",
		email: "",
		company: "",
		project: "",
	});
	const [status, setStatus] = useState("idle"); // idle | sending | success | error

	const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus("sending");
		try {
			const res = await fetch(ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json", Accept: "application/json" },
				body: JSON.stringify({
					name: fields.name,
					email: fields.email,
					company: fields.company || undefined,
					message: fields.project,
				}),
			});
			if (res.ok) {
				setStatus("success");
			} else {
				setStatus("error");
			}
		} catch {
			setStatus("error");
		}
	};

	return (
		<div className="contact-root">
			<TopNav />

			<div className="contact-page">
				{/* ── Left column ── */}
				<div className="contact-left">
					<p className="contact-eyebrow">Contact</p>
					<h1 className="contact-title">
						Let&rsquo;s make
						<br />
						something
						<br />
						<span className="contact-accent">lasting.</span>
					</h1>

					<dl className="contact-info">
						<div className="contact-info-entry">
							<dt className="contact-info-label">New business</dt>
							<dd className="contact-info-value">
								<a href="mailto:hello@hyodoproductions.com">
									hello@hyodoproductions.com
								</a>
							</dd>
						</div>
						<div className="contact-info-entry">
							<dt className="contact-info-label">Studio</dt>
							<dd className="contact-info-value">Los Angeles, CA</dd>
						</div>
						<div className="contact-info-entry">
							<dt className="contact-info-label">Follow</dt>
							<dd className="contact-info-value">
								<a
									href="https://www.instagram.com/hyodoproductions/"
									target="_blank"
									rel="noopener noreferrer"
								>
									@hyodoproductions
								</a>
							</dd>
						</div>
					</dl>
				</div>

				{/* ── Right column / form ── */}
				<div className="contact-right">
					<h2 className="contact-form-heading" id="start-title">
						Start a project
					</h2>

					{status === "success" ? (
						<div className="contact-success">
							<h2 className="contact-success-title">
								Thank you.
								<br />
								<span className="contact-success-accent">We'll be in touch.</span>
							</h2>
							<button
								type="button"
								className="contact-send-another"
								onClick={() => {
									setFields({ name: "", email: "", company: "", project: "" });
									setStatus("idle");
								}}
							>
								Send another
							</button>
						</div>
					) : (
						<form className="contact-form" onSubmit={handleSubmit} aria-labelledby="start-title">
							<label className="contact-field">
								<span className="contact-field-label">Name</span>
								<input
									type="text"
									placeholder="Your name"
									className="contact-input"
									required
									value={fields.name}
									onChange={set("name")}
								/>
							</label>
							<label className="contact-field">
								<span className="contact-field-label">Email</span>
								<input
									type="email"
									placeholder="you@studio.com"
									className="contact-input"
									required
									value={fields.email}
									onChange={set("email")}
								/>
							</label>
							<label className="contact-field">
								<span className="contact-field-label">Company</span>
								<input
									type="text"
									placeholder="Optional"
									className="contact-input"
									value={fields.company}
									onChange={set("company")}
								/>
							</label>
							<label className="contact-field">
								<span className="contact-field-label">Project</span>
								<textarea
									rows={4}
									placeholder="Tell us about the story you want to tell…"
									className="contact-textarea"
									value={fields.project}
									onChange={set("project")}
								/>
							</label>

							{status === "error" && (
								<p className="contact-form-error">
									Something went wrong — please try again or email us directly.
								</p>
							)}

							<button
								type="submit"
								className="contact-submit"
								disabled={status === "sending"}
							>
								<span>{status === "sending" ? "Sending…" : "Send inquiry"}</span>
								<span aria-hidden="true">{'↗︎'}</span>
							</button>
						</form>
					)}
				</div>
			</div>

			<Footer />
		</div>
	);
}
