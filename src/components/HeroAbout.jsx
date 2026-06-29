import "../styles/heroabout.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
const BTS_INTERVAL = 3500;

export default function HeroAbout() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    client
      .fetch(`*[_type == "hero"][0]{ btsPhotos[] }`)
      .then((data) => {
        if (data?.btsPhotos?.length) setPhotos(data.btsPhotos);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % photos.length),
      BTS_INTERVAL
    );
    return () => clearInterval(id);
  }, [photos.length]);

  const go = (dir) =>
    setCurrent((c) => (c + dir + photos.length) % photos.length);

  return (
    <section className="about-preview">
      <div className={`about-preview-inner${photos.length === 0 ? " about-preview-inner--centered" : ""}`}>
        <div>
          <span className="about-preview-eyebrow">Who we are</span>
          <h2 className="about-preview-heading">
            A story-first studio that keeps every film it{" "}
            <span className="about-preview-accent">makes.</span>
          </h2>
          <button className="about-preview-cta" onClick={() => navigate("/about")}>
            <span className="about-preview-arrow">⟶</span>
            <span>Read our story</span>
          </button>
        </div>

        {photos.length > 0 && (
          <div className="bts-carousel">
            {photos.map((photo, i) => {
              const url = builder
                .image(photo)
                .width(1200)
                .height(900)
                .fit("crop")
                .auto("format")
                .url();
              return (
                <div
                  key={i}
                  className={`bts-slide${i === current ? " bts-slide-active" : ""}`}
                >
                  <img src={url} alt={`BTS ${i + 1}`} className="bts-img" />
                </div>
              );
            })}
            {photos.length > 1 && (
              <div className="bts-controls">
                <button
                  className="bts-btn"
                  onClick={() => go(-1)}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <span className="bts-counter">
                  {current + 1} / {photos.length}
                </span>
                <button
                  className="bts-btn"
                  onClick={() => go(1)}
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
