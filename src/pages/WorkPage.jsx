import { useState, useEffect } from "react";
import { client } from "../client";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import WorkCard from "../components/WorkCard";
import "../styles/grid.css";
import "../styles/workpage.css";

const FILTERS = ["All", "Feature Film", "Music Video", "Commercial", "Documentary", "Short Film"];

export default function WorkPage() {
  const [work, setWork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "work"] | order(publishedAt desc, _createdAt desc) { _id, projectId, title, client, category, thumbnail, video { asset->{url} } }`
      )
      .then((data) => {
        setWork(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? work : work.filter((p) => p.category === filter);

  const activeCategories = new Set(work.map((p) => p.category));
  const visibleFilters = FILTERS.filter((f) => f === "All" || activeCategories.has(f));

  return (
    <div>
      <TopNav />
      <div className="work-page">
        <div className="work-page-header">
          <h1 className="work-page-title">Work</h1>
          <p className="work-page-desc">
            Films, commercials and music videos — a catalogue we maintain, not a feed we flush.
          </p>
        </div>
        <div className="work-filters">
          {visibleFilters.map((f) => (
            <button
              key={f}
              className={`work-filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid">
            {filtered.map((item) => (
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
      </div>
      <Footer />
    </div>
  );
}
