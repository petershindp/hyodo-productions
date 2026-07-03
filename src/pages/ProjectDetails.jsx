import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import "../styles/projectDetails.css";
import { useSEO } from "../hooks/useSEO";

const builder = imageUrlBuilder(client);

function getWatchUrl(embedUrl) {
	if (!embedUrl) return null;
	const vimeo = embedUrl.match(/player\.vimeo\.com\/video\/(\d+)/);
	if (vimeo) return `https://vimeo.com/${vimeo[1]}`;
	const youtube = embedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
	if (youtube) return `https://youtu.be/${youtube[1]}`;
	return embedUrl;
}

function getPlatform(url) {
	if (!url) return null;
	if (url.includes("vimeo")) return "Vimeo";
	if (url.includes("youtube") || url.includes("youtu.be")) return "YouTube";
	return null;
}

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
          publishedAt,
          description,
          videoLink,
          aspectRatio,
          thumbnail,
          stills[]
        }`,
				{ projectId },
			)
			.then((data) => {
				setProject(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, [projectId]);

	useSEO({
		title: project?.title,
		description: project?.description,
		path: `/work/${projectId}`,
		image: project?.thumbnail
			? builder
					.image(project.thumbnail)
					.width(1200)
					.height(630)
					.fit("crop")
					.auto("format")
					.url()
			: undefined,
	});

	if (loading) return <div className="project-loading">Loading…</div>;
	if (!project)
		return (
			<div className="project-not-found">
				<p>Project not found</p>
				<Link to="/work">← Back to work</Link>
			</div>
		);

	const stillUrls = project.stills
		? project.stills.map((still) =>
				builder.image(still).width(1600).auto("format").url(),
			)
		: [];

	return (
		<div>
			<TopNav />
			<div className="project-details">
				<Link to="/work" className="back-link">
					← Back
				</Link>
				<div className="project-info">
					<div className="title-client">
						<h1 className="project-title">{project.title}</h1>
						{project.client && (
							<span className="project-client">{project.client}</span>
						)}
					</div>
					<div className="project-meta-right">
						{project.category && (
							<span className="project-category">{project.category}</span>
						)}
						{project.publishedAt && (
							<span className="project-year">
								{new Date(project.publishedAt).getFullYear()}
							</span>
						)}
					</div>
				</div>

				{project.description && (
					<p className="project-description">{project.description}</p>
				)}

				{project.videoLink &&
					(() => {
						const watchUrl = getWatchUrl(project.videoLink);
						const platform = getPlatform(project.videoLink);
						return (
							<a
								href={watchUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="project-video-link"
							>
								<div className="project-video-link-left">
									<span className="project-video-link-eyebrow">
										{platform ? `[ ${platform} ]` : "[ Watch ]"}
									</span>
									<span className="project-video-link-label">
										Watch full film
									</span>
								</div>
								<span className="project-video-link-arrow">{'↗︎'}</span>
							</a>
						);
					})()}

				{stillUrls.length > 0 && (
					<div className="project-stills">
						{stillUrls.map((url, index) => (
							<img
								key={index}
								src={url}
								alt={`${project.title} still ${index + 1}`}
								className="project-still"
								style={{ aspectRatio: project.aspectRatio || "16/9" }}
							/>
						))}
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
}
