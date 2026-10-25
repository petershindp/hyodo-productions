import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import "../styles/about.css";
import { useState, useEffect, useRef } from "react";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";
import { useSEO } from "../hooks/useSEO";

const builder = imageUrlBuilder(client);

const SERVICES = [
	{
		n: "01",
		title: "Film",
		desc: "Narrative features and short films, from development through post — director-led, and made to be worth keeping.",
	},
	{
		n: "02",
		title: "Commercials",
		desc: "Brand films that honor what a company was actually built to be — concept to final grade.",
	},
	{
		n: "03",
		title: "Music Videos",
		desc: "Artist-first visuals built around the song, and the person behind it. Bold, fast, made to be rewatched.",
	},
];

const WHO_TEXT =
	"Hyodo Productions is an independent production company working across film, commercials and music videos. We're the children of first-generation immigrants — raised to carry forward what our parents quietly built. We make films the same way: as keepers of a story, responsible for the people who trusted us with it.";

function clamp(v, min = 0, max = 1) {
	return Math.min(max, Math.max(min, v));
}

function cubicOut(t) {
	return 1 - Math.pow(1 - clamp(t), 3);
}

// ── Sweep headline ──────────────────────────────────────────────
function SweepWord({ word, delay, prefersReduced }) {
	const [active, setActive] = useState(prefersReduced);

	useEffect(() => {
		if (prefersReduced) {
			setActive(true);
			return;
		}
		const t = setTimeout(() => setActive(true), 450 + delay);
		return () => clearTimeout(t);
	}, [delay, prefersReduced]);

	return (
		<span className={`about-sweep-word${active ? " about-sweep-word--active" : ""}`}>
			{word}
		</span>
	);
}

