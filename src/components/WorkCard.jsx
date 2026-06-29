import { useRef, useState } from "react";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";
import { Link } from "react-router-dom";

const builder = imageUrlBuilder(client);

export default function WorkCard({ projectId, title, category, client: clientName, still, videoUrl }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !videoLoaded && videoUrl) {
      videoRef.current.src = videoUrl;
      setVideoLoaded(true);
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const stillUrl = still
    ? builder.image(still).width(1200).height(675).fit("crop").auto("format").url()
    : null;

  return (
    <Link to={`/work/${projectId}`} className="card-link">
      <div className="card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="card-media">
          {stillUrl && (
            <img
              className={`card-image${isHovered ? " card-image-hidden" : ""}`}
              src={stillUrl}
              alt={title}
            />
          )}
          {videoUrl && (
            <video
              ref={videoRef}
              className={`card-video${isHovered ? " card-video-visible" : ""}`}
              muted
              playsInline
              loop
            />
          )}
          {!stillUrl && !videoUrl && <div className="card-placeholder" />}
        </div>
        <div className="card-info">
          <div className="card-title-row">
            <span className="card-title">{title}</span>
          </div>
          <div className="card-meta">
            {category && <span className="card-category">{category}</span>}
            {clientName && category && <span className="card-meta-divider">/</span>}
            {clientName && <span className="card-client">{clientName}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
