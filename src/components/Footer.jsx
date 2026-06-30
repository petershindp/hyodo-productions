import "../styles/footer.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { scrollToTop } from "../utils/navigation";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

export default function Footer() {
	const navigate = useNavigate();
	const location = useLocation();
	const [footerLogo, setFooterLogo] = useState(null);

	useEffect(() => {
		client
			.fetch(
				`*[_type == "hero"][0]{ footerLogo{..., asset->{_id, metadata{dimensions}}} }`,
			)
			.then((data) => {
				if (data?.footerLogo) setFooterLogo(data.footerLogo);
			})
			.catch(() => {});
	}, []);

	const handleLogoClick = () => {
		if (location.pathname !== "/") {
			navigate("/");
		}
		scrollToTop();
	};

	const logoUrl = footerLogo
		? builder.image(footerLogo).height(360).auto("format").url()
		: null;

	const logoDimensions = footerLogo?.asset?.metadata?.dimensions;
	const logoAspectRatio = logoDimensions
		? logoDimensions.width / logoDimensions.height
		: 1;

	return (
		<footer className="footer">
			<div className="footer-top">
				<button className="footer-logo" onClick={handleLogoClick}>
					{logoUrl ? (
						<span
							className="footer-logo-img"
							style={{
								WebkitMaskImage: `url(${logoUrl})`,
								maskImage: `url(${logoUrl})`,
								aspectRatio: logoAspectRatio,
							}}
							role="img"
							aria-label="Hyodo Productions"
						/>
					) : (
						<>hyodo<sup className="footer-logo-tm">™</sup></>
					)}
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
							href="mailto:hello@hyodoproductions.com"
							className="footer-link"
						>
							hello@hyodoproductions.com
						</a>
						<a
							href="https://www.instagram.com/hyodoproductions/"
							target="_blank"
							rel="noopener noreferrer"
							className="footer-link"
						>
							Instagram
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