// ── Word-ink who-we-are ─────────────────────────────────────────
function WordInk({ text }) {
	const words = text.split(" ");
	const sectionRef = useRef(null);
	const rafRef = useRef(null);
	const [litCount, setLitCount] = useState(0);

	useEffect(() => {
		const onScroll = () => {
			if (rafRef.current) return;
			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;
				const el = sectionRef.current;
				if (!el) return;
				const vh = window.innerHeight;
				const rect = el.getBoundingClientRect();
				const p = clamp((vh * 0.85 - rect.top) / (rect.height + vh * 0.4));
				setLitCount(Math.round(p * words.length));
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
	}, [words.length]);

	return (
		<p className="about-who-text" ref={sectionRef}>
			{words.map((w, i) => (
				<span
					key={i}
					className={`about-word${i < litCount ? " about-word--lit" : ""}`}
				>
					{w}{" "}
				</span>
			))}
		</p>
	);
}

// ── 효도 focus-pull ─────────────────────────────────────────────
function KoreanName() {
	const sectionRef = useRef(null);
	const rafRef = useRef(null);
	const [vals, setVals] = useState([
		{ blur: 28, opacity: 0.1, scale: 1.18 },
		{ blur: 28, opacity: 0.1, scale: 1.18 },
	]);

	useEffect(() => {
		const onScroll = () => {
			if (rafRef.current) return;
			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;
				const el = sectionRef.current;
				if (!el) return;
				const vh = window.innerHeight;
				const rect = el.getBoundingClientRect();
				const pn = clamp((vh * 0.95 - rect.top) / (vh * 0.2));

				const focus = (q) => {
					const e = cubicOut(q);
					return {
						blur: (1 - e) * 28,
						opacity: 0.1 + 0.9 * e,
						scale: 1.18 - 0.18 * e,
					};
				};

				setVals([
					focus(pn / 0.7),
					focus((pn - 0.3) / 0.7),
				]);
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
		<div className="about-korean" ref={sectionRef} aria-label="효도">
			{["효", "도"].map((char, i) => (
				<span
					key={char}
					className="about-korean-char"
					aria-hidden="true"
					style={{
						filter: `blur(${vals[i].blur}px)`,
						opacity: vals[i].opacity,
						transform: `scale(${vals[i].scale})`,
						display: "inline-block",
					}}
				>
					{char}
				</span>
			))}
		</div>
	);
}

// ── Mosaic parallax ─────────────────────────────────────────────
function Mosaic({ stills }) {
	const wrapRef = useRef(null);
	const rafRef = useRef(null);
	const [cols, setCols] = useState([[], [], []]);
	const [offsets, setOffsets] = useState([0, 0, 0]);

	useEffect(() => {
		const c = [[], [], []];
		stills.forEach((img, i) => c[i % 3].push(img));
		setCols(c);
	}, [stills]);

	useEffect(() => {
		const onScroll = () => {
			if (rafRef.current) return;
			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;
				const el = wrapRef.current;
				if (!el) return;
				const vh = window.innerHeight;
				const rect = el.getBoundingClientRect();
				const p = clamp((vh - rect.top) / (rect.height + vh));
				setOffsets([
					(p - 0.5) * -180,
					(p - 0.5) * 140,
					(p - 0.5) * -60,
				]);
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

	if (stills.length === 0) return null;

	return (
		<div className="about-mosaic" ref={wrapRef}>
			{cols.map((col, ci) => (
				<div
					key={ci}
					className="about-mosaic-col"
					style={{ transform: `translateY(${offsets[ci]}px)`, willChange: "transform" }}
				>
					{col.map((img, i) => (
						<img
							key={img._key || i}
							src={builder.image(img).width(900).auto("format").url()}
							alt=""
							className="about-mosaic-img"
							loading="lazy"
						/>
					))}
				</div>
			))}
		</div>
	);
}

// ── Page ────────────────────────────────────────────────────────
export default function AboutPage() {
	useSEO({
		title: "About",
		description:
			"Hyodo Productions is an independent production company working across film, commercials and music videos — driven by story, crafted to last.",
		path: "/about",
	});

	const [stills, setStills] = useState([]);
	const prefersReduced =
		typeof window !== "undefined" &&
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

	useEffect(() => {
		client
			.fetch(`*[_type == "hero"][0]{ btsPhotos }`)
			.then((hero) => setStills(hero?.btsPhotos || []))
			.catch(() => {});
	}, []);

	return (
		<div className="about-root">
			<TopNav />

			{/* ── Headline ── */}
			<section className="about-headline">
				<p className="about-eyebrow">About / Studio</p>
				<h1 className="about-title">
					We build legacy through{" "}
					<SweepWord word="authentic" delay={0} prefersReduced={prefersReduced} />{" "}
					<SweepWord word="human" delay={260} prefersReduced={prefersReduced} />{" "}
					<SweepWord word="stories" delay={520} prefersReduced={prefersReduced} />.
				</h1>
			</section>

			{/* ── Who we are ── */}
			<section className="about-who" id="about-who">
				<h2 className="about-who-label">Who we are</h2>
				<WordInk text={WHO_TEXT} />
			</section>

			{/* ── Mosaic ── */}
			{stills.length > 0 && (
				<section className="about-mosaic-section" id="about-mosaic">
					<Mosaic stills={stills} />
				</section>
			)}

			{/* ── 효도 name ── */}
			<section className="about-name-section" id="about-name">
				<div className="about-name-left">
					<span className="about-name-eyebrow">The name</span>
					<KoreanName />
					<p className="about-name-roman">Hyo·do</p>
				</div>
				<div className="about-name-right">
					<p className="about-name-quote">
						"Hyodo" is the Korean word for loving and honoring your parents.
					</p>
					<p className="about-name-body">
						In the same way our first-generation immigrant parents entrusted
						their dreams and visions to us, we set out to honor what they
						taught us — and to preserve the legacies and the visions of
						everyone we work with. That's the whole reason this studio exists.
					</p>
				</div>
			</section>

			{/* ── What we do ── */}
			<section className="about-services">
				<div className="about-services-header">
					<h2 className="about-services-title">What we do</h2>
				</div>
				<div className="about-services-grid">
					{SERVICES.map((s) => (
						<div key={s.n} className="about-service-card">
							<span className="about-service-n">{s.n}</span>
							<h3 className="about-service-name">{s.title}</h3>
							<p className="about-service-desc">{s.desc}</p>
						</div>
					))}
				</div>
			</section>

			<Footer dark />
		</div>
	);
}
