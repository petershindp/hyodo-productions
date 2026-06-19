import "../styles/topnav.css";
import { useNavigate, useLocation } from "react-router-dom";
import { scrollToTop, scrollToWork } from "../utils/navigation";

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      scrollToTop();
    }
  };

  const handleWorkClick = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToWork: true } });
    } else {
      scrollToWork();
    }
  };

  return (
    <header className="topnav">
      <div className="logo">H</div>
      <nav className="nav-pills">
        <button className="pill home" onClick={handleHomeClick}>
          HOME
        </button>
        <button className="pill work" onClick={handleWorkClick}>
          WORK
        </button>
        <button className="pill about">ABOUT</button>
      </nav>
      <p className="tagline">Connected by stories. Felt through the screen</p>
    </header>
  );
}
