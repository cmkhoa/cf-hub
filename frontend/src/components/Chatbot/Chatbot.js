"use client";
import React, { useState, useRef, useEffect } from "react";
import PromptSuggestionsRow from "./PromptSuggestionsRow.js";
import LoadingBubble from "./LoadingBubble.js";
import {
	MessageOutlined,
	CloseOutlined,
	SmileOutlined,
} from "@ant-design/icons";
import "./Chatbot.css";
import "./PromptSuggestionsRow.css";
import { useAuth } from "@/contexts/authContext/authContext";
import ChatService from "@/services/chatService";

const Chatbot = () => {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(true);
	const chatContainerRef = useRef(null);
	const { currentUser } = useAuth();
	const chatService = new ChatService();

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleSuggestionClick = (suggestion) => {
		// Auto-send default suggestions immediately (same as follow-ups)
		sendPrompt(suggestion);
	};

	// Reusable sender used by form submit and follow-up click
	const sendPrompt = async (prompt) => {
		const p = String(prompt || '').trim();
		if (!p || isLoading) return;
		setIsLoading(true);
		setNoMessages(false);
		// Add user message immediately
		setMessages((prev) => [...prev, { role: "user", content: p }]);
		// Clear the input right after sending so it disappears from the form
		setInput("");
		try {
			const response = await chatService.generateResponse([...messages, { role: "user", content: p }]);
			setMessages((prev) => [...prev, response]);
		} catch (error) {
			console.error("Error:", error);
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: "I apologize, but I encountered an error. Please try again." },
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFollowUpClick = (suggestion) => {
		// Auto-send follow-up immediately
		sendPrompt(suggestion);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		sendPrompt(input);
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

	// Render plaintext with support for simple bullet/numbered lists.
	// Recognizes lines starting with '-', '*', '•', or '1.', '1)'.
	// Also linkifies raw URLs and markdown-style links [text](url).
	const renderMessageContent = (text, isUser) => {
		const textColor = isUser ? "#f5f5f5" : "#333";
		const lines = String(text || "").split(/\r?\n/);
		const elements = [];
		let i = 0;
		let blockKey = 0;
		const isUlItem = (ln) => /^\s*([-*•])\s+(.+)/.test(ln);
		const isOlItem = (ln) => /^\s*(\d+)[\.)]\s+(.+)/.test(ln);

		// Render inline text with links: raw URLs and [text](url)
		const renderInlineWithLinks = (txt) => {
			// Matches, in priority order: markdown links, raw URLs, bold (**text** or __text__)
			const combined = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(https?:\/\/[^\s)]+)|(\*\*([^*]+)\*\*|__([^_]+)__)/g;
			const nodes = [];
			let lastIndex = 0;
			let match;
			while ((match = combined.exec(txt)) !== null) {
				if (match.index > lastIndex) {
					nodes.push(<span key={`t-${blockKey}-${lastIndex}`}>{txt.slice(lastIndex, match.index)}</span>);
				}
				if (match[1]) {
					// markdown link
					const display = match[2];
					const href = match[3];
					nodes.push(
						<a key={`l-${blockKey}-${match.index}`} href={href} target="_blank" rel="noopener noreferrer">
							{display}
						</a>
					);
				} else if (match[4]) {
					const href = match[4];
					nodes.push(
						<a key={`l-${blockKey}-${match.index}`} href={href} target="_blank" rel="noopener noreferrer">
							{href}
						</a>
					);
				} else if (match[5]) {
					// bold (**text** or __text__)
					const boldText = match[6] || match[7] || '';
					nodes.push(<strong key={`b-${blockKey}-${match.index}`}>{boldText}</strong>);
				}
				lastIndex = combined.lastIndex;
			}
			if (lastIndex < txt.length) {
				nodes.push(<span key={`t-${blockKey}-end`}>{txt.slice(lastIndex)}</span>);
			}
			return nodes;
		};

		while (i < lines.length) {
			const line = lines[i];
			if (line.trim() === "") { i++; continue; }

			if (isUlItem(line)) {
				const items = [];
				while (i < lines.length && isUlItem(lines[i])) {
					const m = lines[i].match(/^\s*([-*•])\s+(.+)/);
					items.push(m[2]);
					i++;
				}
					elements.push(
						<ul key={`ul-${blockKey++}`} style={{ margin: '0 0 0.5em 1.2em', padding: 0, color: textColor }}>
							{items.map((t, idx) => (<li key={`uli-${blockKey}-${idx}`}>{renderInlineWithLinks(t)}</li>))}
						</ul>
					);
				continue;
			}

			if (isOlItem(line)) {
				const items = [];
				while (i < lines.length && isOlItem(lines[i])) {
					const m = lines[i].match(/^\s*(\d+)[\.)]\s+(.+)/);
					items.push(m[2]);
					i++;
				}
				elements.push(
					<ol key={`ol-${blockKey++}`} style={{ margin: '0 0 0.5em 1.2em', padding: 0, color: textColor }}>
						{items.map((t, idx) => (<li key={`oli-${blockKey}-${idx}`}>{renderInlineWithLinks(t)}</li>))}
					</ol>
				);
				continue;
			}

			// Regular paragraph: gather consecutive lines until blank or list
			const paraLines = [line];
			i++;
			while (i < lines.length && lines[i].trim() !== '' && !isUlItem(lines[i]) && !isOlItem(lines[i])) {
				paraLines.push(lines[i]);
				i++;
			}
			elements.push(
				<p key={`p-${blockKey++}`} style={{ color: textColor, margin: '0 0 0.5em 0' }}>
					{paraLines.map((l, idx) => (
						<span key={`pl-${idx}`}>
							{renderInlineWithLinks(l)}
							{idx < paraLines.length - 1 ? <br /> : null}
						</span>
					))}
				</p>
			);
		}

		return elements;
	};

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
							<PromptSuggestionsRow onSuggestionClick={handleSuggestionClick} />
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
										<div>
											{renderMessageContent(message.content, message.role === "user")}
										</div>
									</div>
									{/* Follow-ups: render right below but outside the assistant bubble */}
									{message.role !== 'user' && Array.isArray(message.followUps) && message.followUps.length > 0 && (
										<div className="prompt-suggestions" style={{ marginTop: 8 }}>
											{message.followUps.map((f, idx) => (
												<button
													key={idx}
													type="button"
													className="suggestion-button"
													onClick={() => handleFollowUpClick(f)}
												>
													{f}
												</button>
											))}
										</div>
									)}
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
					{/* Global follow-ups row removed; per-bubble suggestions are shown above */}
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
