"use client";
import React from "react";
import { Typography, Carousel } from "antd";
import "./AboutUs.css";

const { Title, Paragraph } = Typography;

const AboutUs = () => {
	// Sample images - replace with your actual images
	const images = [
		{
			src: "/assets/mentors/winnie.jpg",
			alt: "CF Hub Team",
		},
		{
			src: "/assets/mentors/linhnguyen.jpg",
			alt: "CF Hub Events",
		},
		{
			src: "/assets/mentors/hoanguyen.jpg",
			alt: "CF Hub Mentorship",
		},
	];
	

	return (
		<div className="about-us-container">
			<div className="about-us-content">
				<h2 className="about-us-title"> About Us </h2>
				<Paragraph className="about-us-description">
					CF Hub is a mentorship platform dedicated to connecting students with
					industry professionals in the finance sector. Our mission is to bridge
					the gap between academic learning and real-world experience by
					providing personalized mentorship, career guidance, and networking
					opportunities. Through our programs, we empower the next generation of
					finance professionals with the knowledge, skills, and connections they
					need to succeed in their careers.
				</Paragraph>
			</div>

			<div className="image-carousel-container">
				<Carousel className="image-carousel" arrows autoplay>
					{images.map((image, index) => (
						<div key={index} className="carousel-item">
							<img src={image.src} alt={image.alt} className="carousel-image" />
						</div>
					))}
				</Carousel>
			</div>
		</div>
	);
};

export default AboutUs;
