import "../styles/marquee.css";

export default function Marquee() {
  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        <span>Story first. Built to last. —&nbsp;</span>
        <span className="marquee-accent">Story first. Built to last. —&nbsp;</span>
        <span>Story first. Built to last. —&nbsp;</span>
        <span className="marquee-accent">Story first. Built to last. —&nbsp;</span>
      </div>
    </div>
  );
}
