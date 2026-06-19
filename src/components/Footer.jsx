import "../styles/footer.css";
import { handleHomeClick, handleWorkClick } from "../utils/navigation";

export default function Footer() {
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
						<div
							className="footer-link"
							id="home-link"
							onClick={handleHomeClick}
						>
							Home
						</div>
						<div
							className="footer-link"
							id="work-link"
							onClick={handleWorkClick}
						>
							Work
						</div>
						<div className="footer-link" id="about-link">
							About
						</div>
					</div>

					<div className="links-column">
						<div className="footer-pill">CONNECT</div>
						<div className="footer-link">Instagram</div>
						<div className="footer-link">LinkedIn</div>
						{/* <div className="footer-link">YouTube</div> */}
						<div className="footer-link">Email</div>
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
