import "../styles/clients.css";

const CLIENTS = [
  { name: "Meridian Records", size: "clamp(20px, 3vw, 40px)", dy: "-20px" },
  { name: "ATLAS", size: "clamp(34px, 5vw, 70px)", dy: "14px" },
  { name: "Northwind", size: "clamp(22px, 3.4vw, 46px)", dy: "-4px" },
  { name: "VANTAGE", size: "clamp(18px, 2.6vw, 34px)", dy: "30px" },
  { name: "Folklore", size: "clamp(30px, 4.6vw, 62px)", dy: "-24px" },
  { name: "Civic Arts", size: "clamp(20px, 3vw, 40px)", dy: "8px" },
  { name: "HALCYON", size: "clamp(24px, 3.6vw, 50px)", dy: "-12px" },
  { name: "Polestar", size: "clamp(28px, 4.2vw, 58px)", dy: "24px" },
];

export default function Clients() {
  return (
    <section className="clients">
      <div className="clients-header">
        <span className="clients-eyebrow">[ Trusted by ]</span>
        <h2 className="clients-heading">Clients</h2>
      </div>
      <div className="clients-grid">
        {CLIENTS.map((c) => (
          <span
            key={c.name}
            className="clients-name"
            style={{ fontSize: c.size, transform: `translateY(${c.dy})` }}
          >
            {c.name}
          </span>
        ))}
      </div>
    </section>
  );
}
