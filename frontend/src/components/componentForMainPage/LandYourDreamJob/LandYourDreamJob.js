import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Typography } from "antd";
import Image from "next/image";
import "./LandYourDreamJob.css";

const { Text } = Typography;

const LandYourDreamJob = () => {
	const [researchLabCount, setResearchLabCount] = useState(0);
	const [dellInternshipCount, setDellInternshipCount] = useState(0);
	const [dowJonesInternshipCount, setDowJonesInternshipCount] = useState(0);

	const researchLabRef = useRef(null);
	const dellInternshipRef = useRef(null);
	const dowJonesInternshipRef = useRef(null);

	useEffect(() => {
		const duration = 2000;
		const increment = 50;

		const animateCount = (setCount, end) => {
			let start = 0;
			const step = end / (duration / increment);
			const counter = setInterval(() => {
				start += step;
				if (start >= end) {
					setCount(end);
					clearInterval(counter);
				} else {
					setCount(Math.ceil(start));
				}
			}, increment);
		};

		const handleIntersect = (entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (entry.target === researchLabRef.current) {
						animateCount(setResearchLabCount, 10);
					} else if (entry.target === dellInternshipRef.current) {
						animateCount(setDellInternshipCount, 28);
					} else if (entry.target === dowJonesInternshipRef.current) {
						animateCount(setDowJonesInternshipCount, 5);
					}
				}
			});
		};

		const observer = new IntersectionObserver(handleIntersect, {
			threshold: 0.1,
		});

		if (researchLabRef.current) observer.observe(researchLabRef.current);
		if (dellInternshipRef.current) observer.observe(dellInternshipRef.current);
		if (dowJonesInternshipRef.current)
			observer.observe(dowJonesInternshipRef.current);

		return () => observer.disconnect();
	}, []);

	return (
		<div className="container">
			<Text className="main-title">Land Your Dream Offers</Text>
			<div className="small-container">
				<Text className="description">
					In the first year of launching the 2024 program, we helped{" "}
					<span className="primary-color">32 mentees</span> secure multiple{" "}
					<span className="primary-color">interviews and job offers</span> from
					major companies in the U.S. like Capital One, Uber, Smithfield, Unilever, and JP Morgan Chase.{" "}
				</Text>
				<Text className="description">
					Our mentors have experience in various fields such as{" "}
					<span className="primary-color">
						Software, Data, Finance, and Consulting
					</span>
				</Text>
				<Row gutter={[16, 16]} className="statistics">
					{/* <Col xs={24} sm={8} md={8} className="stat-item" ref={researchLabRef}>
						<Text className="stat-number">{researchLabCount}</Text>
						<Text className="stat-description">
							offers in research labs and data programs
						</Text>
					</Col> */}
					<Col
						xs={24}
						sm={8}
						md={8}
						className="stat-item"
						ref={dellInternshipRef}
					>
						<Text className="stat-number">{dellInternshipCount}</Text>
						<Text className="stat-description">
							job offers in the U.S.
						</Text>
					</Col>
					{/* <Col
						xs={24}
						sm={8}
						md={8}
						className="stat-item"
						ref={dowJonesInternshipRef}
					>
						<Text className="stat-number">{dowJonesInternshipCount}</Text>
						<Text className="stat-description">
							new grad offers in the U.S.
						</Text>
					</Col> */}
				</Row>
			</div>
			<div className="image-container">
				<Image
					src="/assets/offers.jpg"
					alt="Dream Job Image"
					className="large-image"
					width={800}
					height={400}
					style={{ objectFit: "cover" }}
				/>
			</div>
		</div>
	);
};

export default LandYourDreamJob;
