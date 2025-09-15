"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	TeamOutlined,
	TrophyOutlined,
	GlobalOutlined,
} from "@ant-design/icons";
import "./Achievements.css";

const AnimatedNumber = ({ value, hasAnimated }) => {
	const [count, setCount] = useState(hasAnimated ? value : 0);

	useEffect(() => {
		if (hasAnimated) {
			setCount(value);
			return;
		}

		const duration = 2000;
		const increment = 50;
		let start = 0;
		const step = value / (duration / increment);

		const counter = setInterval(() => {
			start += step;
			if (start >= value) {
				setCount(value);
				clearInterval(counter);
			} else {
				setCount(Math.ceil(start));
			}
		}, increment);

		return () => clearInterval(counter);
	}, [value, hasAnimated]);

	return <span>{count}</span>;
};

const Achievements = () => {
	const [hasAnimated, setHasAnimated] = useState(false);
	const sectionRef = useRef(null);

	useEffect(() => {
		// Check localStorage only after component mounts
		const animationPlayed =
			localStorage.getItem("achievementsAnimated") === "true";
		setHasAnimated(animationPlayed);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasAnimated) {
					setHasAnimated(true);
					localStorage.setItem("achievementsAnimated", "true");
				}
			},
			{ threshold: 0.1 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, [hasAnimated]);

	return (
		<div className="achievements-container" ref={sectionRef}>
			<div className="achievements-content">
				<h2 className="achievements-title">Achievements</h2>

				<div className="achievements-grid">
					<div className="achievement-item">
						<TeamOutlined className="achievement-icon" />
						<h3 className="achievement-number">
							<AnimatedNumber value={500} hasAnimated={hasAnimated} />
							<span className="achievement-plus">+</span>
						</h3>
						<p className="achievement-label">Community members</p>
					</div>

					<div className="achievement-item">
						<GlobalOutlined className="achievement-icon" />
						<h3 className="achievement-number">
							<AnimatedNumber value={100} hasAnimated={hasAnimated} />
							<span className="achievement-plus">+</span>
						</h3>
						<p className="achievement-label">Professionals across the U.S.</p>
					</div>

					<div className="achievement-item">
						<TrophyOutlined className="achievement-icon" />
						<h3 className="achievement-number">
							<AnimatedNumber value={15} hasAnimated={hasAnimated} />
							<span className="achievement-plus">+</span>
						</h3>
						<p className="achievement-label">Years of Experience</p>
					</div>
				</div>

				<div className="achievements-info">
					<div className="info-section">
						<h3>Representation</h3>
						<p>
                            Our community includes over 500 members from diverse backgrounds
                            across various industries and organizations, and we make sure 
                            that everybody is welcomed.
						</p>
					</div>

					<div className="info-section">
						<h3>Mentor Network</h3>
						<p>
							Our platform is powered by a diverse network of 100+ experienced
							professionals across the United States, bringing expertise from various
							industries and backgrounds.
						</p>
					</div>
					<div className="info-section">
						<h3>Industry Experience</h3>
						<p>
							With over 15+ years of combined industry experience, our mentors
							provide deep insights and practical guidance based on real-world
							expertise.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Achievements;
