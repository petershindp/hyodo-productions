import { useRef, useState } from "react";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";
import { Link } from "react-router-dom";

const builder = imageUrlBuilder(client);

export default function WorkCard({ projectId, title, meta, still, videoUrl }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Lazy-set the src on first hover so video doesn't load until needed
    if (videoRef.current && !videoLoaded) {
      videoRef.current.src = videoUrl;
      setVideoLoaded(true);
    }
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

  // Use fit('crop') so non-16:9 images aren't distorted
  const stillUrl = still
    ? builder.image(still).width(1600).height(900).fit("crop").auto("format").url()
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
          // No src here — set lazily on first hover
          <video
            ref={videoRef}
            className="card-video"
            muted
            playsInline
          />
        ) : (
          <div className="card-placeholder" />
        )}
        <div className="overlay">
          <h3>{title}</h3>
          <p>{meta}</p>
        </div>
      </div>
    </Link>
  );
}
