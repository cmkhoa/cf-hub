"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/contexts/langprov";
import "./MissionStatement.css";

const MissionStatement = () => {
	const { t } = useLang();
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
		{ text: t("missionStatement.words.cfHub"), highlight: true },
		{ text: t("missionStatement.words.empowers"), highlight: false },
		{ text: t("missionStatement.words.youngProfessionals"), highlight: true },
		{ text: t("missionStatement.words.toSecureJobs"), highlight: false },
		{ text: t("missionStatement.words.finance"), highlight: true },
		{ text: t("missionStatement.words.operations"), highlight: true },
		{ text: t("missionStatement.words.strategy"), highlight: true },
		{ text: t("missionStatement.words.marketing"), highlight: true },
		{ text: t("missionStatement.words.management"), highlight: true },
		{ text: t("missionStatement.words.andBeyond"), highlight: false },
		{ text: t("missionStatement.words.throughDedicated"), highlight: false },
		{ text: t("missionStatement.words.mentorship"), highlight: true },
		{ text: t("missionStatement.words.and"), highlight: false },
		{ text: t("missionStatement.words.support"), highlight: true },
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
						<div className="stat-text">{t("missionStatement.stats.careerSuccess")}</div>
					</div>
					<div className="stat-item">
						<div className="stat-icon">👥</div>
						<div className="stat-text">{t("missionStatement.stats.expertMentorship")}</div>
					</div>
					<div className="stat-item">
						<div className="stat-icon">🚀</div>
						<div className="stat-text">{t("missionStatement.stats.professionalGrowth")}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MissionStatement;

