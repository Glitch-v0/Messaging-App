import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context.jsx";

const Login = () => {
  const { setHasToken } = useContext(AppContext);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    console.log({ event });
    event.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
      }),
      credentials: "include",
    });
    const data = await response.json();

    setHasToken(true);
    console.log(data);
    //redirect to home
    navigate("/conversations");
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Login</button>
      </form>
    </main>
  );
};

export default Login;
