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
import TopNav from "./components/TopNav";
import Hero from "./components/Hero";
import HeroAbout from "./components/HeroAbout";
import WorkGrid from "./components/WorkGrid";
// import Clients from "./components/Clients";
import ProcessBand from "./components/ProcessBand";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";
import ProjectDetails from "./pages/ProjectDetails";
import WorkPage from "./pages/WorkPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { useSEO } from "./hooks/useSEO";

function GrainOverlay() {
	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 1,
				pointerEvents: "none",
				opacity: 0.05,
				mixBlendMode: "multiply",
				backgroundImage:
					"url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')",
				animation: "hp-grain 1.2s steps(2) infinite",
			}}
		/>
	);
}

function HomePage() {
	useSEO({
		description:
			"Hyodo Productions — story first, built to last. Film, commercials and music videos.",
		path: "/",
	});

	return (
		<div>
			<TopNav />
			<h1 className="sr-only">
				Hyodo Productions — Film, Commercial &amp; Music Video Production Studio
			</h1>
			<Hero />
			<HeroAbout />
			<WorkGrid limit={6} />
			<ProcessBand />
			<CtaBand />
			<Footer />
		</div>
	);
}

export default function App() {
	return (
		<Router>
			<ScrollToTop />
			<GrainOverlay />
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
