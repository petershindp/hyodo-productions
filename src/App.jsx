import "./styles/globals.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import WorkGrid from "./components/WorkGrid";
import HeroAbout from "./components/HeroAbout";
import ProjectDetails from "./pages/ProjectDetails";

function HomePage() {
	return (
		<div className="site">
			<TopNav />
			<Hero />
			<HeroAbout />
			<WorkGrid />
			<Footer />
		</div>
	);
}

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/work/:projectId" element={<ProjectDetails />} />
			</Routes>
		</Router>
	);
}
