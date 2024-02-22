import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function loginRequired(WrappedComponent)
{
	return function AuthorizeRoute()
	{
		const [authorized, setAuthorized] = useState(false);
		const navigate = useNavigate();

		useEffect(() =>
		{
			isLoggedIn()
				.then(response =>
				{
					if(response.isLoggedIn)
					{
						setAuthorized(true);
					}

					else
					{
						navigate('/');
					}
				})
				.catch(error =>
				{
					console.error('Error fetching API:', error);
					navigate('/');
				});
		}, []);

		return authorized ? <WrappedComponent /> : null;
	}
}

async function isLoggedIn()
{
	try
	{
		const response = await fetch("api/Accounts/logged-in");
		if(!response.ok)
		{
			throw new Error('Failed to fetch');
		}

		const data = await response.json();
		return data;
	}

	catch(error)
	{
		throw new Error('Failed to fetch');
	}
}

export default loginRequired;