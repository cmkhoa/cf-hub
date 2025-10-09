import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, Dropdown, AutoComplete } from "antd";
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
	UserAddOutlined,
	TagOutlined
} from "@ant-design/icons";
import { Input } from 'antd';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext/authContext";
import { message } from "antd";
import "./header.css";
const { Header } = Layout;
import en from "@/app/locales/en.json";
import vi from "@/app/locales/vi.json";
import { useLang } from "@/contexts/langprov";
// Removed unused Input/Search & Typography after layout refactor

const HeaderComponent = ({ current, handleClick }) => {
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [searchSuggestions, setSearchSuggestions] = useState([]);
	const [popularTags, setPopularTags] = useState([]);
	const [recentSearches, setRecentSearches] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const router = useRouter();
	const { currentUser, userLoggedIn, logout } = useAuth();
	const { lang, setLang, t } = useLang();

	useEffect(() => {
		// Check if user is logged in
		if (userLoggedIn && currentUser) {
			// User is already logged in, no need to check localStorage
		}
	}, [userLoggedIn, currentUser]);

	// Load popular tags and recent searches
	useEffect(() => {
		const loadSearchData = async () => {
			try {
				const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
				const [tagsRes] = await Promise.all([
					fetch(`${base}/blog/tags`)
				]);
				const [tagsData] = await Promise.all([tagsRes.json()]);
				setPopularTags(tagsData || []);
			} catch (error) {
				console.error('Failed to load search data:', error);
			}
		};

		// Load recent searches from localStorage
		const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
		setRecentSearches(savedSearches);

		loadSearchData();
	}, []);

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
			// Only navigate to dedicated search page on explicit search action
			if(q) {
				const newRecentSearches = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
				setRecentSearches(newRecentSearches);
				localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
				router.push(`/search?q=${encodeURIComponent(q)}`);
			} else {
				router.push('/search');
			}
		setShowSuggestions(false);
	};

	const handleSearchChange = (value) => {
		setSearchValue(value);
		
		if (!value.trim()) {
			// Show popular tags and recent searches when empty
			const suggestions = [];
			
			// Add recent searches
			if (recentSearches.length > 0) {
				suggestions.push({
					value: '',
					label: (
						<div style={{ fontSize: '12px', color: '#999', padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
							Recent Searches
						</div>
					),
					disabled: true
				});
				
				recentSearches.slice(0, 3).forEach(search => {
					suggestions.push({
						value: search,
						label: (
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<SearchOutlined style={{ color: '#52c41a' }} />
								<span>{search}</span>
							</div>
						),
						type: 'recent'
					});
				});
			}
			
			// Add popular tags
			if (popularTags.length > 0) {
				suggestions.push({
					value: '',
					label: (
						<div style={{ fontSize: '12px', color: '#999', padding: '4px 0', borderBottom: '1px solid #f0f0f0', marginTop: recentSearches.length > 0 ? '8px' : '0' }}>
							Popular Tags
						</div>
					),
					disabled: true
				});
				
				popularTags.slice(0, 5).forEach(tag => {
					suggestions.push({
						value: tag.name,
						label: (
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<TagOutlined style={{ color: '#1890ff' }} />
								<span>{tag.name}</span>
							</div>
						),
						type: 'tag'
					});
				});
			}
			
			setSearchSuggestions(suggestions);
			setShowSuggestions(suggestions.length > 0);
			return;
		}

		// Generate suggestions based on input
		const suggestions = [];
		
		// Add matching tags
		const matchingTags = popularTags
			.filter(tag => tag.name.toLowerCase().includes(value.toLowerCase()))
			.slice(0, 3)
			.map(tag => ({
				value: tag.name,
				label: (
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<TagOutlined style={{ color: '#1890ff' }} />
						<span>Tag: {tag.name}</span>
					</div>
				),
				type: 'tag'
			}));

		// Add recent searches that match
		const matchingRecent = recentSearches
			.filter(search => search.toLowerCase().includes(value.toLowerCase()) && search !== value)
			.slice(0, 2)
			.map(search => ({
				value: search,
				label: (
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<SearchOutlined style={{ color: '#52c41a' }} />
						<span>{search}</span>
					</div>
				),
				type: 'recent'
			}));

		suggestions.push(...matchingTags, ...matchingRecent);
		setSearchSuggestions(suggestions);
		setShowSuggestions(suggestions.length > 0);
	};

		const handleSearchSelect = (value, _option) => {
			// Fill input but do not navigate; user must press Enter or click search icon
			setSearchValue(value);
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
							<a href="/">{t("home")}</a>
						</Menu.Item>
							<Menu.Item key="about">
							<Link href="/about">{t("about")}</Link>
							</Menu.Item>
							<Menu.Item key="news">
							<Link href="/blog">{t("blogs")}</Link>
							</Menu.Item>
							<Menu.Item key="stories">
							<Link href="/stories">{t("stories")}</Link>
							</Menu.Item>
							{/* <Menu.Item key="features">
								<a href="/#features">FEATURES</a>
							</Menu.Item> */}
						</Menu>
						{/* <div className="nav-dropdowns inline">
							<Dropdown
								menu={{ items: categoriesItems, onClick: handleCategorySelect }}
								placement="bottomLeft"
								trigger={['hover']}
							>
								<Button className="dropdown-btn">
									Categories <DownOutlined />
								</Button>
							</Dropdown>
						</div> */}
					</div>
					<div className="nav-right">
						<div className="header-right">
							<div className="nav-search" style={{ display:'flex', alignItems:'center', gap:8 }}>
								<AutoComplete
									value={searchValue}
									options={searchSuggestions}
									onChange={handleSearchChange}
									onSelect={(value, option) => { if (!option.disabled) handleSearchSelect(value, option); }}
									// Do not navigate on type; only show suggestions
									placeholder={t("searchPlaceholder")}
									style={{ width: 260 }}
									open={showSuggestions}
									onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
									onFocus={() => setShowSuggestions(true)}
									dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
									filterOption={(inputValue, option) => {
										if (option.disabled) return true; // Always show disabled options (headers)
										return option.value.toLowerCase().includes(inputValue.toLowerCase());
									}}
								>
									<Input.Search
										allowClear
										onSearch={onNavSearch}
										enterButton={<SearchOutlined />}
										style={{ width: '100%' }}
									/>
								</AutoComplete>
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
									{/* <Button 
										icon={<UserAddOutlined />} 
										className="register-btn"
										onClick={()=> router.push('/register')}
									>
										Sign Up
									</Button> */}
								</div>
							)}
								<Dropdown
									menu={{
									items: [
										{ key: "en", label: "English" },
										{ key: "vi", label: "Tiếng Việt" }
									],
									onClick: ({ key }) => setLang(key),
									}}
									placement="bottomRight"
								>
									<Button>
									{lang === "en" ? "English" : "Tiếng Việt"} <DownOutlined />
									</Button>
								</Dropdown>
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
				title={t("drawerTitle")}
				placement="right"
				onClose={closeDrawer}
				visible={drawerVisible}
				open={drawerVisible}
				aria-label="Main navigation drawer"
				bodyStyle={{ padding: 0 }}
			>
				<Menu
					mode="vertical"
					selectedKeys={[current]}
					onClick={handleClick}
					style={{ borderRight: "none" }}
				>
					{[
						{ key: "home", label: t("home") },
						{ key: "about", label: t("about") },
						{ key: "blog", label: t("blogs") },
						{ key: "conference", label: t("conference") },
						{ key: "videos", label: t("videos") },
						{ key: "support", label: t("support") },
					].map((item) => (
						<Menu.Item key={item.key} onClick={closeDrawer}>
							<Link href={`/${item.key === "home" ? "" : item.key}`} passHref>
								<span>{item.label}</span>
							</Link>
						</Menu.Item>
					))}
				</Menu>
				<div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
					{/* Mobile search (reuse AutoComplete) */}
					<div style={{ marginBottom: 12 }}>
						<AutoComplete
							value={searchValue}
							options={searchSuggestions}
							onChange={handleSearchChange}
							onSelect={(value, option) => { if (!option.disabled) handleSearchSelect(value, option); }}
							// Do not navigate on type; only show suggestions
							placeholder={t("searchPlaceholder")}
							style={{ width: '100%' }}
							open={showSuggestions}
						>
							<Input.Search allowClear onSearch={onNavSearch} />
						</AutoComplete>
					</div>
					{/* Auth actions */}
					<div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
						{userLoggedIn ? (
							<>
								<Button block onClick={() => router.push(currentUser?.role === 'admin' ? '/admin' : '/dashboard')}>Dashboard</Button>
								<Button block onClick={handleLogout}>Logout</Button>
							</>
						) : (
							<>
								<Button block onClick={handleLogin}>Login</Button>
								<Button block onClick={() => router.push('/register')}>Sign Up</Button>
							</>
						)}
					</div>
					{/* Language selector */}
					<div style={{ marginBottom: 8 }}>
						<Dropdown
							menu={{
								items: [
									{ key: "en", label: "English" },
									{ key: "vi", label: "Tiếng Việt" }
								],
								onClick: ({ key }) => setLang(key),
							}}
						>
							<Button block>{lang === 'en' ? 'English' : 'Tiếng Việt'}</Button>
						</Dropdown>
					</div>
				</div>
			</Drawer>
		</>
	);
};

export default HeaderComponent;
