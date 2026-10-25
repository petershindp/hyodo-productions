import "./styles/globals.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import { useEffect } from "react";

function ScrollToTop() {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return null;
}

import Hero from "./components/Hero";
import WorkGrid from "./components/WorkGrid";
import Footer from "./components/Footer";
import TopNav from "./components/TopNav";
import ProjectDetails from "./pages/ProjectDetails";
import WorkPage from "./pages/WorkPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { useSEO } from "./hooks/useSEO";

function HomePage() {
	useSEO({
		description:
			"Hyodo Productions — Driven by story, crafted to last. Film, commercials and music videos.",
		path: "/",
	});

	return (
		<div>
			<h1 className="sr-only">
				Hyodo Productions — Film, Commercial &amp; Music Video Production Studio
			</h1>
			<TopNav />
			<Hero />
			<WorkGrid limit={6} />
			<Footer />
		</div>
	);
}

export default function App() {
	return (
		<Router>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/work" element={<WorkPage />} />
				<Route path="/work/:projectId" element={<ProjectDetails />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/contact" element={<ContactPage />} />
			</Routes>
		</Router>
	);
}
