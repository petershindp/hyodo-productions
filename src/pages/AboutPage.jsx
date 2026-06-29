import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import "../styles/about.css";

const SERVICES = [
  {
    n: "01",
    title: "Film",
    desc: "Narrative features and short films, from development through post — director-led, producer-supported.",
  },
  {
    n: "02",
    title: "Commercials",
    desc: "Brand films and campaigns that carry a story, not just a spot. Concept to final grade.",
  },
  {
    n: "03",
    title: "Music Videos",
    desc: "Artist-first visuals built around the song. Bold, fast, and made to be rewatched.",
  },
  {
    n: "04",
    title: "Archive & Restoration",
    desc: "We preserve and restore our catalogue so finished work stays alive long after delivery.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <TopNav />
      <div className="about-page">
        <span className="about-eyebrow">[ About / Studio ]</span>
        <h1 className="about-title">
          We're a story-first studio that treats every film like it has to{" "}
          <span className="about-accent">survive the decade.</span>
        </h1>

        <div className="about-body">
          <div>
            <span className="about-col-label">Who we are</span>
            <p className="about-col-text">
              Hyodo Productions is an independent production company working across film,
              commercials and music videos. Founded in 2014, we've built a practice around
              a single belief: the story comes before the format, the trend, or the platform.
            </p>
          </div>
          <div>
            <span className="about-col-label">What we keep</span>
            <p className="about-col-text">
              We don't just deliver and move on. Every project enters an archive we actively
              preserve and restore — masters, stems, and stills cared for so the work outlives
              its release window. Legacy isn't a tagline here; it's an operating model.
            </p>
          </div>
        </div>

        <div className="about-studio-img">
          <span className="about-studio-img-label">Studio / Team — drop image here</span>
        </div>

        <div className="about-services-header">
          <h2 className="about-services-title">What we do</h2>
          <span className="about-services-count">04 / Disciplines</span>
        </div>
        {SERVICES.map((s) => (
          <div key={s.n} className="about-service-row">
            <span className="about-service-n">{s.n}</span>
            <span className="about-service-name">{s.title}</span>
            <span className="about-service-desc">{s.desc}</span>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
