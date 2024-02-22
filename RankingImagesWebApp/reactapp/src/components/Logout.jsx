
async function logoutUser()
{
	try
	{
		const response = await fetch('api/Accounts/logout',
			{
				method: "POST",
				credentials: "include",
				headers:
				{
					'Content-Type': 'application/json'
				}
			});

		if(response.ok)
		{
			console.log("Logged Out");
			window.location.href = '/'; // Refreshes Page
		}

		else
		{
			console.log("Log Out Failed");
			console.log(response);
		}
	}

	catch(error)
	{
		console.log("Could not log out");
		console.log(error);
	}
}

export default logoutUser;