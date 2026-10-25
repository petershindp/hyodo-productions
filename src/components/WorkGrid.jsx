import "../styles/grid.css";
import { useState, useEffect, useRef } from "react";
import { client } from "../client";
import { Link } from "react-router-dom";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

const FILTERS = ["All", "Commercial", "Music Video", "Short Film", "Feature Film", "Documentary"];

function pad(n) {
	return String(n).padStart(2, "0");
}

function WorkTile({ item, index, total }) {
	const videoRef = useRef(null);
	const imgUrl = item.thumbnail
		? builder.image(item.thumbnail).width(2400).auto("format").url()
		: null;
	const videoUrl = item.video?.asset?.url || null;

	const handleEnter = () => {
		const v = videoRef.current;
		if (!v) return;
		v.currentTime = 0;
		v.play().catch(() => {});
	};

	const handleLeave = () => {
		const v = videoRef.current;
		if (!v) return;
		v.pause();
	};

	return (
		<article className="work-tile">
			<Link
				to={`/work/${item.projectId || "unknown"}`}
				className="work-tile-media"
				aria-label={`Open ${item.title}`}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
			>
				{imgUrl && (
					<img
						src={imgUrl}
						alt={`Still from ${item.title}`}
						className="work-tile-img"
						loading="lazy"
					/>
				)}
				{videoUrl && (
					<video
						ref={videoRef}
						className="work-tile-video"
						src={videoUrl}
						muted
						loop
						playsInline
						preload="none"
					/>
				)}
			</Link>
			<div className="work-tile-meta">
				<div className="work-tile-text">
					<h3 className="work-tile-title">{item.title}</h3>
					<p className="work-tile-info">
						<span className="work-tile-dot" aria-hidden="true" />
						<span>
							<span className="work-tile-category">{item.category}</span>
							{item.client ? ` / ${item.client}` : ""}
						</span>
					</p>
				</div>
				<span className="work-tile-counter">{pad(index + 1)} / {pad(total)}</span>
			</div>
		</article>
	);
}

export default function WorkGrid({ limit, heading = "Selected work", showFilters = false, allWork = false }) {
	const [work, setWork] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("All");

	useEffect(() => {
		const query = allWork
			? `*[_type == "work"] | order(orderRank asc) { _id, projectId, title, client, category, thumbnail, video{asset->{url}} }`
			: `*[_type == "work" && featured == true] | order(orderRank asc) { _id, projectId, title, client, category, thumbnail, video{asset->{url}} }`;
		client.fetch(query).then((data) => {
			setWork(data);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, [allWork]);

	const filtered = filter === "All" ? work : work.filter((p) => p.category === filter);
	const displayed = limit ? filtered.slice(0, limit) : filtered;

	const activeCategories = new Set(work.map((p) => p.category));
	const visibleFilters = FILTERS.filter((f) => f === "All" || activeCategories.has(f));

	return (
		<section id="work" className="work-section" style={{ maxWidth: "var(--max-w)", margin: "0 auto", boxSizing: "border-box", paddingTop: "clamp(64px, 8vw, 120px)" }}>
			<div className="work-section-header">
				<h2 className="work-section-title">{heading}</h2>
				<div className="work-filters" role="group" aria-label="Filter by category">
					{visibleFilters.map((f) => (
						<button
							key={f}
							type="button"
							className={`work-filter-btn${filter === f ? " work-filter-btn--active" : ""}`}
							onClick={() => setFilter(f)}
						>
							{f}
						</button>
					))}
				</div>
			</div>

			{loading ? (
				<div className={`work-tiles${allWork ? " work-tiles--grid" : ""}`}>
					{[...Array(limit || 4)].map((_, i) => (
						<div key={i} className="work-tile-skeleton" />
					))}
				</div>
			) : (
				<div className={`work-tiles${allWork ? " work-tiles--grid" : ""}`}>
					{displayed.map((item, i) => (
						<WorkTile key={item._id} item={item} index={i} total={displayed.length} />
					))}
				</div>
			)}
		</section>
	);
}
