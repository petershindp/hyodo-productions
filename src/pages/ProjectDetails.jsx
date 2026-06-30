import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import "../styles/projectDetails.css";

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
          publishedAt,
          description,
          videoLink,
          aspectRatio,
          stills[]
        }`,
        { projectId }
      )
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

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
        builder.image(still).width(1600).auto("format").url()
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

        <div className="project-media">
          {project.videoLink && (
            <iframe
              style={{ aspectRatio: project.aspectRatio || "16/9" }}
              src={project.videoLink}
              title="Project Video"
              className="project-video"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

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
