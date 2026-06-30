import "../styles/ctaband.css";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

export default function CtaBand() {
	const sectionRef = useRef(null);
	const [drawn, setDrawn] = useState(false);

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setDrawn(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.3 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className="ctaband" ref={sectionRef}>
			<div className="ctaband-grain" aria-hidden="true" />
			<div className="ctaband-inner">
				<div className="ctaband-left">
					<p className="ctaband-eyebrow">
						<span className="ctaband-hyodo">효도</span>
						{" · A story worth keeping?"}
					</p>
					<h2 className="ctaband-headline">
						Let&rsquo;s make it
						<br />
						<span className="ctaband-outline">
							last.
							<svg
								className={`ctaband-brush${drawn ? " ctaband-brush-drawn" : ""}`}
								viewBox="0 0 300 22"
								preserveAspectRatio="none"
								aria-hidden="true"
							>
								<path
									d="M 2,11 C 15,7 40,4 80,4.5 C 125,5 162,7 200,6 C 248,4.5 272,7 299,9.5 L 299,14 C 272,15.5 248,16 200,14 C 162,13 125,14.5 80,15 C 40,15.5 15,13.5 2,11 Z"
									fill="var(--accent)"
								/>
							</svg>
						</span>
					</h2>
				</div>
				<div className="ctaband-divider" aria-hidden="true" />
				<div className="ctaband-right">
					<p className="ctaband-right-label">Email</p>
					<a href="mailto:hello@hyodoproductions.com" className="ctaband-email">
						hello@hyodoproductions.com
					</a>
					<Link to="/contact" className="ctaband-btn">
						<span>Contact Us</span>
						<span className="ctaband-arrow">↗</span>
					</Link>
					<p className="ctaband-location">Los Angeles / Worldwide</p>
				</div>
			</div>
		</section>
	);
}
