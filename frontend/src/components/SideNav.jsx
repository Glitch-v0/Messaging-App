import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const SideNav = () => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem("token")); // Convert to boolean
  }, []);

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
    <nav>
      <ul>
        {links
          .filter((link) => (hasToken ? link.protected : !link.protected))
          .map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default SideNav;
