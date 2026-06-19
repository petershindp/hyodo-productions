import "../styles/footer.css";
import { useNavigate, useLocation } from "react-router-dom";
import { scrollToTop, scrollToWork } from "../utils/navigation";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      scrollToTop();
    }
  };

  const handleWorkClick = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToWork: true } });
    } else {
      scrollToWork();
    }
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2 className="footer-title">
          <span>hyodo</span>
          <span>productions</span>
        </h2>

        <div className="footer-right">
          <div className="links-column">
            <div className="footer-pill">LINKS</div>
            <button
              className="footer-link"
              id="home-link"
              onClick={handleHomeClick}
            >
              Home
            </button>
            <button
              className="footer-link"
              id="work-link"
              onClick={handleWorkClick}
            >
              Work
            </button>
            <button className="footer-link" id="about-link">
              About
            </button>
          </div>

          <div className="links-column">
            <div className="footer-pill">CONNECT</div>
            <a
              className="footer-link"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              className="footer-link"
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="footer-link"
              href="mailto:contact@hyodoproductions.com"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>©2026 Hyodo Productions LLC</div>
        <div className="tagline">
          Connected by stories. Shown through the screen
        </div>
      </div>
    </footer>
  );
}
