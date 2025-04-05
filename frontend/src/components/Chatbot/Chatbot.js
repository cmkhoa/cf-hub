"use client";
import React, { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import PromptSuggestionsRow from "./PromptSuggestionsRow.js";
import LoadingBubble from "./LoadingBubble.js";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import "./Chatbot.css";

const Chatbot = () => {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const chatContainerRef = useRef(null);

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
					<h3>CF Hub Assistant</h3>
					<button className="close-button" onClick={toggleChat}>
						<CloseOutlined />
					</button>
				</div>
				<div className="chat-messages" ref={chatContainerRef}>
					{noMessages ? (
						<>
							<p className="starter-text">
								Hi, I'm the CF Hub Chatbot. How can I help you today?
							</p>
							<PromptSuggestionsRow />
						</>
					) : (
						<>
							{messages.map((message, index) => (
								<div
									key={index}
									className={`message ${
										message.role === "user" ? "user" : "assistant"
									}`}
								>
									{message.content}
								</div>
							))}
							{isLoading && <LoadingBubble />}
						</>
					)}
				</div>
				<form onSubmit={handleSubmit} className="chat-input-form">
					<input
						className="chat-input"
						onChange={handleInputChange}
						value={input}
						placeholder="Ask me something..."
					/>
					<button type="submit" className="send-button">
						Send
					</button>
				</form>
			</div>

			{/* Floating Button */}
			<button className="chat-toggle-button" onClick={toggleChat}>
				<MessageOutlined />
			</button>
		</div>
	);
};

export default Chatbot;
