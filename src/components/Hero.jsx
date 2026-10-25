import "../styles/hero.css";
import { useState, useEffect, useRef } from "react";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

function clamp(v, min = 0, max = 1) {
	return Math.min(max, Math.max(min, v));
}

export default function Hero() {
	const sectionRef = useRef(null);
	const videoRef = useRef(null);
	const rafRef = useRef(null);
	const [reelVideoUrl, setReelVideoUrl] = useState("/hero-reel.mp4");
	const [reelLink, setReelLink] = useState(null);
	const [logo, setLogo] = useState(null);
	const [scrollVals, setScrollVals] = useState(() => getScrollVals(0, false));
	const prefersReduced = useRef(
		typeof window !== "undefined" &&
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
	);

	useEffect(() => {
		client
			.fetch(
				`*[_type == "hero"][0]{ reelVideo{ asset->{url} }, reelLink, footerLogo{..., asset->{_id, metadata{dimensions}}} }`,
			)
			.then((data) => {
				if (data?.reelVideo?.asset?.url) setReelVideoUrl(data.reelVideo.asset.url);
				if (data?.reelLink) setReelLink(data.reelLink);
				if (data?.footerLogo) setLogo(data.footerLogo);
			})
			.catch(() => {});
	}, []);

	const logoUrl = logo ? builder.image(logo).height(1080).auto("format").url() : null;
	const logoDimensions = logo?.asset?.metadata?.dimensions;
	const logoAspectRatio = logoDimensions
		? logoDimensions.width / logoDimensions.height
		: 3;

	useEffect(() => {
		if (prefersReduced.current) {
			setScrollVals(getScrollVals(1, true));
			return;
		}

		const onScroll = () => {
			if (rafRef.current) return;
			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;
				const el = sectionRef.current;
				if (!el) return;
				const stage = window.innerHeight;
				const range = el.getBoundingClientRect().height - stage;
				const p = range > 0 ? clamp(-el.getBoundingClientRect().top / range) : 0;
				setScrollVals(getScrollVals(p, false));
			});
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, []);

	return (
		<section className="hero-reel" ref={sectionRef} aria-label="Showreel">
			<div className="hero-reel-stage">
				{reelVideoUrl && (
					<video
						ref={videoRef}
						className="hero-reel-video"
						src={reelVideoUrl}
						autoPlay
						muted
						loop
						playsInline
						style={{ transform: `scale(${scrollVals.reelScale})` }}
					/>
				)}

				<div
					className="hero-reel-mask"
					aria-hidden="true"
					style={{ opacity: scrollVals.maskOpacity }}
				>
					{logoUrl ? (
						<span
							className="hero-reel-logo"
							style={{
								WebkitMaskImage: `url(${logoUrl})`,
								maskImage: `url(${logoUrl})`,
								aspectRatio: logoAspectRatio,
								transform: `scale(${scrollVals.textScale})`,
							}}
						/>
					) : (
						<span
							className="hero-reel-word"
							style={{ transform: `scale(${scrollVals.textScale})` }}
						>
							HYODO
						</span>
					)}
				</div>

				<div className="hero-reel-caption" style={{ opacity: scrollVals.captionOpacity }}>
					<span>Driven by story. Crafted to last.</span>
					<span>Film · Commercials · Music Videos</span>
					<span>Scroll ↓</span>
				</div>

				{reelLink && (
					<div
						className="hero-reel-cta"
						style={{
							opacity: scrollVals.ctaOpacity,
							pointerEvents: scrollVals.ctaOpacity > 0.5 ? "auto" : "none",
						}}
					>
						<a
							href={reelLink}
							target="_blank"
							rel="noopener noreferrer"
							className="hero-reel-cta-btn"
						>
							<svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
								<path d="M1 1 L11 7 L1 13 Z" />
							</svg>
							Watch the full reel
						</a>
					</div>
				)}
			</div>
		</section>
	);
}

function getScrollVals(p, reduced) {
	if (reduced) {
		return { reelScale: 1, maskOpacity: 0, textScale: 1, captionOpacity: 0, ctaOpacity: 1 };
	}
	return {
		reelScale: 1.12 - 0.12 * p,
		maskOpacity: 1 - clamp((p - 0.4) / 0.4),
		textScale: 1 + Math.pow(p, 1.6) * 2.2,
		captionOpacity: clamp(1 - p * 3),
		ctaOpacity: clamp((p - 0.75) / 0.2),
	};
}
