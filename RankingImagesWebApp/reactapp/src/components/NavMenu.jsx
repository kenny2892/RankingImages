import React, { useState, useEffect } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import UserHeader from './UserHeader';
import '../css/NavMenu.css';

const NavMenu = () =>
{
	const [collapsed, setCollapsed] = useState(true);
	const toggleNavbar = () => setCollapsed(!collapsed);

	const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
	const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
	const themeDropdownToggle = () => setThemeDropdownOpen((prevState) => !prevState);

	function changeTheme(newTheme)
	{
		setTheme(newTheme);
	}

	useEffect(() =>
	{
		localStorage.setItem("theme", theme);
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	return (
		<header>
			<Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3 fixed-top" container>
				<NavbarBrand tag={Link} to="/">Ranking Images</NavbarBrand>
				<NavbarToggler onClick={toggleNavbar} className="mr-2" />
				<Collapse className="d-sm-inline-flex flex-sm-row" isOpen={!collapsed} navbar>
					<ul className="navbar-nav flex-grow">
						<NavItem>
							<NavLink tag={Link} to="/ranking">Rankings</NavLink>
						</NavItem>
					</ul>
				</Collapse>
				<h5>Theme: </h5>
				<Dropdown className="theme-dropdown"  isOpen={themeDropdownOpen} toggle={themeDropdownToggle}>
					<DropdownToggle>{`${theme.charAt(0).toUpperCase()}${theme.slice(1).replace("-", " ")}`}</DropdownToggle>
					<DropdownMenu>
						<DropdownItem onClick={() => changeTheme("light")}>Light</DropdownItem>
						<DropdownItem onClick={() => changeTheme("dark")}>Dark</DropdownItem>
						<DropdownItem onClick={() => changeTheme("red")}>Red</DropdownItem>
						<DropdownItem onClick={() => changeTheme("green")}>Green</DropdownItem>
						<DropdownItem onClick={() => changeTheme("blue")}>Blue</DropdownItem>
						<DropdownItem onClick={() => changeTheme("light-blue")}>Light Blue</DropdownItem>
						<DropdownItem onClick={() => changeTheme("purple")}>Purple</DropdownItem>
						<DropdownItem onClick={() => changeTheme("orange")}>Orange</DropdownItem>
						<DropdownItem onClick={() => changeTheme("pink")}>Pink</DropdownItem>
					</DropdownMenu>
				</Dropdown>

				<UserHeader />
			</Navbar>
		</header>
	);
}

export default NavMenu;


//export class NavMenu extends Component {
//	static displayName = NavMenu.name;

//	constructor(props) 
//	{
//		super(props);

//		this.toggleNavbar = this.toggleNavbar.bind(this);
//		this.state =
//		{
//			collapsed: true
//		};
//	}

//	toggleNavbar() 
//	{
//		this.setState(
//		{
//			collapsed: !this.state.collapsed
//		});
//	}

//	render()
//	{
//		const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
//		const themeDropdownToggle = () => setThemeDropdownOpen((prevState) => !prevState);

//		return (
//			<header>
//				<Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3 fixed-top" container light>
//					<NavbarBrand tag={Link} to="/">Ranking Images</NavbarBrand>
//					<NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
//					<Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
//						<ul className="navbar-nav flex-grow">
//							<NavItem>
//								<NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
//							</NavItem>
//							<NavItem>
//								<NavLink tag={Link} className="text-dark" to="/secret">Secret</NavLink>
//							</NavItem>
//							<NavItem>
//								<NavLink tag={Link} className="text-dark" to="/ranking">Rankings</NavLink>
//							</NavItem>
//						</ul>
//					</Collapse>

//					<Dropdown isOpen={themeDropdownOpen} toggle={themeDropdownToggle}>
//						<DropdownToggle>Dropdown</DropdownToggle>
//						<DropdownMenu {...args}>
//							<DropdownItem header>Header</DropdownItem>
//							<DropdownItem>Some Action</DropdownItem>
//							<DropdownItem text>Dropdown Item Text</DropdownItem>
//							<DropdownItem disabled>Action (disabled)</DropdownItem>
//							<DropdownItem divider />
//							<DropdownItem>Foo Action</DropdownItem>
//							<DropdownItem>Bar Action</DropdownItem>
//							<DropdownItem>Quo Action</DropdownItem>
//						</DropdownMenu>
//					</Dropdown>

//					<UserHeader />
//				</Navbar>
//			</header>
//		);
//	}
//}
