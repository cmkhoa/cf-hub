import React from "react";
import { Row, Col, Typography, Button } from "antd";
import "./PeerToPeerMentoring.css";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const PeerToPeerMentoring = () => {
	const router = useRouter();

	return (
		<div className="peer-mentoring-container">
			<Row className="peer-mentoring-row" align="middle" justify="center">
				<Col xs={24} md={12} className="content-col">
					<Title level={1} className="main-title">
						Peer-to-Peer Mentoring
					</Title>
					<Text className="subtitle">
						Connect with experienced mentors and fellow students to enhance your
						learning journey. Share knowledge, gain insights, and grow together.
					</Text>
					<Button
						className="get-started-button"
						onClick={() => router.push("/apply")}
					>
						Join Our Community
					</Button>
				</Col>
				<Col xs={24} md={12} className="image-col">
					<div className="mentoring-image">
						<img
							src="/assets/logo.png"
							alt="Peer to Peer Mentoring"
							className="feature-image"
						/>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default PeerToPeerMentoring;
