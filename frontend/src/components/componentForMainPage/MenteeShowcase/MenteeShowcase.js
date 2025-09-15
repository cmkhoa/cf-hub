"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Carousel } from "antd";
import "./MenteeShowcase.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { API_ENDPOINTS } from "@/config/api";

const { Title, Text: AntText } = Typography;
const { Meta } = Card;

const PLACEHOLDER = "/assets/blank-profile-picture.jpg";

const MenteeShowcase = () => {
	const router = useRouter();
	const [mentees, setMentees] = useState([]);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				const res = await fetch(API_ENDPOINTS.mentees.list, { next: { revalidate: 60 } });
				const data = await res.json();
				if (!ignore && Array.isArray(data)) setMentees(data);
			} catch (err) {
				console.error("Failed to load mentees", err);
			}
		})();
		return () => {
			ignore = true;
		};
	}, []);

	const imgSrc = (url) => {
		if (!url) return PLACEHOLDER;
		if (url.startsWith("http://") || url.startsWith("https://")) return url;
		return url.startsWith("/") ? url : `/uploads/${url}`;
	};
	return (
		<div className="mentor-showcase-container">
			<Title
				level={2}
				className="section-title"
				style={{
					fontWeight: 700,
					fontSize: 40,
					lineHeight: "65.35px",
					textAlign: "center",
				}}
			>
				Students of Career Foundation Hub
			</Title>
			{/* <AntText className="sub-title">Software Engineer and Data</AntText> */}

			<Carousel
				arrows
				dots={false}
				infinite
				slidesToShow={4}
				slidesToScroll={1}
				responsive={[
					{ breakpoint: 1200, settings: { slidesToShow: 3 } },
					{ breakpoint: 992, settings: { slidesToShow: 2 } },
					{ breakpoint: 768, settings: { slidesToShow: 1 } },
				]}
			>
				{(mentees.length ? mentees : Array.from({ length: 5 }, (_, i) => ({
					name: "Mentee",
					image: PLACEHOLDER,
					company: "",
					position: "",
					location: "",
				}))).map((mentee, index) => (
					<div key={index} className="carousel-slide">
						<Card hoverable className="mentor-card">
							<div className="mentor-image-container">
								<Image
									src={imgSrc(mentee.image)}
									alt={mentee.name}
									width={100}
									height={100}
									className="mentor-image"
									style={{ borderRadius: "50%" }}
								/>
							</div>
							<Meta
								title={mentee.name}
								description={
									<div>
										<div className="mentor-company">{mentee.company}</div>
										<div className="mentor-position">{mentee.position}</div>
										<div className="mentor-location">{mentee.location}</div>
									</div>
								}
								className="mentor-meta"
							/>
						</Card>
					</div>
				))}
			</Carousel>

			<div className="call-to-action">
				<button
					className="custom-button"
					onClick={() => router.push("/results")}
				>
					Learn More
				</button>
			</div>
		</div>
	);
};

export default MenteeShowcase;
