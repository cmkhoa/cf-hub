"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	TeamOutlined,
	TrophyOutlined,
	GlobalOutlined,
} from "@ant-design/icons";
import "./Achievements.css";
import { useLang } from "@/contexts/langprov";

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
    const { t } = useLang();
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
				<h2 className="achievements-title">{t("achievements.title")}</h2>

				<div className="achievements-grid">
					<div className="achievement-item">
						<TeamOutlined className="achievement-icon" />
						<h3 className="achievement-number">
							<AnimatedNumber value={20000} hasAnimated={hasAnimated} />
							<span className="achievement-plus">+</span>
						</h3>
						<p className="achievement-label">{t("achievements.members")}</p>
					</div>

					<div className="achievement-item">
						<GlobalOutlined className="achievement-icon" />
						<h3 className="achievement-number">
							<AnimatedNumber value={100} hasAnimated={hasAnimated} />
							<span className="achievement-plus">+</span>
						</h3>
						<p className="achievement-label">{t("achievements.prosUS")}</p>
					</div>

					<div className="achievement-item">
						<TrophyOutlined className="achievement-icon" />
						<h3 className="achievement-number">
							<AnimatedNumber value={15} hasAnimated={hasAnimated} />
							<span className="achievement-plus">+</span>
						</h3>
						<p className="achievement-label">{t("achievements.years")}</p>
					</div>
				</div>

				<div className="achievements-info">
					<div className="info-section">
						<h3>{t("achievements.repTitle")}</h3>
						<p>{t("achievements.repBody")}</p>
					</div>

					<div className="info-section">
						<h3>{t("achievements.mentorTitle")}</h3>
						<p>{t("achievements.mentorBody")}</p>
					</div>
					<div className="info-section">
						<h3>{t("achievements.industryTitle")}</h3>
						<p>{t("achievements.industryBody")}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Achievements;
