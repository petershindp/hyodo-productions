import { useState } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import "../styles/contact.css";
import { useSEO } from "../hooks/useSEO";

const CONTACTS = [
	{
		label: "New business",
		value: "hello@hyodoproductions.com",
		href: "mailto:hello@hyodoproductions.com",
	},
	{ label: "Studio", value: "Los Angeles, CA", href: null },
];

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
		<div>
			<TopNav />
			<div className="contact-page">
				<div>
					<span className="contact-eyebrow">[ Contact ]</span>
					<h1 className="contact-title">
						Let&rsquo;s make
						<br />
						something
						<br />
						<span className="contact-accent">lasting.</span>
					</h1>
					<div className="contact-info">
						{CONTACTS.map((c) => (
							<div key={c.label}>
								<div className="contact-info-label">{c.label}</div>
								{c.href ? (
									<a href={c.href} className="contact-info-value">
										{c.value}
									</a>
								) : (
									<span className="contact-info-value">{c.value}</span>
								)}
							</div>
						))}
					</div>
				</div>

				<form className="contact-form" onSubmit={handleSubmit}>
					<div className="contact-form-label">Start a project</div>

					{status === "success" ? (
						<div className="contact-form-success">
							Thanks — we&rsquo;ll be in touch soon.
						</div>
					) : (
						<>
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
								{status === "sending" ? "Sending…" : "Send inquiry ↗"}
							</button>
						</>
					)}
				</form>
			</div>
			<Footer />
		</div>
	);
}
