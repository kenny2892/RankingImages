import React, { Component } from 'react';
import { Layout } from './components/Layout';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import 'bootstrap/dist/css/bootstrap.css';
import './css/Themes.css'
import './css/index.css'

export default class App extends Component
{
	static displayName = App.name;

	render()
	{
		return (
			<Layout>
				<Routes>
					{AppRoutes.map((route, index) =>
					{
						const { element, ...rest } = route;
						return <Route key={index} {...rest} element={element} />;
					})}
				</Routes>
			</Layout>
		);
	}
}