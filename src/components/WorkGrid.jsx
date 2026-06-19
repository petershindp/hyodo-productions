import WorkCard from "./WorkCard";
import "../styles/grid.css";
import { useState, useEffect } from "react";
import { client } from "../client";

export default function WorkGrid() {
	const [work, setWork] = useState([]);

	useEffect(() => {
		client
			.fetch(
				`*[_type == "work"]{ _id, projectId, title, category, thumbnail, video { asset->{url} } }`,
			)
			.then(setWork);
	}, []);

	return (
		<section id="work-section" className="work-section">
			<div className="grid">
				{work &&
					work.map((item) => (
						<WorkCard
							key={item._id}
							projectId={item?.projectId || "unknown"}
							title={item?.title || "Loading..."}
							meta={`${item?.category || "Unknown"}`}
							still={item.thumbnail || null}
							videoUrl={item?.video?.asset?.url}
						/>
					))}
			</div>
			<div className="view-all">
				<div className="view-all-text">VIEW ALL</div>
			</div>
		</section>
	);
}
