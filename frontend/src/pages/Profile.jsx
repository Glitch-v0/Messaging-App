import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Error from "./Error.jsx";
import { toast } from "sonner";
import Spinner from "../components/Spinner.jsx";

const fetchProfileData = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

const handleDarkMode = (data) => {
  // save to local storage
  localStorage.setItem("darkMode", data.darkMode);

  // read local storage for dark mode
  const root = document.querySelector(":root");
  // console.log(`Dark mode is set to ${isDark}, ${typeof isDark}`);
  root.style.setProperty("--main-color", data.darkMode ? "#000000" : "#38195e");
  root.style.setProperty(
    "--nav-background-color",
    data.darkMode ? "#0d0d0d" : "#2a1346"
  );
  root.style.setProperty("--font-color", data.darkMode ? "#c5c5c5" : "#fde2ff");
  root.style.setProperty(
    "--button-background-color",
    data.darkMode ? "#252525" : "#2a1346"
  );
};

const Profile = () => {
  const client = useQueryClient();

  const navigate = useNavigate();
  const { isPending, isError, data } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfileData,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedProfile),
      });
      return res.json();
    },
    onSuccess: (data) => {
      // update the profile cache directly
      client.setQueryData(["profile"], data);
      console.log({ data });
      handleDarkMode(data);
      toast.success("Profile updated");
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error(error);
    },
  });

  const handleProfileUpdate = (key) => {
    const current = client.getQueryData(["profile"]);
    const updatedProfile = { ...current, [key]: !current[key] };
    updateProfileMutation.mutate(updatedProfile);
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
      .then(() => navigate("/"))
      .catch((err) => toast.error(err.message));
  };

  if (isPending) {
    return (
      <main>
        <Spinner />
      </main>
    );
  }

  if (isError) {
    return <Error />;
  }

  return (
    <main id="profilePage">
      <div id="profileSettings">
        <h1>Profile Settings</h1>
        <dl className="profileSection">
          <dt htmlFor="darkModeStatus">Dark Mode:</dt>
          <label className="switch">
            <input
              type="checkbox"
              checked={data.darkMode}
              onChange={() => handleProfileUpdate("darkMode")}
            />
            <span className="slider round"></span>
          </label>
        </dl>
        <dl className="profileSection">
          <dt>Show Online:</dt>
          <label className="switch">
            <input
              type="checkbox"
              checked={data.showOnline}
              onChange={() => handleProfileUpdate("showOnline")}
            />
            <span className="slider round"></span>
          </label>
        </dl>
      </div>
      <div id="deleteProfile">
        <h2>Delete Account</h2>
        <span>You may delete your account by clicking the button below.</span>
        <span>This is permanent and cannot be undone!</span>
        <span>
          Please re-enter your password to verify this destructive action.
        </span>
        <input type="password" name="password" id="password" />
        <button
          onClick={() => handleDeleteProfile()}
          className="negativeButton"
        >
          Delete Account
        </button>
      </div>
    </main>
  );
};

export default Profile;
