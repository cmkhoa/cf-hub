"use client";
import { useState, useEffect } from "react";
import "./SuccessMetrics.css";

const SuccessMetrics = () => {
	const metrics = [
		{
			id: 1,
			title: "100",
			subtitle: "applications received",
			color: "#B8D4E8",
			textColor: "#2C5F87",
		},
		{
			id: 2,
			title: "9+",
			subtitle: "mentees got job/internship offers after 3 months",
			color: "#1C3D5A",
			textColor: "#FFFFFF",
		},
		{
			id: 3,
			title: "8 professions",
			subtitle: "From business to engineering\nFrom industry to academia",
			color: "#6B6B6B",
			textColor: "#FFFFFF",
		},
		{
			id: 4,
			title: "50+",
			subtitle: "mentoring pairs",
			color: "#B8D4E8",
			textColor: "#2C5F87",
		},
	];

	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % metrics.length);
		}, 3000); // Change slide every 3 seconds

		return () => clearInterval(timer);
	}, [metrics.length]);

	const goToSlide = (index) => {
		setCurrentSlide(index);
	};

	return (
		<div className="success-metrics-container">
			<div className="success-metrics-header">
				<h2>CAME 2018</h2>
				<h3>success stories</h3>
			</div>

			<div className="slideshow-container">
				{metrics.map((metric, index) => (
					<div
						key={metric.id}
						className={`metric-slide ${
							index === currentSlide ? "active" : ""
						}`}
						style={{
							backgroundColor: metric.color,
							color: metric.textColor,
						}}
					>
						<div className="metric-content">
							<h1 className="metric-title">{metric.title}</h1>
							<p className="metric-subtitle">{metric.subtitle}</p>
						</div>
					</div>
				))}
			</div>

			<div className="dots-container">
				{metrics.map((_, index) => (
					<span
						key={index}
						className={`dot ${index === currentSlide ? "active" : ""}`}
						onClick={() => goToSlide(index)}
					></span>
				))}
			</div>
		</div>
	);
};

export default SuccessMetrics;

