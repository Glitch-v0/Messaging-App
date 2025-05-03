import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context.jsx";

import { toast } from "sonner";

const Register = () => {
  const { setHasToken } = useContext(AppContext);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    console.log({ event });
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGuestAccount = async () => {
    const [guestName, guestEmail, guestPassword] = [
      `Guest${crypto.randomUUID()}`,
      `guest${crypto.randomUUID()}@guest.com`,
      crypto.randomUUID(),
    ];

    try {
      const register = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: guestName,
            email: guestEmail,
            password: guestPassword,
          }),
        }
      );

      if (register) {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: guestEmail,
              password: guestPassword,
            }),
            credentials: "include",
          }
        );

        const data = await response.json();
        setHasToken(true);
        console.log(data);

        navigate("/conversations");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <main id="registerPage">
      <h1>MessagePro</h1>
      <h2>Register Below</h2>
      <form onSubmit={handleSubmit} id="registerForm">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" placeholder="John Doe" />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="coolapp@example.com"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <button type="submit">Register</button>
      </form>
      <div id="guestAccount">
        <h2>Or try a guest account</h2>
        <button onClick={handleGuestAccount}>Explore</button>
      </div>
    </main>
  );
};

export default Register;
