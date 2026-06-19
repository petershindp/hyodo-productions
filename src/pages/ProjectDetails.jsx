import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";
import "../styles/projectDetails.css";
import Footer from "../components/Footer";

const builder = imageUrlBuilder(client);

export default function ProjectDetails() {
	const { projectId } = useParams();
	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!projectId) return;

		setLoading(true);
		client
			.fetch(
				`*[_type == "work" && projectId == $projectId][0]{
                    _id,
                    title,
                    client,
                    category,
                    videoLink,
                    stills[],
                    aspectRatio
                }`,
				{ projectId },
			)
			.then((data) => {
				setProject(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching project details:", error);
				setLoading(false);
			});
	}, [projectId]);

	if (loading) return <div className="project-loading">Loading...</div>;
	if (!project)
		return (
			<div className="project-not-found">
				<p>Project not found</p>
				<Link to="/">Back to Home</Link>
			</div>
		);

	const stillUrls = project.stills
		? project.stills.map((still) =>
				builder.image(still).width(1600).height(900).fit("crop").auto("format").url(),
			)
		: [];

	return (
		<div>
			<div className="project-details">
				<Link to="/" className="back-link">
					← Back
				</Link>
				<div className="project-info">
					<div className="title-client">
						<div className="project-title">{project.title}</div>
						{project.client && (
							<div className="project-client">{project.client}</div>
						)}
					</div>
					<div className="project-category">{project.category}</div>
				</div>

				<div className="project-media">
					{project.videoLink ? (
						<iframe
							style={{ aspectRatio: project.aspectRatio || "16/9" }}
							src={project.videoLink}
							title="Vimeo Video"
							className="project-video"
							frameBorder="0"
							allow="autoplay; fullscreen; picture-in-picture"
							allowFullScreen
						/>
					) : null}
				</div>

				{stillUrls.length > 0 && (
					<div className="project-stills">
						{stillUrls.map((url, index) => (
							<img
								key={index}
								src={url}
								alt={`${project.title} still ${index + 1}`}
								className="project-still"
							/>
						))}
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
}
