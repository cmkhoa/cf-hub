import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Menu, Button, Drawer, Input, Dropdown, Typography } from "antd";
import Link from "next/link";
import { 
	MenuOutlined, 
	UserOutlined, 
	SearchOutlined, 
	FacebookOutlined, 
	LinkedinOutlined, 
	YoutubeOutlined,
	DownOutlined,
	LoginOutlined,
	UserAddOutlined
} from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext/authContext";
import { message } from "antd";
import "./header.css";
const { Header } = Layout;
const { Search } = Input;
const { Text: AntText } = Typography;

const HeaderComponent = ({ current, handleClick }) => {
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const router = useRouter();
	const { currentUser, userLoggedIn, logout } = useAuth();

	useEffect(() => {
		// Check if user is logged in
		if (userLoggedIn && currentUser) {
			// User is already logged in, no need to check localStorage
		}
	}, [userLoggedIn, currentUser]);

	// Add scroll event listener
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			setIsScrolled(scrollPosition > 1);
		};

		window.addEventListener("scroll", handleScroll);

		// Initial check
		handleScroll();

		// Cleanup
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const showDrawer = () => {
		setDrawerVisible(true);
	};

	const closeDrawer = () => {
		setDrawerVisible(false);
	};

	const handleLogout = async () => {
		try {
			await logout();
			message.success("Logged out successfully");
		} catch (error) {
			message.error("Failed to log out: " + error.message);
		}
	};

	const handleLogin = () => {
		router.push("/login");
	};

	// Categories dropdown items
	const categoriesItems = [
		{
			key: 'big-tech',
			label: 'Big Tech, Fortune 500 & Top Companies',
		},
		{
			key: 'events-community',
			label: 'Events & Community',
		},
		{
			key: 'main-blog',
			label: 'Main Blog',
		},
		{
			key: 'professional-development',
			label: 'Professional Development',
		},
		{
			key: 'resume-job-search',
			label: 'Resume, Job Search & Interview Tips',
		},
		{
			key: 'immigration-visas',
			label: 'Immigration & Visas',
		},
		{
			key: 'industry-insights',
			label: 'Industry Insights',
		},
		{
			key: 'networking-tips',
			label: 'Networking Tips',
		},
		{
			key: 'success-stories',
			label: 'Success Stories',
		},
		{
			key: 'webinars-workshops',
			label: 'Webinars & Workshops',
		},
	];

	// Tags dropdown items
	const tagsItems = [
		{ key: 'application', label: 'application' },
		{ key: 'behavioral-interview', label: 'behavioral interview' },
		{ key: 'career', label: 'career' },
		{ key: 'computer-science', label: 'computer science' },
		{ key: 'conference', label: 'conference' },
		{ key: 'connection', label: 'connection' },
		{ key: 'google', label: 'google' },
		{ key: 'interview', label: 'interview' },
		{ key: 'job-search', label: 'job search' },
		{ key: 'networking', label: 'networking' },
		{ key: 'referral', label: 'referral' },
		{ key: 'resume', label: 'resume' },
		{ key: 'viet-career-conference', label: 'viet-career-conference' },
		{ key: 'vietnamese', label: 'vietnamese' },
		{ key: 'visa', label: 'visa' },
	];

	return (
		<>
			{/* Top Information Bar */}
			<div className="top-info-bar">
				<div className="container">
					<Row justify="space-between" align="middle">
						<Col>
							<AntText className="top-info-text">About Career Foundation Hub</AntText>
						</Col>
						<Col>
							<AntText className="top-info-text">Recent News</AntText>
						</Col>
					</Row>
				</div>
			</div>

			{/* Main Header */}
			<Header className="main-header">
				<div className="container">
					<Row justify="space-between" align="middle">
						{/* Logo */}
						<Col xs={12} sm={12} md={8} lg={8}>
							<Link href="/" passHref>
								<div className="logo-container">
									<span className="logo-text">CF Hub</span>
								</div>
							</Link>
						</Col>

						{/* Right Side - Social, Search & Auth */}
						<Col xs={12} sm={12} md={16} lg={16}>
							<div className="header-right">
								{/* Social Icons */}
								<div className="social-icons">
									<Button type="text" icon={<FacebookOutlined />} className="social-btn facebook" />
									<Button type="text" icon={<LinkedinOutlined />} className="social-btn linkedin" />
									<Button type="text" icon={<YoutubeOutlined />} className="social-btn youtube" />
								</div>
								
								{/* Search Icon */}
								<Button type="text" icon={<SearchOutlined />} className="search-btn" />

								{/* Auth Buttons */}
								{userLoggedIn ? (
									<div className="user-info">
										<UserOutlined className="user-icon" />
										<span className="user-name">{currentUser.name}</span>
										<Button type="link" onClick={handleLogout} className="logout-btn">
											Logout
										</Button>
									</div>
								) : (
									<div className="auth-buttons">
										<Button 
											icon={<LoginOutlined />} 
											className="login-btn"
											onClick={handleLogin}
										>
											Login
										</Button>
										<Button 
											icon={<UserAddOutlined />} 
											className="register-btn"
										>
											Register
										</Button>
									</div>
								)}

								{/* Mobile Menu Button */}
								<Button
									icon={<MenuOutlined />}
									onClick={showDrawer}
									className="mobile-menu-btn"
								/>
							</div>
						</Col>
					</Row>
				</div>
			</Header>

			{/* Main Navigation Bar */}
			<div className="main-nav-bar">
				<div className="container">
					<Row justify="space-between" align="middle">
						<Col xs={0} sm={0} md={16} lg={16}>
							<Menu
								theme="dark"
								mode="horizontal"
								selectedKeys={[current]}
								onClick={handleClick}
								className="main-nav-menu"
							>
								<Menu.Item key="home">
									<Link href="/">HOME</Link>
								</Menu.Item>
								<Menu.Item key="about">
									<Link href="/about">ABOUT</Link>
								</Menu.Item>
								<Menu.Item key="blog">
									<Link href="/blog">BLOGS</Link>
								</Menu.Item>
								<Menu.Item key="conference">
									<Link href="/conference">VIET CAREER CONFERENCE</Link>
								</Menu.Item>
								<Menu.Item key="videos">
									<Link href="/videos">LATEST VIDEOS</Link>
								</Menu.Item>
								<Menu.Item key="support">
									<Link href="/support">SUPPORT US</Link>
								</Menu.Item>
							</Menu>
						</Col>
						<Col xs={0} sm={0} md={8} lg={8}>
							<div className="nav-dropdowns">
								<Dropdown
									menu={{ items: categoriesItems }}
									placement="bottomLeft"
									trigger={['hover']}
								>
									<Button className="dropdown-btn">
										Categories <DownOutlined />
									</Button>
								</Dropdown>
								<Dropdown
									menu={{ items: tagsItems }}
									placement="bottomLeft"
									trigger={['hover']}
								>
									<Button className="dropdown-btn">
										Tags <DownOutlined />
									</Button>
								</Dropdown>
							</div>
						</Col>
					</Row>
				</div>
			</div>

			{/* Mobile Drawer */}
			<Drawer
				title="CF Hub"
				placement="right"
				onClose={closeDrawer}
				visible={drawerVisible}
				bodyStyle={{ padding: 0 }}
			>
				<Menu
					mode="vertical"
					selectedKeys={[current]}
					onClick={handleClick}
					style={{ borderRight: "none" }}
				>
					{[
						{ key: "home", label: "HOME" },
						{ key: "about", label: "ABOUT" },
						{ key: "blog", label: "BLOGS" },
						{ key: "conference", label: "VIET CAREER CONFERENCE" },
						{ key: "videos", label: "LATEST VIDEOS" },
						{ key: "support", label: "SUPPORT US" },
					].map((item) => (
						<Menu.Item key={item.key} onClick={closeDrawer}>
							<Link href={`/${item.key === "home" ? "" : item.key}`} passHref>
								<span>{item.label}</span>
							</Link>
						</Menu.Item>
					))}
				</Menu>
			</Drawer>
		</>
	);
};

export default HeaderComponent;
