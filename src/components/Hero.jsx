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
	const ghostVideoRef = useRef(null);
	const rafRef = useRef(null);
	const heroVisibleRef = useRef(true);
	const maskOpacityRef = useRef(1);
	const [reelVideoUrl, setReelVideoUrl] = useState("/hero-reel.mp4");
	const [reelLink, setReelLink] = useState(null);
	const [logo, setLogo] = useState(null);
	const [logoReady, setLogoReady] = useState(false);
	const [heroDataLoaded, setHeroDataLoaded] = useState(false);
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
			.catch(() => {})
			.finally(() => setHeroDataLoaded(true));
	}, []);

	const logoUrl = logo ? builder.image(logo).height(1080).auto("format").url() : null;
	const logoDimensions = logo?.asset?.metadata?.dimensions;
	const logoAspectRatio = logoDimensions
		? logoDimensions.width / logoDimensions.height
		: 3;

	// Preload the mask image fully before revealing it, so the crossfade
	// never shows a half-downloaded/blank mask.
	useEffect(() => {
		if (!logoUrl) {
			setLogoReady(false);
			return;
		}
		setLogoReady(false);
		const img = new Image();
		img.onload = () => setLogoReady(true);
		img.src = logoUrl;
		return () => {
			img.onload = null;
		};
	}, [logoUrl]);

	// Ghost reel only needs to play while it's actually visible — paused
	// once the black mask has fully lifted (--mask reaches 0) or the hero
	// scrolls out of view, so it's not decoding/blurring an invisible video.
	const updateGhostPlayback = () => {
		const ghost = ghostVideoRef.current;
		if (!ghost) return;
		const shouldPlay = heroVisibleRef.current && maskOpacityRef.current > 0;
		if (shouldPlay && ghost.paused) ghost.play().catch(() => {});
		if (!shouldPlay && !ghost.paused) ghost.pause();
	};

	useEffect(() => {
		if (prefersReduced.current) {
			setScrollVals(getScrollVals(1, true));
			maskOpacityRef.current = 0;
			sectionRef.current?.style.setProperty("--mask", "0");
			updateGhostPlayback();
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
				const vals = getScrollVals(p, false);
				setScrollVals(vals);
				// Ghost reel + light leak read their opacity from this custom
				// property in CSS (see hero.css), instead of a React-driven
				// inline style, so they don't force an extra render per frame.
				maskOpacityRef.current = vals.maskOpacity;
				el.style.setProperty("--mask", vals.maskOpacity.toFixed(3));
				updateGhostPlayback();
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

	// Pause the ghost reel entirely when the hero scrolls out of view.
	useEffect(() => {
		const el = sectionRef.current;
		if (!el || typeof IntersectionObserver === "undefined") return;
		const observer = new IntersectionObserver(([entry]) => {
			heroVisibleRef.current = entry.isIntersecting;
			updateGhostPlayback();
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// Keep the ghost reel's playback roughly in sync with the main reel so
	// cuts line up — exact sync doesn't matter at this blur level.
	useEffect(() => {
		const main = videoRef.current;
		const ghost = ghostVideoRef.current;
		if (!main || !ghost) return;
		const resync = () => {
			if (Math.abs(ghost.currentTime - main.currentTime) > 0.15) {
				ghost.currentTime = main.currentTime;
			}
		};
		main.addEventListener("play", resync);
		main.addEventListener("seeked", resync);
		const interval = setInterval(resync, 5000);

		// The browser's own autoplay can win a race against our imperative
		// pause() in updateGhostPlayback() (e.g. reduced motion, where --mask
		// is always 0 from the first render). Re-assert the pause if it does.
		const guardAutoplay = () => {
			if (!(heroVisibleRef.current && maskOpacityRef.current > 0)) ghost.pause();
		};
		ghost.addEventListener("play", guardAutoplay);

		return () => {
			main.removeEventListener("play", resync);
			main.removeEventListener("seeked", resync);
			ghost.removeEventListener("play", guardAutoplay);
			clearInterval(interval);
		};
	}, [reelVideoUrl]);

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
						style={{ transform: `scale(${scrollVals.reelScale}) translateZ(0)` }}
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
								opacity: logoReady ? 1 : 0,
								WebkitMaskImage: `url(${logoUrl})`,
								maskImage: `url(${logoUrl})`,
								aspectRatio: logoAspectRatio,
								transform: `scale(${scrollVals.textScale}) translateZ(0)`,
							}}
						/>
					) : (
						heroDataLoaded && (
							<span
								className="hero-reel-word"
								style={{ transform: `scale(${scrollVals.textScale}) translateZ(0)` }}
							>
								HYODO
							</span>
						)
					)}
				</div>

				{reelVideoUrl && (
					<div className="hero-reel-ghost" aria-hidden="true">
						<video
							ref={ghostVideoRef}
							className="hero-reel-ghost-video"
							src={reelVideoUrl}
							autoPlay
							muted
							loop
							playsInline
						/>
					</div>
				)}

				<div className="hero-reel-leak" aria-hidden="true">
					<div className="hero-reel-leak-breathe">
						<div className="hero-reel-leak-blob hero-reel-leak-blob-a">
							<div className="hero-reel-leak-blob-inner hero-reel-leak-blob-a-inner" />
						</div>
						<div className="hero-reel-leak-blob hero-reel-leak-blob-b">
							<div className="hero-reel-leak-blob-inner hero-reel-leak-blob-b-inner" />
						</div>
					</div>
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
