import React from "react";
import { Row, Col, Typography } from "antd";
import Link from "next/link";
import {
	FacebookOutlined,
	MailOutlined,
	InstagramOutlined,
	LinkedinOutlined,
} from "@ant-design/icons";
import "./Footer.css";
import { useRouter } from "next/navigation";

const { Title } = Typography;

const FooterComponent = () => {
	const router = useRouter();
	return (
		<div className="footer">
			<div className="footer-container">
				<Row gutter={[16, 16]} justify="start">
					{/* Logo Section */}
					<Col xs={24} sm={12} md={8} lg={8} className="footer-logo-col">
						<div className="footer-logo">
							<img src="assets/logo.png" alt="Logo" className="logo-image-2" />
							<div className="social-icons">
								<a
									href="https://www.facebook.com/CareerFoundationHub"
									target="_blank"
									rel="noopener noreferrer"
								>
									<FacebookOutlined className="social-icon" />
								</a>
								<a
									href="mailto:techprep.mentor@gmail.com"
									target="_blank"
									rel="noopener noreferrer"
								>
									<MailOutlined className="social-icon" />
								</a>
								<a
									href="https://www.instagram.com/cf.hub_2025/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<InstagramOutlined className="social-icon" />
								</a>
								<a
									href="https://www.linkedin.com/in/tribuidinh/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<LinkedinOutlined className="social-icon" />
								</a>
							</div>
						</div>
					</Col>

					{/* Information Links */}
					<Col xs={12} sm={6} md={4} lg={4}>
						<Title
							level={4}
							className="footer-title"
							style={{ color: "white" }}
						>
							Information
						</Title>
						<a className="footer-link" onClick={() => router.push("/results")}>
							Outcomes Report
						</a>
						<a className="footer-link" onClick={() => router.push("/results")}>
							Fellow Stories
						</a>
						<a className="footer-link" onClick={() => router.push("/about")}>
							Our Mentors
						</a>
						<a className="footer-link" onClick={() => router.push("/")}>
							FAQ
						</a>
					</Col>

					{/* Company Links */}
					<Col xs={12} sm={6} md={4} lg={4}>
						<Title
							level={4}
							className="footer-title"
							style={{ color: "white" }}
						>
							Company
						</Title>
						<a className="footer-link" onClick={() => router.push("/about")}>
							About Us
						</a>
						<a className="footer-link" onClick={() => router.push("/contact")}>
							Contact Us
						</a>
					</Col>

					{/* Resource Links */}
					<Col xs={12} sm={6} md={4} lg={4}>
						<Title
							level={4}
							className="footer-title"
							style={{ color: "white" }}
						>
							Resource
						</Title>
						<Link href="#" className="footer-link">
							Blog
						</Link>
						<Link href="#" className="footer-link">
							Privacy Policy
						</Link>
						<Link href="#" className="footer-link">
							Terms of Use
						</Link>
					</Col>

					{/* Industry Tracks Links */}
					<Col xs={12} sm={6} md={4} lg={4}>
						<Title
							level={4}
							className="footer-title"
							style={{ color: "white" }}
						>
							Industry Tracks
						</Title>
						<a className="footer-link" onClick={() => router.push("/services")}>
							Investment Banking
						</a>
						<a className="footer-link" onClick={() => router.push("/services")}>
							Risk Management, Finance, Business Analytics
						</a>
						<a className="footer-link" onClick={() => router.push("/services")}>
							Brand Management, FP&A, Demand Planning
						</a>
						<a className="footer-link" onClick={() => router.push("/services")}>
							Operation, Business Analytics, Finance
						</a>
					</Col>
				</Row>

				{/* Contact Email */}
				<div className="contact-email">
					<span>Contact: </span>
					<a href="mailto:cfhub.mentor@gmail.com">cfhub.mentor@gmail.com</a>
				</div>
			</div>
		</div>
	);
};

export default FooterComponent;
