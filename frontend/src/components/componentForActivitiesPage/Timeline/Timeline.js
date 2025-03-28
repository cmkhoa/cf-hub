import React from "react";
import { Typography } from "antd";
import "./Timeline.css";

const { Title, Text } = Typography;

const timelineData = [
	{
		title: "Job Search & Networking Strategy",
		date: "Workshop 1",
		description:
			"Master essential job search strategies, from leveraging professional platforms to crafting effective outreach emails and securing referrals, with a focus on landing opportunities at top-tier firms in consulting, banking, and investment.",
		tag: "Networking",
	},
	{
		title: "Resume Review and Optimization",
		date: "Workshop 2",
		description:
			"Craft a powerful ATS-optimized resume highlighting your finance, consulting, and supply chain expertise through personalized mentorship and detailed feedback sessions",
		tag: "Resume",
	},
	{
		title: "Behavioral Interview Preparation",
		date: "Workshop 3",
		description:
			"Master interview success through STAR methodology training, hands-on practice with industry-specific questions, and personalized 1:1 mock interviews with expert feedback.",
		tag: "Interview",
	},
	{
		title: "Break into Wall Streets",
		date: "Workshop 4",
		description:
			"Explore the dynamic world of Investment Banking through an insider's guide to roles, responsibilities, and career progression. Learn key entry paths, required skills, and success strategies from experienced professionals in global financial markets.",
		tag: "Career",
	},
	{
		title: "Bullet Proof Problem Solving",
		date: "Workshop 5",
		description:
			"Master strategic problem-solving techniques through hands-on practice with MECE frameworks and issue trees, analyzing real business cases to develop and implement optimal solutions.",
		tag: "Strategy",
	},
	{
		title: "Applied Excel",
		date: "Workshop 6",
		description:
			"Learn powerful Excel techniques for real-world business analysis, from advanced formulas to data visualization and financial modeling.",
		tag: "Technical",
	},
	{
		title: "Presentation: Data Storytelling",
		date: "Workshop 7",
		description:
			"Unlock essential job search strategies, from leveraging professional platforms to crafting effective outreach emails for opportunities at top-tier firms",
		tag: "Communication",
	},
	{
		title: "Essential Excel & Presentation Training",
		date: "Workshop 8",
		description:
			"Excel and PowerPoint essentials: Optimize your productivity by focusing on the vital 20% of features that drive 80% of business analysis tasks, from power shortcuts to data visualization best practices.",
		tag: "Technical",
	},
	{
		title: "Case Study Review",
		date: "Workshop 9",
		description:
			"Collaborate in small teams of 3-4 to tackle career-relevant projects under expert mentorship. Benefit from detailed mentor reviews and constructive feedback to enhance your work. Polish your deliverables to professional standards and strengthen your resume with meaningful project experience.",
		tag: "Project",
	},
	{
		title: "Case Competition",
		date: "Workshop 10",
		description:
			"Experience the thrill of a 24-hour case competition: collaborate in teams of 3-4 to analyze real business challenges, develop strategic solutions, and present your findings to a panel of industry experts for valuable feedback.",
		tag: "Competition",
	},
];

const Timeline = () => {
	return (
		<div className="timeline-section">
			<Title level={2} className="timeline-title">
				Workshop Timeline
			</Title>
			<div className="timeline-container">
				{timelineData.map((event, index) => (
					<div
						className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
						key={index}
					>
						<div className="content">
							<span className="event-date">{event.date}</span>
							<Title
								level={4}
								className="event-title"
								style={{ color: "var(--secondary-color)" }}
							>
								{event.title}
							</Title>
							<Text className="event-description">{event.description}</Text>
							<br />
							<span className={`event-tag ${event.tag.toLowerCase()}`}>
								{event.tag}
							</span>
						</div>
					</div>
				))}
				{/* Vertical timeline line */}
				<div className="timeline-line"></div>
			</div>
		</div>
	);
};

export default Timeline;
