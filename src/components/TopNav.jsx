import "../styles/topnav.css";
import { Link, useNavigate } from "react-router-dom";

export default function TopNav() {
  const navigate = useNavigate();

  return (
    <header className="topnav">
      <button className="topnav-logo" onClick={() => navigate("/")}>
        <span className="topnav-logo-main">HYODO</span>
        <span className="topnav-logo-sub">PRODUCTIONS</span>
      </button>
      <nav className="topnav-links">
        <Link to="/work" className="topnav-link">Work</Link>
        <Link to="/about" className="topnav-link">About</Link>
        <Link to="/contact" className="topnav-link">Contact</Link>
      </nav>
    </header>
  );
}
