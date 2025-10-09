"use client";
import React, { useState, useEffect, Suspense } from "react";
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
import {
	GoogleOutlined,
	MailOutlined,
	LockOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";
import { useAuth } from "@/contexts/authContext/authContext";
import HeaderComponent from "@/components/header/header";

const { Title, Text } = Typography;

export const dynamic = 'force-dynamic';

const RegisterPageInner = () => {
	const router = useRouter();
	const search = useSearchParams();
	const nextPath = search?.get('next') || '/';
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [form] = Form.useForm();
	const { userLoggedIn, register, loginWithGoogle } = useAuth();
	const [navCurrent, setNavCurrent] = useState('register');
	const handleClick = (e)=> setNavCurrent(e.key);

	// Check if user is already logged in
	useEffect(() => {
		if (userLoggedIn) {
			router.push(nextPath.startsWith('/') ? nextPath : '/');
		}
	}, [userLoggedIn, router, nextPath]);

	const onFinish = async (values) => {
		if (loading) return;

		setLoading(true);
		setError(null);

		try {
			await register(values.email, values.password, values.name);
			message.success("Registration successful!");
			router.push(nextPath.startsWith('/') ? nextPath : '/');
		} catch (error) {
			setError(error.message);
			message.error(error.message || "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleRegister = async () => {
		if (loading) return;

		setLoading(true);
		setError(null);

		try {
			await loginWithGoogle();
			message.success("Registration successful!");
			router.push(nextPath.startsWith('/') ? nextPath : '/');
		} catch (error) {
			setError(error.message);
			message.error("Google registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<HeaderComponent current={navCurrent} handleClick={handleClick} />
			<div className={styles.container}>
			<Card className={styles.registerCard}>
				<Title level={2} className={styles.title}>
					Create Account
				</Title>
				<Text className={styles.subtitle}>Join our community today</Text>

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
					onClick={handleGoogleRegister}
					className={styles.googleButton}
					disabled={loading}
					block
				>
					Sign up with Google
				</Button>

				<Divider className={styles.divider}>Or</Divider>

				<Form
					form={form}
					name="register"
					onFinish={onFinish}
					layout="vertical"
					className={styles.form}
				>
					<Form.Item
						name="name"
						rules={[{ required: true, message: "Please input your name!" }]}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder="Full Name"
							size="large"
							disabled={loading}
						/>
					</Form.Item>

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
						rules={[
							{ required: true, message: "Please input your password!" },
							{ min: 6, message: "Password must be at least 6 characters!" },
						]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="Password"
							size="large"
							disabled={loading}
						/>
					</Form.Item>

					<Form.Item
						name="confirmPassword"
						dependencies={["password"]}
						rules={[
							{ required: true, message: "Please confirm your password!" },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue("password") === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error("The two passwords do not match!")
									);
								},
							}),
						]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="Confirm Password"
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
							Sign Up
						</Button>
					</Form.Item>
				</Form>

				<div className={styles.footer}>
					<Text>Already have an account? </Text>
					<Link href="/login">Sign in</Link>
				</div>
			</Card>
			</div>
		</Layout>
	);
};

export default function RegisterPage(){
	return (
		<Suspense fallback={<div />}> 
			<RegisterPageInner />
		</Suspense>
	);
}
