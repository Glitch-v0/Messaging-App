const Login = () => {
  const handleSubmit = async (event) => {
    console.log({ event });
    event.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    });
    const data = await response.json();
    //save the token
    localStorage.setItem("token", data.token);
    console.log(data);
    //redirect to home
    window.location.href = "/conversations";
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
