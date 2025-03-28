import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Menu, Button, Drawer } from "antd";
import Link from "next/link";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";

const { Header } = Layout;

const HeaderComponent = ({ current, handleClick }) => {
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [loginModalVisible, setLoginModalVisible] = useState(false);
	const [registerModalVisible, setRegisterModalVisible] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Check if user is logged in
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const showDrawer = () => {
		setDrawerVisible(true);
	};

	const closeDrawer = () => {
		setDrawerVisible(false);
	};

	const handleLogin = (userData) => {
		setUser(userData);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
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
								alt="Pathwise Logo"
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
							color: "var(--primary-color)",
						}}
					>
						{[
							"activities",
							"services",
							"results",
							"apply",
							// "about",
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
												current === key ? "var(--primary-color)" : "inherit",
										}}
									>
										{key.charAt(0).toUpperCase() + key.slice(1)}
									</span>
								</Link>
							</Menu.Item>
						))}
						{/* Login Button */}
						<Menu.Item key="login" style={{ borderBottom: "none" }}>
							{user ? (
								<div
									style={{ display: "flex", alignItems: "center", gap: "10px" }}
								>
									<UserOutlined />
									<span>{user.username}</span>
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
									onClick={() => setLoginModalVisible(true)}
									style={{
										backgroundColor: "var(--primary-color)",
										borderColor: "var(--primary-color)",
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
						// "about",
						"blog",
						"contact",
					].map((key) => (
						<Menu.Item key={key} onClick={closeDrawer}>
							<Link href={`/${key === "home" ? "" : key}`} passHref>
								<span
									style={{
										color: current === key ? "var(--primary-color)" : "inherit",
									}}
								>
									{key.charAt(0).toUpperCase() + key.slice(1)}
								</span>
							</Link>
						</Menu.Item>
					))}
					{/* Mobile Login Button */}
					<Menu.Item key="login" onClick={closeDrawer}>
						{user ? (
							<div
								style={{ display: "flex", alignItems: "center", gap: "10px" }}
							>
								<UserOutlined />
								<span>{user.username}</span>
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
									setLoginModalVisible(true);
									closeDrawer();
								}}
								style={{
									backgroundColor: "var(--primary-color)",
									borderColor: "var(--primary-color)",
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
			<LoginModal
				visible={loginModalVisible}
				onClose={() => setLoginModalVisible(false)}
				onLogin={handleLogin}
				onShowRegister={() => setRegisterModalVisible(true)}
			/>

			{/* Register Modal */}
			<RegisterModal
				visible={registerModalVisible}
				onClose={() => setRegisterModalVisible(false)}
				onRegister={() => setLoginModalVisible(true)}
			/>
		</Header>
	);
};

export default HeaderComponent;
