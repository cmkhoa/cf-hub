import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

const { Text } = Typography;

const RegisterModal = ({ visible, onClose, onRegister }) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (values) => {
		try {
			setLoading(true);
			const response = await fetch("http://localhost:5000/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Registration failed");
			}

			message.success("Registration successful! Please login.");
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
					Register
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
					name="username"
					rules={[
						{ required: true, message: "Please input your username!" },
						{ min: 3, message: "Username must be at least 3 characters!" },
					]}
				>
					<Input
						prefix={<UserOutlined style={{ color: "var(--cf-hub-coral)" }} />}
						placeholder="Username"
						size="large"
						style={{ borderRadius: "8px" }}
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
						prefix={<MailOutlined style={{ color: "var(--cf-hub-coral)" }} />}
						placeholder="Email"
						size="large"
						style={{ borderRadius: "8px" }}
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
						prefix={<LockOutlined style={{ color: "var(--cf-hub-coral)" }} />}
						placeholder="Password"
						size="large"
						style={{ borderRadius: "8px" }}
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
						prefix={<LockOutlined style={{ color: "var(--cf-hub-coral)" }} />}
						placeholder="Confirm Password"
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
						Register
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default RegisterModal;
