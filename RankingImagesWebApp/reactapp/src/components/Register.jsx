import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register()
{
	useEffect(() =>
	{
		document.title = `Register - Ranking Images`;
	}, []);

	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [gender, setGender] = useState("");
	const [icon, setIcon] = useState();

	const [error, setError] = useState("");

	const handleChangeToForms = (event) =>
	{
		const { name, value } = event.target;
		if(name === "email")
		{
			setEmail(value);
		}

		else if(name === "username")
		{
			setUsername(value);
		}

		else if(name === "password")
		{
			setPassword(value);
		}

		else if(name === "password-confirmation")
		{
			setPasswordConfirmation(value);
		}

		else if(name === "gender")
		{
			setGender(value);
		}

		else if(name === "icon")
		{
			setIcon(event.target.files[0])
		}
	};

	// Source: https://stackoverflow.com/a/25352300
	function isAllLettersAndNumbers(str)
	{
		var code, i, len;

		for(i = 0, len = str.length; i < len; i++)
		{
			code = str.charCodeAt(i);
			if(!(code > 47 && code < 58) && // numeric (0-9)
				!(code > 64 && code < 91) && // upper alpha (A-Z)
				!(code > 96 && code < 123)) // lower alpha (a-z)
			{
				return false;
			}
		}

		return true;
	}

	const handleSubmit = (event) =>
	{
		event.preventDefault();

		if(!email || !username || !password || !passwordConfirmation || !gender)
		{
			setError("Please fill in all fields!");
		}

		else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
		{
			setError("Please enter a valid email address.");
		}

		else if(password !== passwordConfirmation)
		{
			setError("Passwords do not match.");
		}

		else if(password.length < 6)
		{
			setError("Password must be at least 6 characters long.");
		}

		else if(!(/[A-Z]/.test(password)))
		{
			setError("Password does not contain an uppercase letter.");
		}

		else if(!(/[a-z]/.test(password)))
		{
			setError("Password does not contain a lowercase letter.");
		}

		else if(!(/[0-9]/.test(password)))
		{
			setError("Password does not contain a digit.");
		}

		else if(isAllLettersAndNumbers(password))
		{
			setError("Password does not contain a special character.");
		}

		else
		{
			setError("");

			const formData = new FormData();
			formData.append("Email", email);
			formData.append("Username", username);
			formData.append("Password", password);
			formData.append("Gender", gender);
			formData.append("Icon", icon);

			fetch("api/Accounts/register",
				{
					method: "POST",
					body: formData,
				})
				.then(data =>
				{
					if(data.ok)
					{
						setError("Register Success");
						navigate("/login");
					}

					else
					{
						setError("Register FAILED");
					}
				})
				.catch(error =>
				{
					console.log(error);
					setError("Register ERROR");
				});
		}
	};

	return (
		<div className="registerContainer">
			<h3>Login</h3>
			<form onSubmit={handleSubmit}>
				<div>
					<label className="registerInput" htmlFor="email">Email:</label>
				</div>
				<div>
					<input type="email" id="email-register-input" name="email" value={email} onChange={handleChangeToForms} />
				</div>
				<div>
					<label className="registerInput" htmlFor="username">Username:</label>
				</div>
				<div>
					<input type="text" id="username-register-input" name="username" value={username} onChange={handleChangeToForms} />
				</div>
				<div>
					<label className="registerInput" htmlFor="password">Password:</label>
				</div>
				<div>
					<input type="password" id="password-register-input" name="password" value={password} onChange={handleChangeToForms} />
				</div>
				<div>
					<label className="registerInput" htmlFor="password">Confirm Password:</label>
				</div>
				<div>
					<input type="password" id="password-confirmation-register-input" name="password-confirmation" value={passwordConfirmation} onChange={handleChangeToForms} />
				</div>
				<div>
					<label className="registerInput" htmlFor="gender">Gender:</label>
				</div>
				<div>
					<input type="text" id="gender-register-input" name="gender" value={gender} onChange={handleChangeToForms} />
				</div>
				<div>
					<label className="registerInput" htmlFor="icon">Icon:</label>
				</div>
				<div>
					<input type="file" id="icon-register-input" name="icon" onChange={handleChangeToForms} />
				</div>
				<div>
					<button type="submit">Register</button>
				</div>
			</form>

			<h4>{error}</h4>
		</div>
	);
}

export default Register;