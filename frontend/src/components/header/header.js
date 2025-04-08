import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Menu, Button, Drawer } from "antd";
import Link from "next/link";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext/authContext";
import { message } from "antd";
const { Header } = Layout;

const HeaderComponent = ({ current, handleClick }) => {
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [loginModalVisible, setLoginModalVisible] = useState(false);
	const [registerModalVisible, setRegisterModalVisible] = useState(false);
	const router = useRouter();
	const { currentUser, userLoggedIn, logout } = useAuth();

	useEffect(() => {
		// Check if user is logged in
		if (userLoggedIn && currentUser) {
			// User is already logged in, no need to check localStorage
		}
	}, [userLoggedIn, currentUser]);

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

	return (
		<Header
			style={{
				position: "sticky",
				top: 0,
				zIndex: 1,
				width: "100%",
				backgroundColor: "white",
				height: "70px",
				display: "flex",
				alignItems: "center",
				padding: "0 20px",
			}}
		>
			<Row justify="space-between" align="middle" style={{ width: "100%" }}>
				<Col xs={18} sm={18} md={10} lg={10}>
					<Link href="/" passHref>
						<div className="logo-container">
							<Image
								src="/assets/logo.png"
								width={120}
								height={50}
								className="logo-image"
								alt="CF Hub Logo"
								priority
								style={{ objectFit: "contain" }}
							/>
						</div>
					</Link>
				</Col>

				{/* Desktop Menu */}
				<Col xs={0} sm={0} md={14} lg={14}>
					<Menu
						theme="light"
						mode="horizontal"
						selectedKeys={[current]}
						onClick={handleClick}
						style={{
							borderBottom: "none",
							justifyContent: "flex-end",
							fontWeight: 400,
							fontSize: 16,
							color: "var(--cf-hub-coral)",
						}}
					>
						{[
							"activities",
							"services",
							"results",
							"apply",
							"blog",
							"contact",
						].map((key) => (
							<Menu.Item
								key={key}
								style={{ borderBottom: "none", marginRight: "20px" }}
							>
								<Link href={`/${key === "home" ? "" : key}`} passHref>
									<span
										style={{
											color:
												current === key ? "var(--cf-hub-coral)" : "inherit",
										}}
									>
										{key.charAt(0).toUpperCase() + key.slice(1)}
									</span>
								</Link>
							</Menu.Item>
						))}
						{/* Login Button */}
						<Menu.Item key="login" style={{ borderBottom: "none" }}>
							{userLoggedIn ? (
								<div
									style={{ display: "flex", alignItems: "center", gap: "10px" }}
								>
									<UserOutlined />
									<span>{currentUser.name}</span>
									<Button
										type="link"
										onClick={handleLogout}
										style={{ padding: 0 }}
									>
										Logout
									</Button>
								</div>
							) : (
								<Button
									type="primary"
									onClick={handleLogin}
									className="login-button"
									style={{
										backgroundColor: "#F0386B",
										borderColor: "#F0386B",
									}}
								>
									Login
								</Button>
							)}
						</Menu.Item>
					</Menu>
				</Col>

				{/* Mobile Menu Button */}
				<Col xs={6} sm={6} md={0} lg={0}>
					<Button
						icon={<MenuOutlined />}
						onClick={showDrawer}
						style={{
							border: "none",
							backgroundColor: "transparent",
							color: "var(--primary-color)",
							boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
							marginLeft: 20,
						}}
					/>
				</Col>
			</Row>

			{/* Drawer for Mobile Menu */}
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
						"activities",
						"services",
						"results",
						"apply",
						"blog",
						"contact",
					].map((key) => (
						<Menu.Item key={key} onClick={closeDrawer}>
							<Link href={`/${key === "home" ? "" : key}`} passHref>
								<span
									style={{
										color: current === key ? "var(--cf-hub-coral)" : "inherit",
									}}
								>
									{key.charAt(0).toUpperCase() + key.slice(1)}
								</span>
							</Link>
						</Menu.Item>
					))}
					{/* Mobile Login Button */}
					<Menu.Item key="login" onClick={closeDrawer}>
						{userLoggedIn ? (
							<div
								style={{ display: "flex", alignItems: "center", gap: "10px" }}
							>
								<UserOutlined />
								<span>{currentUser.name}</span>
								<Button
									type="link"
									onClick={handleLogout}
									style={{ padding: 0 }}
								>
									Logout
								</Button>
							</div>
						) : (
							<Button
								type="primary"
								onClick={() => {
									handleLogin();
									closeDrawer();
								}}
								style={{
									backgroundColor: "var(--cf-hub-coral)",
									borderColor: "var(--cf-hub-coral)",
									width: "100%",
								}}
							>
								Login
							</Button>
						)}
					</Menu.Item>
				</Menu>
			</Drawer>

			{/* Login Modal */}
			{/* <LoginModal
				visible={loginModalVisible}
				onClose={() => setLoginModalVisible(false)}
				onLogin={handleLogin}
				onShowRegister={() => setRegisterModalVisible(true)}
			/>

			{/* Register Modal */}
			{/* <RegisterModal
				visible={registerModalVisible}
				onClose={() => setRegisterModalVisible(false)}
				onRegister={() => setLoginModalVisible(true)}
			/> */}
		</Header>
	);
};

export default HeaderComponent;
