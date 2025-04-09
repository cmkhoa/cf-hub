"use client";
import React, { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import PromptSuggestionsRow from "./PromptSuggestionsRow.js";
import LoadingBubble from "./LoadingBubble.js";
import {
	MessageOutlined,
	CloseOutlined,
	SmileOutlined,
} from "@ant-design/icons";
import "./Chatbot.css";
import { useAuth } from "@/contexts/authContext/authContext";

const Chatbot = () => {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const chatContainerRef = useRef(null);
	const { currentUser } = useAuth();

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		setIsLoading(true);
		setNoMessages(false);

		// Add user message immediately
		setMessages((prev) => [...prev, { role: "user", content: input }]);

		try {
			const response = await fetch("/api/chat/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [...messages, { role: "user", content: input }],
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Handle non-streaming response
			const data = await response.json();

			// Add assistant message
			setMessages((prev) => [...prev, data]);

			setInput("");
		} catch (error) {
			console.error("Error:", error);
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "I apologize, but I encountered an error. Please try again.",
				},
			]);
		}
		setIsLoading(false);
	};

	const [noMessages, setNoMessages] = useState(true);

	const toggleChat = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className="chatbot-wrapper">
			{/* Chat Modal */}
			<div className={`chat-modal ${isOpen ? "open" : ""}`}>
				<div className="chat-header">
					<div className="header-content">
						<h3>Let's Chat!</h3>
						<p className="header-subtitle">We'll reply as soon as we can</p>
					</div>
					<button className="close-button" onClick={toggleChat}>
						<CloseOutlined />
					</button>
				</div>
				<div className="chat-messages" ref={chatContainerRef}>
					{noMessages ? (
						<>
							<div className="message-block assistant-block">
								<div className="message assistant">
									<p>
										{currentUser
											? `Hi, ${currentUser.name}! How can I help you today?`
											: "Hi! How can I help you today?"}
									</p>
								</div>
								<span className="message-time">03:52 PM</span>
							</div>
							<PromptSuggestionsRow />
						</>
					) : (
						<>
							{messages.map((message, index) => (
								<div
									key={index}
									className={`message-block ${
										message.role === "user" ? "user-block" : "assistant-block"
									}`}
								>
									<div
										className={`message ${
											message.role === "user" ? "user" : "assistant"
										}`}
									>
										<p>{message.content}</p>
									</div>
									<span className="message-time">
										{new Date().toLocaleTimeString("en-US", {
											hour: "2-digit",
											minute: "2-digit",
											hour12: true,
										})}
									</span>
								</div>
							))}
							{isLoading && <LoadingBubble />}
						</>
					)}
				</div>
				<form onSubmit={handleSubmit} className="chat-input-form">
					<button type="button" className="emoji-button">
						<SmileOutlined />
					</button>
					<input
						className="chat-input"
						onChange={handleInputChange}
						value={input}
						placeholder="Write your message..."
					/>
					<button type="submit" className="send-button">
						Send
					</button>
				</form>
			</div>

			{/* Floating Button - Conditionally render based on isOpen state */}
			{!isOpen && (
				<button className="chat-toggle-button" onClick={toggleChat}>
					<MessageOutlined />
				</button>
			)}
		</div>
	);
};

export default Chatbot;
