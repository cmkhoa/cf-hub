import React from "react";
import { Typography, Carousel } from "antd";
import "./AchievementGallery.css";
import Image from "next/image";

const { Title } = Typography;

const AchievementGallery = () => {
	const images = [
		"/assets/feedbacks/feedback1.png",
		"/assets/feedbacks/feedback2.png",
		"/assets/feedbacks/feedback3.png",
		"/assets/feedbacks/feedback4.png",
		"/assets/feedbacks/feedback5.png",
		"/assets/feedbacks/feedback6.png",
		"/assets/feedbacks/feedback7.png",
		"/assets/feedbacks/feedback8.png",
		"/assets/feedbacks/feedback9.png",
		"/assets/feedbacks/feedback10.png",
		"/assets/feedbacks/feedback11.png",
		"/assets/feedbacks/feedback12.png",
		"/assets/feedbacks/feedback13.png",
		"/assets/feedbacks/feedback14.png",
	];

	return (
		<div className="trusted-by-container">
			<div className="title-container">
				<Title
					level={2}
					className="title-text"
					style={{
						fontWeight: 700,
						fontSize: 40,
						lineHeight: "65.35px",
						textAlign: "center",
						color: "white",
					}}
				>
					Mentees Thoughts
				</Title>
			</div>
			<Carousel
				dots={{ className: "carousel-dots" }}
				arrows={true}
				slidesToShow={5}
				slidesToScroll={1}
				infinite={true}
				centerMode={true}
				centerPadding="15px"
				autoplay
				responsive={[
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
						},
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 1,
						},
					},
				]}
			>
				{images.map((imgSrc, index) => (
					<div key={index} className="carousel-item">
						<div className="image-wrapper">
							<Image
								src={imgSrc}
								alt={`Feedback ${index + 1}`}
								width={300}
								height={400}
								className="feedback-image"
							/>
						</div>
					</div>
				))}
			</Carousel>
		</div>
	);
};

export default AchievementGallery;
