import { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    darkMode: null,
    showOnline: null,
    allowRequests: null,
  });

  const handleProfileUpdate = (update) => {
    const updatedValue = !profile[update];
    const updatedProfile = { ...profile, [update]: updatedValue };
    console.log(`Sending request to update ${update} to ${updatedValue}`);
    setProfile(updatedProfile); //updates profile with the toggled value
    console.log(`Sending these values: ${JSON.stringify(updatedProfile)}`);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        darkMode: updatedProfile.darkMode,
        showOnline: updatedProfile.showOnline,
        allowRequests: updatedProfile.allowRequests,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  return (
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
    </main>
  );
};

export default Profile;
