import WorkCard from "./WorkCard";
import "../styles/grid.css";
import { useState, useEffect } from "react";
import { client } from "../client";

export default function WorkGrid() {
  const [work, setWork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "work"]{ _id, projectId, title, category, thumbnail, video { asset->{url} } }`,
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

  return (
    <section id="work-section" className="work-section">
      {loading ? (
        <div className="grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card card-skeleton" />
          ))}
        </div>
      ) : error ? (
        <div className="grid-error">Unable to load projects.</div>
      ) : (
        <div className="grid">
          {work.map((item) => (
            <WorkCard
              key={item._id}
              projectId={item?.projectId || "unknown"}
              title={item?.title || "Untitled"}
              meta={`${item?.category || ""}`}
              still={item.thumbnail || null}
              videoUrl={item?.video?.asset?.url}
            />
          ))}
        </div>
      )}
      <div className="view-all">
        <div className="view-all-text">VIEW ALL</div>
      </div>
    </section>
  );
}
