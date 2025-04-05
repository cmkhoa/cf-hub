import React, { useState, useEffect, useRef } from "react";
import {
	TeamOutlined,
	TrophyOutlined,
	GlobalOutlined,
} from "@ant-design/icons";
import "./Achievements.css";

const AnimatedNumber = ({ end, duration = 2000, hasAnimated }) => {
	const [count, setCount] = useState(hasAnimated ? end : 0);
	const countRef = useRef(null);

	useEffect(() => {
		if (hasAnimated) {
			setCount(end);
			return;
		}

		const startTime = Date.now();
		const endValue = parseInt(end);

		const animate = () => {
			const currentTime = Date.now();
			const progress = Math.min((currentTime - startTime) / duration, 1);

			// Easing function for smooth deceleration
			const easeOutQuart = 1 - Math.pow(1 - progress, 4);
			const currentValue = Math.floor(endValue * easeOutQuart);

			setCount(currentValue);

			if (progress < 1) {
				countRef.current = requestAnimationFrame(animate);
			}
		};

		countRef.current = requestAnimationFrame(animate);

		return () => {
			if (countRef.current) {
				cancelAnimationFrame(countRef.current);
			}
		};
	}, [end, duration, hasAnimated]);

	return <span>{count}</span>;
};

const Achievements = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [hasAnimated, setHasAnimated] = useState(() => {
		// Check if animation has already played
		return localStorage.getItem("achievementsAnimated") === "true";
	});
	const sectionRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasAnimated) {
					setIsVisible(true);
					setHasAnimated(true);
					// Store animation state
					localStorage.setItem("achievementsAnimated", "true");
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, [hasAnimated]);

	return (
		<div className="achievements-container" ref={sectionRef}>
			<div className="achievements-content">
				<h2 className="achievements-title">Achievements</h2>

				<div className="achievements-grid">
					<div className="achievement-item">
						<TeamOutlined className="achievement-icon" />
						<h3 className="achievement-number">
							<AnimatedNumber end={100} hasAnimated={hasAnimated} />
						</h3>
						<p className="achievement-label">Successful Mentees</p>
						<span className="achievement-plus">100+</span>
					</div>

					<div className="achievement-item">
						<GlobalOutlined className="achievement-icon" />
						<h3 className="achievement-number">
							<AnimatedNumber end={100} hasAnimated={hasAnimated} />
						</h3>
						<p className="achievement-label">Mentors across the U.S.</p>
						<span className="achievement-plus">100+</span>
					</div>

					<div className="achievement-item">
						<TrophyOutlined className="achievement-icon" />
						<h3 className="achievement-number">
							<AnimatedNumber end={15} hasAnimated={hasAnimated} />
						</h3>
						<p className="achievement-label">Years of Experience</p>
						<span className="achievement-plus">15+</span>
					</div>
				</div>

				<div className="achievements-info">
					<div className="info-section">
						<h3>Mentee Success</h3>
						<p>
							We have successfully guided and mentored over 100+ students and
							professionals in their career journeys, helping them achieve their
							professional goals.
						</p>
					</div>

					<div className="info-section">
						<h3>Mentor Network</h3>
						<p>
							Our platform is powered by a diverse network of 100+ experienced
							mentors across the United States, bringing expertise from various
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
