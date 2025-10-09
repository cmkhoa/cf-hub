"use client";
import { useEffect, useRef, useState } from "react";
import "./MissionStatement.css";

const MissionStatement = () => {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
					}
				});
			},
			{ threshold: 0.2 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, []);

	const words = [
		{ text: "CF Hub", highlight: true },
		{ text: "empowers", highlight: false },
		{ text: "young professionals", highlight: true },
		{ text: "to secure jobs and build successful careers in", highlight: false },
		{ text: "finance,", highlight: true },
		{ text: "operations,", highlight: true },
		{ text: "strategy,", highlight: true },
		{ text: "marketing,", highlight: true },
		{ text: "management,", highlight: true },
		{ text: "and beyond", highlight: false },
		{ text: "through dedicated", highlight: false },
		{ text: "mentorship", highlight: true },
		{ text: "and", highlight: false },
		{ text: "support.", highlight: true },
	];

	return (
		<div
			ref={sectionRef}
			className={`mission-statement-container ${isVisible ? "visible" : ""}`}
		>
			<div className="mission-background">
				<div className="floating-shape shape-1"></div>
				<div className="floating-shape shape-2"></div>
				<div className="floating-shape shape-3"></div>
			</div>

			<div className="mission-content">
				<div className="mission-text">
					{words.map((word, index) => (
						<span
							key={index}
							className={`mission-word ${
								word.highlight ? "highlight" : ""
							}`}
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							{word.text}{" "}
						</span>
					))}
				</div>

				<div className="mission-divider"></div>

				<div className="mission-stats">
					<div className="stat-item">
						<div className="stat-icon">🎯</div>
						<div className="stat-text">Career Success</div>
					</div>
					<div className="stat-item">
						<div className="stat-icon">👥</div>
						<div className="stat-text">Expert Mentorship</div>
					</div>
					<div className="stat-item">
						<div className="stat-icon">🚀</div>
						<div className="stat-text">Professional Growth</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MissionStatement;

