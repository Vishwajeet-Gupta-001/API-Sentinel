import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    const response = await fetch("http://localhost:5000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
    } else {
      setError(data.message);
    }
  }

  return (
    <div>
      <h1>Register</h1>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
      
    </div>
  );
}

export default Register;
