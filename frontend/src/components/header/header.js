import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, Dropdown } from "antd";
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
import { Input } from 'antd';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext/authContext";
import { message } from "antd";
import "./header.css";
const { Header } = Layout;
// Removed unused Input/Search & Typography after layout refactor

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
		{ key:'big-tech-fortune-500-top-companies', label:'Big Tech, Fortune 500 & Top Companies' },
		{ key:'events-community', label:'Events & Community' },
		{ key:'main-blog', label:'Main Blog' },
		{ key:'professional-development', label:'Professional Development' },
		{ key:'resume-job-search-interview-tips', label:'Resume, Job Search & Interview Tips' },
		{ key:'industry-insights', label:'Industry Insights' },
		{ key:'networking-tips', label:'Networking Tips' },
		{ key:'success-stories', label:'Career Stories' },
		{ key:'viet-career-conference', label:'Viet Career Conference' },
		{ key:'webinars-workshops', label:'Webinars & Workshops' },
	];

	const handleCategorySelect = ({ key }) => {
		router.push(`/blog?category=${encodeURIComponent(key)}`);
	};

	const onNavSearch = (value) => {
		const q = (value || '').trim();
		if(q) router.push(`/blog?q=${encodeURIComponent(q)}`);
		else router.push('/blog');
	};

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
			{/* Unified Desktop Header (mobile unchanged via media queries) */}
			<Header className="main-header unified-header">
				<div className="nav-wrapper">
					<div className="nav-left">
						<Link href="/" className="logo-container" aria-label="CF Hub Home">
							<Image
								src="/images/cfhub-logo.jpg"
								alt="CF Hub Logo"
								width={40}
								height={40}
								className="logo-img"
								priority
							/>
							<span className="logo-text">CF Hub</span>
						</Link>
					</div>
					<div className="nav-center">
						<Menu
							mode="horizontal"
							selectedKeys={[]}
							onClick={handleClick}
							className="main-nav-menu unified no-select-effect"
						>
							<Menu.Item key="home">
								<a href="/">HOME</a>
							</Menu.Item>
							<Menu.Item key="about">
								<Link href="/about">ABOUT</Link>
							</Menu.Item>
							<Menu.Item key="news">
								<Link href="/blog">BLOGS</Link>
							</Menu.Item>
							<Menu.Item key="success">
								<a href="/#success">SUCCESS</a>
							</Menu.Item>
							<Menu.Item key="features">
								<a href="/#features">FEATURES</a>
							</Menu.Item>
						</Menu>
						<div className="nav-dropdowns inline">
							<Dropdown
								menu={{ items: categoriesItems, onClick: handleCategorySelect }}
								placement="bottomLeft"
								trigger={['hover']}
							>
								<Button className="dropdown-btn">
									Categories <DownOutlined />
								</Button>
							</Dropdown>
						</div>
					</div>
					<div className="nav-right">
						<div className="header-right">
							<div className="nav-search" style={{ display:'flex', alignItems:'center', gap:8 }}>
								<Input.Search
									placeholder="Search articles"
									allowClear
									onSearch={onNavSearch}
									enterButton={<SearchOutlined />}
									style={{ width: 260 }}
								/>
							</div>
								{userLoggedIn ? (
									<div className="user-info" style={{display:'flex', alignItems:'center', gap:8}}>
										<button
											onClick={()=> router.push(currentUser?.role === 'admin' ? '/admin' : '/dashboard')}
											style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, padding:0 }}
											aria-label="User dashboard"
										>
											<UserOutlined className="user-icon" />
											<span className="user-name">{currentUser.name}</span>
										</button>
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
										onClick={()=> router.push('/register')}
									>
										Sign Up
									</Button>
								</div>
							)}
							<Button
								icon={<MenuOutlined />}
								onClick={showDrawer}
								className="mobile-menu-btn"
							/>
						</div>
					</div>
				</div>
			</Header>

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
