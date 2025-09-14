import React from "react";
import { Card, Typography, Carousel } from "antd";
import "./MenteeShowcase.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

const { Title, Text: AntText } = Typography;
const { Meta } = Card;

const mentees = [
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "JP Morgan Chase",
		position: "Investment Banking Analyst",
		location: "New York, NY",
	},
	{
		name: "Mentee",
		company: "Uber",
		position: "Senior Analyst, Financial Risk Management",
		location: "San Francisco, CA",
		image: "/assets/blank-profile-picture.jpg",
	},
	{
		name: "Mentee",
		company: "Unilever",
		position: "Brand Manager",
		location: "New York, NY",
		image: "/assets/blank-profile-picture.jpg",
	},
	{
		name: "Mentee",
		company: "Capital One",
		position: "Senior Business Manager",
		location: "Richmond, VA",
		image: "/assets/blank-profile-picture.jpg",
	},
	{
		name: "Mentee",
		company: "Amazon",
		position: "Software Development Engineer",
		location: "Seattle, WA",
		image: "/assets/blank-profile-picture.jpg",
	},
];

const MenteeShowcase = () => {
	const router = useRouter();
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
				{mentees.map((mentee, index) => (
					<div key={index} className="carousel-slide">
						<Card hoverable className="mentor-card">
							<div className="mentor-image-container">
								<Image
									src={mentee.image}
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
