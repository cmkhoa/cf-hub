import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

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
			title="Register"
			open={visible}
			onCancel={onClose}
			footer={null}
			width={400}
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
						prefix={<UserOutlined />}
						placeholder="Username"
						size="large"
					/>
				</Form.Item>

				<Form.Item
					name="email"
					rules={[
						{ required: true, message: "Please input your email!" },
						{ type: "email", message: "Please enter a valid email!" },
					]}
				>
					<Input prefix={<MailOutlined />} placeholder="Email" size="large" />
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
							backgroundColor: "var(--primary-color)",
							borderColor: "var(--primary-color)",
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
