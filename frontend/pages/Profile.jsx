import { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    darkMode: null,
    showOnline: null,
    allowRequests: null,
  });

  const handleProfileUpdate = (update) => {
    console.log(`Sending request to update ${update} to ${!profile[update]}`);
    setProfile({ ...profile, [update]: !profile[update] }); //updates profile with the toggled value
    console.log(`Sending these values: ${JSON.stringify(profile)}`);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        darkMode: profile.darkMode,
        showOnline: profile.showOnline,
        allowRequests: profile.allowRequests,
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
      <p>
        Dark Mode: {profile.darkMode}{" "}
        <button onClick={() => handleProfileUpdate("darkMode")}>Toggle</button>
      </p>
      <p>
        Show Online: {profile.showOnline}{" "}
        <button onClick={() => handleProfileUpdate("showOnline")}>
          Toggle
        </button>
      </p>
      <p>
        Allow Requests: {profile.allowRequests}{" "}
        <button onClick={() => handleProfileUpdate("allowRequests")}>
          Toggle
        </button>
      </p>
    </main>
  );
};

export default Profile;
