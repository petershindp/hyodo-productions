import "../styles/hero.css";
import { useEffect, useState } from "react";
import { client } from "../client";

export default function Hero() {
	const [hero, setHero] = useState(null);
	const [showTitle, setShowTitle] = useState(false);

	useEffect(() => {
		client
			.fetch(`*[_type == "hero"][0]{ title, reel { asset->{url} } }`)
			.then(setHero);
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => setShowTitle(true), 500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="hero-container">
			<section className="hero">
				{hero ? (
					<>
						<video
							className="hero-video"
							src={hero.reel.asset.url}
							autoPlay
							muted
							loop
							playsInline
						/>
						<h1
							className={`hero-title ${showTitle ? "hero-title-visible" : ""}`}
						>
							{hero.title.split(" ").map((word, i) => (
								<span key={i} className="hero-title-word">
									{word}
								</span>
							))}
						</h1>
					</>
				) : (
					<div className="hero-loading" />
				)}
			</section>
		</div>
	);
}
