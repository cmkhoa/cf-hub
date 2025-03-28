import React from "react";
import { Row, Col, Typography, Card } from "antd";
import "./Features.css";

const { Title, Text } = Typography;

const Features = () => {
	return (
		<div className="features-container">
			<Row gutter={[16, 16]} justify="center">
				<Col xs={24} md={24} lg={4}>
					<Title
						level={2}
						className="feature-title"
						style={{
							fontWeight: 700,
							fontSize: 40,
							lineHeight: "65.35px",
							textAlign: "center",
							// color: "white",
						}}
					>
						Features
					</Title>
				</Col>
				<Col xs={24} md={24} lg={20}>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} md={12} lg={12} xl={6}>
							<Card className="feature-item" bordered={false}>
								<Title level={4} className="feature-heading">
									10 Sessions of Training and Mentorship
								</Title>
								<Text className="feature-content">
									Covering the entire job application process, from
									resume and personal projects to behavioral and technical
									interviews. Weekly 1-on-1 advisory meetings to address any
									questions, with unlimited interview support.
								</Text>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={12} lg={12} xl={6}>
							<Card className="feature-item" bordered={false}>
								<Title level={4} className="feature-heading">
									Direct Guidance
								</Title>
								<Text className="feature-content">
                Work on real-world business and finance projects with other mentees while receiving continuous, personalized mentorship from two dedicated mentors
								</Text>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={12} lg={12} xl={6}>
							<Card className="feature-item" bordered={false}>
								<Title level={4} className="feature-heading">
									Mock Interviews
								</Title>
								<Text className="feature-content">
									Tailored for each research lab and company. Receive the latest
									updates on the job market and gain a clear understanding of
									each company unique characteristics.
								</Text>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={12} lg={12} xl={6}>
							<Card className="feature-item" bordered={false}>
								<Title level={4} className="feature-heading">
									Networking Support
								</Title>
								<Text className="feature-content">
									Assistance with securing referrals, applying to companies, and
									advancing your career.
								</Text>
							</Card>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
};

export default Features;
