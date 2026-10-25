import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import WorkGrid from "../components/WorkGrid";
import { useSEO } from "../hooks/useSEO";

export default function WorkPage() {
	useSEO({
		title: "Work",
		description:
			"Films, commercials and music videos from Hyodo Productions — a catalogue we maintain, not a feed we flush.",
		path: "/work",
	});

	return (
		<div>
			<TopNav />
			<h1 className="sr-only">Work</h1>
			<WorkGrid allWork heading="Work" />
			<Footer />
		</div>
	);
}
