import "../styles/hero.css";
import { useEffect, useState, useRef } from "react";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";
import { Link } from "react-router-dom";

const builder = imageUrlBuilder(client);
// Interval for auto-advancing slides (in milliseconds)
// Note: This should match the animation duration in CSS for the progress bar in hero.css
const INTERVAL = 10000;

export default function Hero() {
	const [works, setWorks] = useState([]);
	const [heroTitle, setHeroTitle] = useState("");
	const [current, setCurrent] = useState(0);
	const [timerKey, setTimerKey] = useState(0);
	const videoRefs = useRef({});

	useEffect(() => {
		Promise.all([
			client.fetch(
				`*[_type == "work" && featured == true] | order(orderRank asc) { _id, projectId, title, client, category, thumbnail, video { asset->{url} } }`,
			),
			client.fetch(`*[_type == "hero"][0]{ title }`),
		])
			.then(([workData, heroData]) => {
				setWorks(workData);
				if (heroData?.title) setHeroTitle(heroData.title);
			})
			.catch(() => {});
	}, []);

	// Play active video, pause all others
	useEffect(() => {
		Object.entries(videoRefs.current).forEach(([idx, video]) => {
			if (!video) return;
			if (Number(idx) === current) {
				video.currentTime = 0;
				video.play().catch(() => {});
			} else {
				video.pause();
			}
		});
	}, [current, works.length]);

	// Auto-advance — restarts whenever timerKey changes (manual navigation)
	useEffect(() => {
		if (works.length < 2) return;
		const id = setInterval(
			() => setCurrent((c) => (c + 1) % works.length),
			INTERVAL,
		);
		return () => clearInterval(id);
	}, [works.length, timerKey]);

	const go = (index) => {
		setCurrent((index + works.length) % works.length);
		setTimerKey((k) => k + 1);
	};

	const slide = works[current];

	return (
		<section className="hero">
			{/* Video wrap — full-bleed on desktop, 16:9 on mobile */}
			<div className="hero-video-wrap">
				{works.map((w, i) => {
					const thumbUrl = w.thumbnail
						? builder
								.image(w.thumbnail)
								.width(2400)
								.height(1350)
								.fit("crop")
								.auto("format")
								.url()
						: null;
					return (
						<div
							key={w._id}
							className={`hero-slide${i === current ? " hero-slide-active" : ""}`}
						>
							{w.video?.asset?.url ? (
								<video
									ref={(el) => {
										videoRefs.current[i] = el;
									}}
									src={w.video.asset.url}
									className="hero-slide-video"
									muted
									playsInline
									loop
								/>
							) : thumbUrl ? (
								<div
									className="hero-slide-bg"
									style={{ backgroundImage: `url(${thumbUrl})` }}
								/>
							) : null}
						</div>
					);
				})}

				<div className="hero-gradient" />

				{/* Persistent studio title */}
				<div className="hero-studio">
					<span className="hero-studio-title">{heroTitle}</span>
				</div>
			</div>

			{/* Per-slide content */}
			<div className="hero-content">
				<div className="hero-left" key={current}>
					{slide && (
						<>
							<div className="hero-badge">
								<span className="hero-badge-pill">
									{slide.category || "Work"}
								</span>
								{slide.client && (
									<span className="hero-badge-label">{slide.client}</span>
								)}
							</div>
							<p className="hero-slide-title">{slide.title}</p>
							<Link to={`/work/${slide.projectId}`} className="hero-cta">
								View Project ↗
							</Link>
						</>
					)}
				</div>

				<div className="hero-right">
					<div className="hero-counter">
						<span className="hero-counter-current">
							{String(current + 1).padStart(2, "0")}
						</span>
						<span>&nbsp;/&nbsp;</span>
						<span>{String(works.length).padStart(2, "0")}</span>
					</div>
					<div className="hero-nav">
						<button
							className="hero-nav-btn"
							onClick={() => go(current - 1)}
							aria-label="Previous"
						>
							‹
						</button>
						<button
							className="hero-nav-btn"
							onClick={() => go(current + 1)}
							aria-label="Next"
						>
							›
						</button>
					</div>
					<div className="hero-dots">
						{works.map((_, i) => (
							<button
								key={i}
								className={`hero-dot${i === current ? " hero-dot-active" : ""}`}
								onClick={() => go(i)}
								aria-label={`Go to slide ${i + 1}`}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Progress bar */}
			<div className="hero-progress">
				<div key={current} className="hero-progress-fill hero-progress-fill-running" />
			</div>
		</section>
	);
}
