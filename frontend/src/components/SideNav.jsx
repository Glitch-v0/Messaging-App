import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AppContext } from "../context.jsx";

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { hasToken } = useContext(AppContext);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    const root = document.querySelector(":root");
    root.style.setProperty("--nav-width", !isOpen ? "200px" : "0px");
  };

  const links = [
    { path: "/profile", label: "Profile", protected: true },
    { path: "/online", label: "Online", protected: true },
    { path: "/requests", label: "Requests", protected: true },
    { path: "/friends", label: "Friends", protected: true },
    { path: "/conversations", label: "Conversations", protected: true },
    { path: "/", label: "Register", protected: false },
    { path: "/login", label: "Login", protected: false },
    { path: "/logout", label: "Logout", protected: true },
  ];

  return (
    <>
      <nav>
        {isOpen ? (
          <ul>
            {links
              .filter((link) => (hasToken ? link.protected : !link.protected))
              .map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
          </ul>
        ) : null}
        <button id="navButton" onClick={handleToggle}>
          <svg
            width={30}
            height={30}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="var(--font-color)"
              d={
                isOpen
                  ? "M11 17V7l-5 5zm2 4h2V3h-2z"
                  : "M5 19v-6h2v4h4v2zm12-8V7h-4V5h6v6z"
              }
            />
          </svg>
        </button>
      </nav>
    </>
  );
};

export default SideNav;
