import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Text } = Typography;

const LoginModal = ({ visible, onClose, onLogin, onShowRegister }) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (values) => {
		try {
			setLoading(true);
			const response = await fetch("http://localhost:5000/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Login failed");
			}

			// Store token in localStorage
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));

			message.success("Login successful!");
			onLogin(data.user);
			onClose();
			form.resetFields();
		} catch (error) {
			message.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			title={
				<Text
					style={{
						fontSize: "24px",
						fontWeight: "600",
						color: "var(--cf-hub-blue)",
					}}
				>
					Login
				</Text>
			}
			open={visible}
			onCancel={onClose}
			footer={null}
			width={400}
			style={{ borderRadius: "12px" }}
		>
			<Form form={form} onFinish={handleSubmit} layout="vertical">
				<Form.Item
					name="email"
					rules={[
						{ required: true, message: "Please input your email!" },
						{ type: "email", message: "Please enter a valid email!" },
					]}
				>
					<Input
						prefix={<UserOutlined style={{ color: "var(--cf-hub-coral)" }} />}
						placeholder="Email"
						size="large"
						style={{ borderRadius: "8px" }}
					/>
				</Form.Item>

				<Form.Item
					name="password"
					rules={[{ required: true, message: "Please input your password!" }]}
				>
					<Input.Password
						prefix={<LockOutlined style={{ color: "var(--cf-hub-coral)" }} />}
						placeholder="Password"
						size="large"
						style={{ borderRadius: "8px" }}
					/>
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={loading}
						block
						size="large"
						style={{
							backgroundColor: "var(--cf-hub-coral)",
							borderColor: "var(--cf-hub-coral)",
							borderRadius: "8px",
							height: "45px",
							fontSize: "16px",
							fontWeight: "500",
							boxShadow: "0 2px 8px rgba(244, 116, 88, 0.2)",
						}}
					>
						Login
					</Button>
				</Form.Item>

				<div style={{ textAlign: "center" }}>
					<Text style={{ color: "var(--cf-hub-text-secondary)" }}>
						Don't have an account?{" "}
					</Text>
					<Button
						type="link"
						onClick={() => {
							onClose();
							onShowRegister();
						}}
						style={{
							padding: 0,
							color: "var(--cf-hub-coral)",
							fontSize: "14px",
							fontWeight: "500",
						}}
					>
						Register here
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default LoginModal;
