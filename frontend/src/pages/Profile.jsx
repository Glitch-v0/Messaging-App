import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context.jsx";

const Profile = () => {
  const { profile, setProfile } = useContext(AppContext);

  const navigate = useNavigate();

  const handleProfileUpdate = (update) => {
    const updatedValue = !profile[update];
    const updatedProfile = { ...profile, [update]: updatedValue };
    setProfile(updatedProfile); //updates profile with the toggled value
    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        darkMode: updatedProfile.darkMode,
        showOnline: updatedProfile.showOnline,
        allowRequests: updatedProfile.allowRequests,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        if (update === "darkMode") {
          const root = document.querySelector(":root");
          const isDark = updatedProfile.darkMode;

          root.style.setProperty(
            "--main-color",
            isDark ? "#000000" : "#38195e"
          );
          root.style.setProperty(
            "--nav-background-color",
            isDark ? "#0d0d0d" : "#2a1346"
          );
          root.style.setProperty(
            "--font-color",
            isDark ? "#c5c5c5" : "#fde2ff"
          );
          root.style.setProperty(
            "--button-background-color",
            isDark ? "#252525" : "#2a1346"
          );

          // save colors to local storage
          localStorage.setItem("darkMode", JSON.stringify(isDark));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteProfile = async () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: document.getElementById("password").value,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .then(() => navigate("/"));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [setProfile]);

  return !profile ? (
    <main>
      <h1>Loading...</h1>
    </main>
  ) : (
    <main>
      <h1>Profile Settings</h1>
      <p className="profileSection">
        Dark Mode: {String(profile.darkMode)}
        <button onClick={() => handleProfileUpdate("darkMode")}>Toggle</button>
      </p>
      <p className="profileSection">
        Show Online: {String(profile.showOnline)}
        <button onClick={() => handleProfileUpdate("showOnline")}>
          Toggle
        </button>
      </p>
      <p className="profileSection">
        Allow Requests: {String(profile.allowRequests)}
        <button onClick={() => handleProfileUpdate("allowRequests")}>
          Toggle
        </button>
      </p>
      <h2>Delete Account</h2>
      <p>You may delete your account by clicking the button below.</p>
      <p>This is permanent and cannot be undone!</p>
      <p>Please re-enter your password to verify this destructive action.</p>
      <input type="password" name="password" id="password" />
      <button onClick={() => handleDeleteProfile()}>Delete Account</button>
    </main>
  );
};

export default Profile;
