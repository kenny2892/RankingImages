import { useEffect } from "react";

function Home()
{
	useEffect(() =>
	{
		document.title = `Ranking Images`;
	}, []);

	return (
		<div>
			<h3>Ranking Images</h3>
			<p>Log in to your account to view the Rankings tab.</p>
		</div>
	);
}

export default Home;