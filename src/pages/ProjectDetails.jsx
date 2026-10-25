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

export default function ProjectDetails() {
	const { projectId } = useParams();
	const [project, setProject] = useState(null);
	const [nextProject, setNextProject] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!projectId) return;
		setLoading(true);

		Promise.all([
			client.fetch(
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
			),
			client.fetch(
				`*[_type == "work"] | order(orderRank asc) { projectId, title, category, client, thumbnail }`,
			),
		])
			.then(([data, allWork]) => {
				setProject(data);
				if (allWork && allWork.length > 1) {
					const idx = allWork.findIndex((p) => p.projectId === projectId);
					if (idx !== -1) {
						setNextProject(allWork[(idx + 1) % allWork.length]);
					}
				}
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

	if (loading) return <div className="pd-loading">Loading…</div>;
	if (!project)
		return (
			<div className="pd-not-found">
				<p>Project not found</p>
				<Link to="/work">← All work</Link>
			</div>
		);

	const watchUrl = project.videoLink ? getWatchUrl(project.videoLink) : null;

	const thumbUrl = project.thumbnail
		? builder.image(project.thumbnail).width(2400).auto("format").url()
		: null;

	const stillUrls = project.stills
		? project.stills.map((still) =>
				builder.image(still).width(1600).auto("format").url(),
			)
		: [];

	const nextThumbUrl =
		nextProject?.thumbnail
			? builder.image(nextProject.thumbnail).width(1600).auto("format").url()
			: null;

	return (
		<div className="pd-root">
			<TopNav />

			{/* Title section */}
			<section className="pd-header">
				<Link to="/work" className="pd-back">
					← All work
				</Link>
				<div className="pd-title-row">
					<h1 className="pd-title">{project.title}</h1>
					<p className="pd-meta">
						<span className="pd-meta-dot" aria-hidden="true" />
						<span>
							<span className="pd-meta-category">{project.category}</span>
							{project.client ? ` / ${project.client}` : ""}
						</span>
					</p>
				</div>
			</section>

			{/* Full-width thumbnail with play button */}
			{thumbUrl && (
				<div className="pd-thumb-wrap">
					{watchUrl ? (
						<a
							href={watchUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="pd-thumb-link"
							aria-label={`Watch ${project.title}`}
						>
							<img
								src={thumbUrl}
								alt={`${project.title} thumbnail`}
								className="pd-thumb-img"
							/>
							<div className="pd-play-ring" aria-hidden="true">
								<svg width="24" height="28" viewBox="0 0 24 28" fill="none" aria-hidden="true">
									<path d="M2 2 L22 14 L2 26 Z" fill="#FFFFFF" />
								</svg>
							</div>
						</a>
					) : (
						<div className="pd-thumb-link">
							<img
								src={thumbUrl}
								alt={`${project.title} thumbnail`}
								className="pd-thumb-img"
							/>
						</div>
					)}
				</div>
			)}

			{/* Description */}
			<section
				className={`pd-desc-section${project.description ? "" : " pd-desc-section--empty"}`}
			>
				{project.description && (
					<p className="pd-description">{project.description}</p>
				)}
			</section>

			{/* Stills grid */}
			{stillUrls.length > 0 && (
				<section className="pd-stills-section">
					<div className="pd-stills">
						{stillUrls.map((url, index) => (
							<img
								key={index}
								src={url}
								alt={`${project.title} still ${index + 1}`}
								className="pd-still"
								loading="lazy"
							/>
						))}
					</div>
				</section>
			)}

			{/* Next project banner */}
			{nextProject && (
				<Link
					to={`/work/${nextProject.projectId}`}
					className="pd-next"
					aria-label={`Next project: ${nextProject.title}`}
				>
					{nextThumbUrl && (
						<img
							src={nextThumbUrl}
							alt=""
							className="pd-next-bg"
							aria-hidden="true"
						/>
					)}
					<div className="pd-next-content">
						<span className="pd-next-eyebrow">Next project</span>
						<span className="pd-next-title">
							{nextProject.title} {'↗︎'}
						</span>
						<span className="pd-next-meta">
							<span className="pd-next-meta-dot" aria-hidden="true" />
							<span className="pd-next-meta-category">{nextProject.category}</span>
							{nextProject.client ? ` / ${nextProject.client}` : ""}
						</span>
					</div>
				</Link>
			)}

			<Footer />
		</div>
	);
}
