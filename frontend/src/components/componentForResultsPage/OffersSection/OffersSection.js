import React from "react";
import { Row, Col, Card, Typography } from "antd";
import "./OffersSection.css";
import Image from "next/image";

const { Title, Text: AntText } = Typography;

const offersData = [
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Meta",
		position: "Software Engineer Intern",
		location: "Menlo Park, CA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Meta",
		position: "Software Engineer Intern",
		location: "Menlo Park, CA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Meta",
		position: "Software Engineer Intern",
		location: "Menlo Park, CA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Google",
		position: "STEP Software Engineer Intern",
		location: "Mountain View, CA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Alcon",
		position: "Data Science Intern",
		location: "Fort Worth, TX",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Microsoft",
		position: "Financial Analyst Intern",
		location: "Redmond, WA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Microsoft",
		position: "Software Engineer Intern",
		location: "Redmond, WA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Amazon",
		position: "Business Intelligence Engineer Intern",
		location: "Seattle, WA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Dell",
		position: "Data Science Intern",
		location: "Round Rock, TX",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Bank of America",
		position: "Software Engineer Intern",
		location: "Charlotte, NC",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Bank of America",
		position: "Software Engineer Intern",
		location: "Charlotte, NC",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Bill.com",
		position: "Machine Learning Engineer Intern",
		location: "San Jose, CA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Palantir",
		position: "Software Engineer Intern",
		location: "Denver, CO",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Actualization.ai",
		position: "Software Engineer Intern",
		location: "San Francisco, CA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "Microsoft",
		position: "Software Engineer Intern",
		location: "Redmond, WA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "HubSpot",
		position: "Software Engineer Intern",
		location: "Cambridge, MA",
	},
	{
		name: "Mentee",
		image: "/assets/blank-profile-picture.jpg",
		company: "UnitedHealth Group",
		position: "Actuarial Analyst Intern",
		location: "Minnetonka, MN",
	},
];

const newGradOffersData = [
	{
		name: "Mentee",
		school: "University of Massachusetts Amherst",
		year: "Senior",
		major: "Computer Science",
		offers: [
			"Affirm - Software Engineer",
			"Juniper Networks - Software Engineer",
		],
		image: "/assets/blank-profile-picture.jpg",
	},
	{
		name: "Mentee",
		school: "University of South Florida",
		year: "Senior",
		major: "Computer Science",
		offers: ["Microsoft - Software Engineer"],
		image: "/assets/blank-profile-picture.jpg",
	},
	{
		name: "Mentee",
		school: "Columbia University",
		year: "Senior",
		major: "Computer Science",
		offers: ["Morgan Stanley - Software Engineer"],
		image: "/assets/blank-profile-picture.jpg",
	},
	{
		name: "Mentee",
		school: "Reed College",
		year: "Senior",
		major: "Computer Science",
		offers: ["Morgan Stanley - Investment Analyst Parametric"],
		image: "/assets/blank-profile-picture.jpg",
	},
];

const OffersSection = () => {
	return (
		<div className="offers-section">
			<Title level={2} className="section-title">
				Job Offers 2025
			</Title>
			<Row gutter={[24, 24]}>
				{offersData.map((mentee, index) => (
					<Col xs={24} sm={12} md={8} lg={6} key={index}>
						<Card className="offer-card" hoverable>
							<div className="mentee-avatar-container">
								<Image
									src={mentee.image}
									alt={mentee.name}
									width={100}
									height={100}
									className="mentee-avatar"
									style={{ borderRadius: "50%" }}
								/>
							</div>
							<div className="mentee-details">
								<AntText className="mentee-name">{mentee.name}</AntText>
								<AntText className="mentee-info">{`${mentee.company} - ${mentee.position} - ${mentee.location}`}</AntText>
							</div>
						</Card>
					</Col>
				))}
			</Row>
			<Title level={2} className="section-title">
				New Grad Offers 2025
			</Title>
			<Row gutter={[24, 24]}>
				{newGradOffersData.map((mentee, index) => (
					<Col xs={24} sm={12} md={8} lg={6} key={index}>
						<Card className="offer-card" hoverable>
							<div className="mentee-avatar-container">
								<Image
									src={mentee.image}
									alt={mentee.name}
									width={100}
									height={100}
									className="mentee-avatar"
									style={{ borderRadius: "50%" }}
								/>
							</div>
							<div className="mentee-details">
								<AntText className="mentee-name">{mentee.name}</AntText>
								<AntText className="mentee-info">{`${mentee.school} - ${mentee.year}`}</AntText>
								<AntText className="mentee-info">{mentee.major}</AntText>
								<div className="mentee-offers">
									<AntText className="offers-title">Offers:</AntText>
									<ul className="offers-list">
										{mentee.offers.map((offer, idx) => (
											<li key={idx} className="offer-text">
												{offer}
											</li>
										))}
									</ul>
								</div>
							</div>
						</Card>
					</Col>
				))}
			</Row>
		</div>
	);
};

export default OffersSection;
