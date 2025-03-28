import React from "react";
import { Typography, Button } from "antd";
import "./HeroSection.css";

const { Title, Text } = Typography;

const HeroSection = () => {
	return (
		<div className="hero-section">
			<div className="overlay">
				<div className="content">
					<Title className="hero-title" style={{ color: "var(--text-color)" }}>
						Transform Your Career Journey with Expert Mentorship
					</Title>
					<Text className="hero-description">
						CF Hub is a comprehensive career mentorship platform connecting
						students with industry professionals across diverse sectors
						including investment banking, risk management, finance, business
						analytics, brand management, demand planning, operations,
						consulting, and technology. Our experienced mentors, hailing from
						leading global companies, provide personalized guidance to help you
						navigate your career path, develop essential skills, and achieve
						your professional goals. Join our community of ambitious
						professionals and take the first step towards your dream career.
					</Text>
					<br />
					<a
						href="https://www.facebook.com/CareerFoundationHub"
						target="_blank"
						rel="noopener noreferrer"
						className="hero-button"
					>
						Learn More
					</a>
				</div>
			</div>
		</div>
	);
};

export default HeroSection;
