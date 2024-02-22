import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import loginRequired from "./components/LoginRequired";
import RankingIndex from "./pages/Ranking/index";

const RankingPage = loginRequired(RankingIndex);

const AppRoutes = [
	{
		index: true,
		element: <Home />
	},
	{
		path: '/login',
		element: <Login />
	},
	{
		path: '/register',
		element: <Register />
	},
	{
		path: '/ranking',
		element: <RankingPage />
	}
];

export default AppRoutes;
