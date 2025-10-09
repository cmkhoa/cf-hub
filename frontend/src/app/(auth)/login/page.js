"use client";
import React, { useState, useEffect } from "react";
import {
	Button,
	Form,
	Input,
	Typography,
	Card,
	Divider,
	message,
	Alert,
    Layout,
} from "antd";
import { GoogleOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";
import { useAuth } from "@/contexts/authContext/authContext";
import HeaderComponent from "@/components/header/header";

const { Title, Text } = Typography;

const LoginPage = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [form] = Form.useForm();
	const { userLoggedIn, login, loginWithGoogle } = useAuth();
	const [navCurrent, setNavCurrent] = useState('login');
	const handleClick = (e)=> setNavCurrent(e.key);

	// Check if user is already logged in
	useEffect(() => {
		if (userLoggedIn) {
			router.push("/");
		}
	}, [userLoggedIn, router]);

	const onFinish = async (values) => {
		if (loading) return;

		setLoading(true);
		setError(null);

		try {
			await login(values.email, values.password);
			message.success("Login successful!");
			router.push("/");
		} catch (error) {
			setError(error.message);
			message.error(error.message || "Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		if (loading) return;

		setLoading(true);
		setError(null);

		try {
			await loginWithGoogle();
			message.success("Login successful!");
			router.push("/");
		} catch (error) {
			setError(error.message);
			message.error("Google login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<HeaderComponent current={navCurrent} handleClick={handleClick} />
			<div className={styles.container}>
			<Card className={styles.loginCard}>
				<Title level={2} className={styles.title}>
					Welcome Back
				</Title>
				<Text className={styles.subtitle}>Sign in to your account</Text>

				{error && (
					<Alert
						message="Error"
						description={error}
						type="error"
						showIcon
						className={styles.alert}
						closable
						onClose={() => setError(null)}
					/>
				)}

				<Button
					icon={<GoogleOutlined />}
					onClick={handleGoogleLogin}
					className={styles.googleButton}
					disabled={loading}
					block
				>
					Sign in with Google
				</Button>

				<Divider className={styles.divider}>Or</Divider>

				<Form
					form={form}
					name="login"
					onFinish={onFinish}
					layout="vertical"
					className={styles.form}
				>
					<Form.Item
						name="email"
						rules={[
							{ required: true, message: "Please input your email!" },
							{ type: "email", message: "Please enter a valid email!" },
						]}
					>
						<Input
							prefix={<MailOutlined />}
							placeholder="Email"
							size="large"
							disabled={loading}
						/>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: "Please input your password!" }]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="Password"
							size="large"
							disabled={loading}
						/>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							loading={loading}
							className={styles.submitButton}
							block
						>
							Sign In
						</Button>
					</Form.Item>
				</Form>

				<div className={styles.footer}>
					<Text>Don't have an account? </Text>
					<Link href="/register">Sign up</Link>
				</div>
			</Card>
			</div>
		</Layout>
	);
};

export default LoginPage;
