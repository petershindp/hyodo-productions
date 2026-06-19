export const handleHomeClick = () => {
	// Navigate to home page if not on it
	if (window.location.pathname !== "/") {
		window.location.href = "/";
	}
	// Scroll to the top of the page smoothly
	window.scrollTo({ top: 0, behavior: "smooth" });
};

export const handleWorkClick = () => {
	const workSection = document.getElementById("work-section");
	if (window.location.pathname !== "/") {
		window.location.href = "/";
	}

	if (workSection) {
		workSection.scrollIntoView({ behavior: "smooth" });
	}
};
