import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    console.log({ event });
    event.preventDefault();
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
  };
  return (
    <main>
      <h1>Messaging for champions</h1>
      <p>Sign up today!</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Register</button>
      </form>
    </main>
  );
};

export default Register;
