import { useEffect } from "react";

export const SITE_NAME = "Hyodo Productions";
export const SITE_URL = "https://hyodoproductions.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

function setMeta(attr, key, content) {
	if (!content) return;
	let el = document.head.querySelector(`meta[${attr}="${key}"]`);
	if (!el) {
		el = document.createElement("meta");
		el.setAttribute(attr, key);
		document.head.appendChild(el);
	}
	el.setAttribute("content", content);
}

function setCanonical(href) {
	let el = document.head.querySelector('link[rel="canonical"]');
	if (!el) {
		el = document.createElement("link");
		el.setAttribute("rel", "canonical");
		document.head.appendChild(el);
	}
	el.setAttribute("href", href);
}

// Updates document title + meta description + canonical + Open Graph/Twitter
// tags on route change. Google's crawler executes JS so this covers search
// indexing; static (non-JS) social link-preview bots will still only see
// index.html's default tags unless the site adds prerendering later.
export function useSEO({ title, description, path = "/", image }) {
	useEffect(() => {
		const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
		const url = `${SITE_URL}${path}`;
		const ogImage = image || DEFAULT_IMAGE;

		document.title = fullTitle;
		setMeta("name", "description", description);
		setMeta("property", "og:title", fullTitle);
		setMeta("property", "og:description", description);
		setMeta("property", "og:url", url);
		setMeta("property", "og:image", ogImage);
		setMeta("name", "twitter:card", "summary_large_image");
		setMeta("name", "twitter:title", fullTitle);
		setMeta("name", "twitter:description", description);
		setMeta("name", "twitter:image", ogImage);
		setCanonical(url);
	}, [title, description, path, image]);
}
