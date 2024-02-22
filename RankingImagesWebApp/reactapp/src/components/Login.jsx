import { useState, useEffect } from 'react';

function Login()
{
	useEffect(() =>
	{
		document.title = `Login - Ranking Images`;
	}, []);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState("");

	const handleChangeToForms = (event) =>
	{
		const { name, value } = event.target;
		if(name === "username")
		{
			setUsername(value);
		}

		else if(name === "password")
		{
			setPassword(value);
		}
	};

	const handleSubmit = (event) =>
	{
		event.preventDefault();

		if(!username || !password)
		{
			setError("Please fill in all fields!");
		}

		else
		{
			setError("");

			fetch("api/Accounts/login",
				{
					method: "POST",
					headers:
					{
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ username: username, password: password })
				})
				.then(response => response.json())
				.then(data =>
				{
					if(data.token)
					{
						//document.cookie = `jwtToken=${data.token}; path=/; HttpOnly`;
						setError("Login Success");
						window.location.href = '/'; // Refreshes Page
					}

					else
					{
						setError("Login FAILED");
					}
				})
				.catch(error =>
				{
					console.log(error);
					setError("Login ERROR");
				});
		}
	};

	return (
		<div className="loginContainer">
			<h3>Login</h3>
			<form onSubmit={handleSubmit}>
				<div>
					<label className="loginInput" htmlFor="username">Username:</label>
				</div>
				<div>
					<input type="username" id="username-login-input" name="username" value={username} onChange={handleChangeToForms} />
				</div>
				<div>
					<label className="loginInput" htmlFor="password">Password:</label>
				</div>
				<div>
					<input type="password" id="password-login-input" name="password" value={password} onChange={handleChangeToForms} />
				</div>
				<div>
					<button type="submit">Login</button>
				</div>
			</form>

			<h4>{error}</h4>
		</div>
	);
}

export default Login;