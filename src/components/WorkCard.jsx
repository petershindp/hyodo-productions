import { useRef, useState } from "react";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";
import { Link } from "react-router-dom";

const builder = imageUrlBuilder(client);

export default function WorkCard({ projectId, title, meta, still, videoUrl }) {
	const videoRef = useRef(null);
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
		if (videoRef.current) {
			videoRef.current.currentTime = 0;
			videoRef.current.play();
		}
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.currentTime = 0;
		}
	};

	// Resize still image to 1600x900 (2x visible size for quality) with JPEG optimization
	const stillUrl = still
		? builder.image(still).width(1600).height(900).auto("format").url()
		: null;

	return (
		<Link to={`/work/${projectId}`} className="card-link">
			<div
				className="card"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{still && !isHovered ? (
					<img className="card-image" src={stillUrl} alt={title} />
				) : null}
				{videoUrl ? (
					<video
						ref={videoRef}
						className="card-video"
						src={videoUrl}
						muted
						playsInline
					/>
				) : (
					<div className="card-placeholder">Loading...</div>
				)}
				<div className="overlay">
					<h3>{title}</h3>
					<p>{meta}</p>
				</div>
			</div>
		</Link>
	);
}
