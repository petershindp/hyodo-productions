import "./styles/globals.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import TopNav from "./components/TopNav";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import WorkGrid from "./components/WorkGrid";
import HeroAbout from "./components/HeroAbout";
import ProjectDetails from "./pages/ProjectDetails";
import { scrollToWork } from "./utils/navigation";

function HomePage() {
  const location = useLocation();

  // Handle scroll-to-work after navigating back from a project page
  useEffect(() => {
    if (location.state?.scrollToWork) {
      // Wait for DOM to render before scrolling
      const timer = setTimeout(() => scrollToWork(), 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

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
