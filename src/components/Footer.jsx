import "../styles/footer.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { scrollToTop } from "../utils/navigation";
import { client } from "../client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

export default function Footer({ dark = false }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [footerLogo, setFooterLogo] = useState(null);

	useEffect(() => {
		client
			.fetch(`*[_type == "hero"][0]{ footerLogo{..., asset->{_id, metadata{dimensions}}} }`)
			.then((data) => {
				if (data?.footerLogo) setFooterLogo(data.footerLogo);
			})
			.catch(() => {});
	}, []);

	const handleLogoClick = () => {
		if (location.pathname !== "/") navigate("/");
		scrollToTop();
	};

	const logoUrl = footerLogo
		? builder.image(footerLogo).height(512).auto("format").url()
		: null;

	const logoDimensions = footerLogo?.asset?.metadata?.dimensions;
	const logoAspectRatio = logoDimensions
		? logoDimensions.width / logoDimensions.height
		: 3;

	return (
		<footer className={`footer${dark ? " footer--dark" : ""}`}>
			<div className="footer-inner">
				<div className="footer-top">
					<button className="footer-logo" onClick={handleLogoClick} aria-label="Hyodo Productions — back to top">
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
							<span className="footer-logo-text">hyodo</span>
						)}
					</button>

					<div className="footer-cols">
						<div className="footer-col">
							<span className="footer-col-label">Connect</span>
							<a href="mailto:hello@hyodoproductions.com" className="footer-link footer-link-email">
								hello@hyodoproductions.com
							</a>
							<a href="https://www.instagram.com/hyodoproductions/" target="_blank" rel="noopener noreferrer" className="footer-link">
								Instagram
							</a>
						</div>
					</div>
				</div>

				<div className="footer-bottom">
					{dark && <span className="footer-bottom-dot" aria-hidden="true" />}
					<span>© 2026 Hyodo Productions — Driven by story. Crafted to last.</span>
					<span className="footer-bottom-right">Los Angeles / Worldwide</span>
				</div>
			</div>
		</footer>
	);
}
