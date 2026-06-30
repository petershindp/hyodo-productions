import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import "../styles/about.css";
import { useState, useEffect } from "react";
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


export default function AboutPage() {
	useSEO({
		title: "About",
		description:
			"Hyodo Productions is an independent production company working across film, commercials and music videos — story first, built to last.",
		path: "/about",
	});

	const [stills, setStills] = useState([]);

	useEffect(() => {
		client
			.fetch(`*[_type == "hero"][0]{ btsPhotos }`)
			.then((hero) => {
				setStills(hero?.btsPhotos || []);
			})
			.catch(() => {});
	}, []);

	return (
		<div>
			<TopNav />
			<div className="about-page">
				{/* Eyebrow + headline */}
				<span className="about-eyebrow">[ About / Studio ]</span>
				<h1 className="about-title">
					We {<span className="about-accent">build legacy</span>} through
					authentic human stories.
				</h1>

				{/* Who we are */}
				<div className="about-who">
					<span className="about-who-label">Who we are</span>
					<p className="about-who-text">
						Hyodo Productions is an independent production company working
						across film, commercials and music videos. We're the children of
						first-generation immigrants — raised to carry forward what our
						parents quietly built. We make films the same way: as keepers of a
						story, responsible for the people who trusted us with it.
					</p>
				</div>

				{/* The name — dark band */}
				<div className="about-name-band">
					<div className="about-name-left">
						<span className="about-name-eyebrow">The name</span>
						<div className="about-name-korean">효도</div>
						<div className="about-name-roman">Hyo·do</div>
						<div className="about-name-def">
							Korean (n.)
							<br />
							filial devotion ·<br />
							honoring one's parents
						</div>
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
				</div>

				{/* BTS galaxy mosaic / placeholder */}
				{stills.length > 0 ? (
					<div className="about-mosaic">
						{stills.map((img, i) => (
							<div key={img._key || i} className="about-mosaic-item">
								<img
									src={builder.image(img).width(900).auto("format").url()}
									alt=""
									loading="lazy"
								/>
							</div>
						))}
					</div>
				) : (
					<div className="about-studio-img">
						<span className="about-studio-img-label">
							Studio / Team Photo — drop image here
						</span>
					</div>
				)}

				{/* What we do */}
				<div className="about-services-header">
					<h2 className="about-services-title">What we do</h2>
					<span className="about-services-count">03 / Disciplines</span>
				</div>
				{SERVICES.map((s) => (
					<div key={s.n} className="about-service-row">
						<span className="about-service-n">{s.n}</span>
						<span className="about-service-name">{s.title}</span>
						<span className="about-service-desc">{s.desc}</span>
					</div>
				))}
			</div>
			<Footer />
		</div>
	);
}
