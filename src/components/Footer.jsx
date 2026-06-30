import "../styles/footer.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { scrollToTop } from "../utils/navigation";

export default function Footer() {
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogoClick = () => {
		if (location.pathname !== "/") {
			navigate("/");
		}
		scrollToTop();
	};

	return (
		<footer className="footer">
			<div className="footer-top">
				<button className="footer-logo" onClick={handleLogoClick}>
					hyodo<sup className="footer-logo-tm">™</sup>
				</button>
				<div className="footer-cols">
					<div className="footer-col">
						<span className="footer-col-label">Menu</span>
						<Link to="/work" className="footer-link">
							Work
						</Link>
						<Link to="/about" className="footer-link">
							About
						</Link>
						<Link to="/contact" className="footer-link">
							Contact
						</Link>
					</div>
					<div className="footer-col">
						<span className="footer-col-label">Connect</span>
						<a
							href="mailto:hello@hyodoproductions.com
						"
							className="footer-link"
						>
							hello@hyodoproductions.com
						</a>
						<a
							href="https://www.instagram.com/"
							target="_blank"
							rel="noopener noreferrer"
							className="footer-link"
						>
							Instagram
						</a>
						<a
							href="https://vimeo.com/"
							target="_blank"
							rel="noopener noreferrer"
							className="footer-link"
						>
							Vimeo
						</a>
					</div>
				</div>
			</div>
			<div className="footer-bottom">
				<span>© 2026 Hyodo Productions — Story first. Built to last.</span>
				<span>Los Angeles / Worldwide</span>
			</div>
		</footer>
	);
}
