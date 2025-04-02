"use client";
import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Card, Avatar, Typography, Spin } from "antd";
import {
	SendOutlined,
	RobotOutlined,
	UserOutlined,
	MessageOutlined,
} from "@ant-design/icons";
import ApiService from "@/services/api";

const { TextArea } = Input;
const { Text } = Typography;

const Chatbot = () => {
	const [messages, setMessages] = useState([
		{
			type: "bot",
			content:
				"Hello! I'm your AI assistant for CF Hub Mentorship. I can help you with information about our programs, career guidance, and mentorship opportunities. How can I assist you today?",
			timestamp: new Date().toISOString(),
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim()) return;

		const userMessage = {
			type: "user",
			content: input,
			timestamp: new Date().toISOString(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		try {
			const data = await ApiService.sendChatMessage(input);

			const botMessage = {
				type: "bot",
				content: data.response,
				timestamp: new Date().toISOString(),
			};

			setMessages((prev) => [...prev, botMessage]);
		} catch (error) {
			console.error("Error:", error);
			const errorMessage = {
				type: "bot",
				content: "Sorry, I encountered an error. Please try again later.",
				timestamp: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<>
			{!isOpen ? (
				<Button
					type="primary"
					shape="circle"
					icon={<MessageOutlined />}
					onClick={() => setIsOpen(true)}
					style={{
						position: "fixed",
						bottom: 20,
						right: 20,
						width: 50,
						height: 50,
						zIndex: 1000,
						boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
						backgroundColor: "var(--cf-hub-coral)",
						borderColor: "var(--cf-hub-coral)",
					}}
				/>
			) : (
				<Card
					title={
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<span
								style={{ fontWeight: "bold", color: "var(--cf-hub-coral)" }}
							>
								CF Hub Assistant
							</span>
							<Button
								type="text"
								onClick={() => setIsOpen(false)}
								style={{
									fontSize: "20px",
									padding: "0 8px",
									color: "var(--cf-hub-coral)",
								}}
							>
								×
							</Button>
						</div>
					}
					style={{
						width: 400,
						position: "fixed",
						bottom: 20,
						right: 20,
						zIndex: 1000,
						boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
						borderRadius: "12px",
					}}
				>
					<div
						style={{
							height: 400,
							overflowY: "auto",
							marginBottom: 16,
							padding: "0 4px",
						}}
					>
						{messages.map((message, index) => (
							<div
								key={index}
								style={{
									display: "flex",
									marginBottom: 16,
									flexDirection:
										message.type === "user" ? "row-reverse" : "row",
								}}
							>
								<Avatar
									icon={
										message.type === "user" ? (
											<UserOutlined />
										) : (
											<RobotOutlined />
										)
									}
									style={{
										backgroundColor:
											message.type === "user"
												? "var(--cf-hub-coral-light)"
												: "#52c41a",
										margin: "0 8px",
									}}
								/>
								<div
									style={{
										maxWidth: "70%",
										padding: "8px 12px",
										borderRadius: "8px",
										backgroundColor:
											message.type === "user"
												? "var(--cf-hub-coral-light)"
												: "#f6ffed",
									}}
								>
									<Text>{message.content}</Text>
								</div>
							</div>
						))}
						{loading && (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									marginTop: 16,
								}}
							>
								<Spin />
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
					<div style={{ display: "flex", gap: 8 }}>
						<TextArea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Ask me anything about our programs, career guidance, or mentorship..."
							autoSize={{ minRows: 1, maxRows: 4 }}
							style={{
								flex: 1,
								borderRadius: "8px",
								resize: "none",
							}}
						/>
						<Button
							type="primary"
							icon={<SendOutlined />}
							onClick={handleSend}
							loading={loading}
							disabled={!input.trim()}
							style={{
								backgroundColor: "var(--cf-hub-coral)",
								borderColor: "var(--cf-hub-coral)",
							}}
						/>
					</div>
				</Card>
			)}
		</>
	);
};

export default Chatbot;
