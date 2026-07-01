import "../styles/processband.css";

const STAGES = [
	{
		num: "01",
		title: "Pre-production",
		desc: "Story, script and treatment shaped with you before a single frame is shot.",
		icon: (
			<svg
				className="process-icon"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M12 20h9" />
				<path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
			</svg>
		),
	},
	{
		num: "02",
		title: "Production",
		desc: "Director-led shoots with a crew we vouch for, on budgets we hold to.",
		icon: (
			<svg
				className="process-icon"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="9" />
				<path d="M12 3v9l6.4 6.4" />
				<path d="M21 12h-9L5.6 5.6" />
				<path d="M3.5 16.5 12 12l3.5 8.1" />
			</svg>
		),
	},
	{
		num: "03",
		title: "Post",
		desc: "Fine-tuning the edit, color and sound design to deliver the desired impact.",
		icon: (
			<svg
				className="process-icon"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				aria-hidden="true"
			>
				<line x1="4" y1="10" x2="4" y2="14" />
				<line x1="8.5" y1="6" x2="8.5" y2="18" />
				<line x1="13" y1="9" x2="13" y2="15" />
				<line x1="17.5" y1="4" x2="17.5" y2="20" />
				<line x1="22" y1="8" x2="22" y2="16" />
			</svg>
		),
	},
];

export default function ProcessBand() {
	return (
		<section className="process">
			<div className="process-inner">
				<div className="process-header">
					<div className="process-header-left">
						<span className="process-eyebrow">[ The process ]</span>
						<h2 className="process-headline">From script to screen</h2>
					</div>
					<p className="process-tagline">
						Our team works with you from pre-production through post to make
						sure your vision is executed the way you want it.
					</p>
				</div>

				<div className="process-scrubber-wrap">
					<div className="process-scrubber-track">
						<div className="process-scrubber-bar" />
					</div>
					<div className="process-grid">
						{STAGES.map((s) => (
							<div key={s.num} className="process-cell">
								<div className="process-cell-header">
									<span className="process-num">{s.num}</span>
									{s.icon}
								</div>
								<h3 className="process-stage-title">{s.title}</h3>
								<p className="process-stage-desc">{s.desc}</p>
							</div>
						))}
					</div>
				</div>

				<div className="process-meta">
					<span>Director-led</span>
					<span className="process-slash">/</span>
					<span>In-house, pre-production through post</span>
				</div>
			</div>
		</section>
	);
}
