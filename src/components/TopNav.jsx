import "../styles/topnav.css";
import { handleHomeClick, handleWorkClick } from "../utils/navigation";

export default function TopNav() {
	return (
		<header className="topnav">
			<div className="logo">H</div>
			<nav className="nav-pills">
				<a className="pill home" onClick={handleHomeClick}>
					HOME
				</a>
				<a className="pill work" onClick={handleWorkClick}>
					WORK
				</a>
				<a className="pill about">ABOUT</a>
			</nav>
			<p className="tagline">Connected by stories. Felt through the screen</p>
		</header>
	);
}
