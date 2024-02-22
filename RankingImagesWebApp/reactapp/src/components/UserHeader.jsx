import { useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import logoutUser from './Logout';
import '../css/UserHeader.css';

const UserHeader = () =>
{
	const [username, setUsername] = useState();
	const [gender, setGender] = useState();
	const [email, setEmail] = useState();
	const [icon, setIcon] = useState();
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() =>
	{
		async function fetchProfile()
		{
			try
			{
				const response = await fetch("api/Accounts/profile",
					{
						method: "GET",
						credentials: "include"
					});

				if(response.ok)
				{
					const profileData = await response.json();
					setUsername(profileData.username);
					setIcon(profileData.icon);
					setGender(profileData.gender);
					setEmail(profileData.email);
				}

				else
				{
					return null;
				}
			}

			catch(error)
			{
				return null;
			}
		}

		fetch("api/Accounts/logged-in")
			.then(response => response.json())
			.then(data =>
			{
				if(data.isLoggedIn)
				{
					fetchProfile();
				}
			});
	}, []);

	function toggleUserDropdown()
	{
		setUserDropdownOpen((prevState) => !prevState);
	}

	function logout()
	{
		logoutUser();
		navigate('/');
	}

	return (
		<div className="user-header">
			{
				username != null ?
					<Dropdown className="user-dropdown" isOpen={userDropdownOpen} toggle={toggleUserDropdown}>
						<DropdownToggle>
							<img className="user-dropdown-icon" src={`https://localhost:7268${icon}`} />
						</DropdownToggle>
						<DropdownMenu className="user-dropdown-menu">
							<DropdownItem text className="user-dropdown-menu-name">{username}</DropdownItem>
							<DropdownItem text className="user-dropdown-menu-img-item">
								<img className="user-dropdown-menu-icon" src={`https://localhost:7268${icon}`} />
							</DropdownItem>
							<DropdownItem text>Email: {email}</DropdownItem>
							<DropdownItem text>Gender: {gender}</DropdownItem>
							<DropdownItem divider />
							<DropdownItem onClick={() => logout() }>Logout</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					: 
					<Dropdown className="user-dropdown-temp" isOpen={userDropdownOpen} toggle={toggleUserDropdown}>
						<DropdownToggle>
							<div className="profile-header">
								<h5>Log In</h5>
								<span className="user-dropdown-icon-temp"></span>
							</div>
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem tag={Link} to="/login">Login</DropdownItem>
							<DropdownItem tag={Link} to="/register">Register</DropdownItem>
						</DropdownMenu>
					</Dropdown>
			}
		</div>
	);
}

export default UserHeader;