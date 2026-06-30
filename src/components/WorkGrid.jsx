import WorkCard from "./WorkCard";
import "../styles/grid.css";
import { useState, useEffect } from "react";
import { client } from "../client";
import { Link } from "react-router-dom";

export default function WorkGrid({ limit }) {
	const [work, setWork] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		client
			.fetch(
				`*[_type == "work" && featured == true] | order(orderRank asc) { _id, projectId, title, client, category, thumbnail, video { asset->{url} } }`,
			)
			.then((data) => {
				setWork(data);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
			});
	}, []);

	const displayed = limit ? work.slice(0, limit) : work;

	return (
		<section id="work-section" className="work-section">
			<div className="work-section-header">
				<h2 className="work-section-title">Selected Work</h2>
			</div>
			{loading ? (
				<div className="grid">
					{[...Array(limit || 6)].map((_, i) => (
						<div key={i} className="card-skeleton" />
					))}
				</div>
			) : error ? (
				<div className="grid-error">Unable to load projects.</div>
			) : (
				<div className="grid">
					{displayed.map((item) => (
						<WorkCard
							key={item._id}
							projectId={item?.projectId || "unknown"}
							title={item?.title || "Untitled"}
							category={item?.category || ""}
							client={item?.client || ""}
							still={item.thumbnail || null}
							videoUrl={item?.video?.asset?.url}
						/>
					))}
				</div>
			)}
			{limit && !loading && !error && (
				<div className="work-view-all">
					<Link to="/work" className="work-view-all-link">
						View all work ↗
					</Link>
				</div>
			)}
		</section>
	);
}
